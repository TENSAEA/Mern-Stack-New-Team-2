const { json } = require("express");
const House = require("../model/houseModel");
const DeletedHouse = require("../model/deletedHouseModel");
const { deletionReasons } = require("../model/deletedHouseModel");
const getAllAvailableProperty = async (req, res) => {
  try {
    let availableHouses = await House.find({
      status: "available",
      approvalStatus: "approved",
    });

    availableHouses = availableHouses.map((house) => {
      if (house.broker) {
        return {
          ...house._doc,
          landlord: undefined,
        };
      }
      return house;
    });
    res.status(200).json(availableHouses);
  } catch (error) {
    console.error("Error finding available houses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllProperty = async (req, res) => {
  try {
    const allhouses = await House.find();
    res.status(200).json({ allhouses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProperty = async (req, res) => {
  try {
    let houses;
    if (req.user.role === "broker") {
      houses = await House.find({ broker: req.user._id });
    } else {
      houses = await House.find({ landlord: req.user._id });
    }
    res.status(200).json({ houses });
  } catch (error) {
    console.error("Error in getProperty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createProperty = async (req, res) => {
  try {
    let houseData = {
      city: req.body.city,
      subCity: req.body.subCity,
      wereda: req.body.wereda,
      comision: req.body.comision,
      specialLocation: req.body.specialLocation,
      type: req.body.type,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      imageCover: req.body.imageCover,
      images: req.body.images,
    };

    if (req.user.role === "broker") {
      houseData.broker = req.user._id;

      if (!("landlord" in req.body)) {
        return res.status(400).json({ message: "You must link a landlord" });
      }
      houseData.landlord = req.body.landlord;
    } else {
      houseData.landlord = req.user._id;
    }

    // // Check if the imageCover is set in the body after multer processing
    // if (!req.body.imageCover) {
    //   return res
    //     .status(400)
    //     .json({ message: "A House must have a cover image" });
    // }

    const house = await House.create(houseData);

    res.status(201).json({
      message: "Property created successfully!",
      data: house,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating property" });
  }
};

const updateProperty = async (req, res) => {
  const { ...updateObject } = req.body;
  try {
    const houseToBeUpdated = await House.findById(req.params.id);

    if (!houseToBeUpdated) {
      return res.status(404).json({ error: "House not found" });
    }

    if (req.user.role === "broker") {
      if (houseToBeUpdated.broker.toString() !== req.user._id.toString()) {
        return res
          .status(401)
          .json({ error: "Unauthorized: You don't own this House" });
      }
    } else {
      if (houseToBeUpdated.landlord.toString() !== req.user._id.toString()) {
        return res
          .status(401)
          .json({ error: "Unauthorized: You don't own this House" });
      }
    }

    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      updateObject,
      { new: true }
    );

    if (!updatedHouse) {
      return res.status(500).json({ error: "Failed to update House" });
    }

    res.status(200).json({ updatedHouse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteProperty = async (req, res) => {
  try {
    const houseToBeDeleted = await House.findById(req.params.id);

    if (!houseToBeDeleted) {
      return res.status(404).json({ error: "House not found" });
    }

    // Ensure imageCover is included in the deletedHouseData
    if (!houseToBeDeleted.imageCover) {
      return res.status(400).json({ error: "House must have a cover image" });
    }

    const deleteResult = await House.deleteOne({ _id: req.params.id });

    if (deleteResult.deletedCount === 0) {
      return res.status(500).json({ error: "Failed to delete House" });
    }

    const deletedHouseData = {
      ...houseToBeDeleted._doc,
      deletionReason: req.body.deletionReason || deletionReasons.USER_DELETED, // Use the enum value
    };

    const newDeletedHouse = new DeletedHouse(deletedHouseData);
    await newDeletedHouse.save();

    res.status(200).json({ message: "House deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const approvalStatusOfProperty = async (req, res) => {
  const { approvalStatus } = req.body;
  try {
    const houseToBeUpdated = await House.findById(req.params.id);

    if (!houseToBeUpdated) {
      return res.status(404).json({ error: "House not found" });
    }
    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: approvalStatus },
      { new: true }
    );

    if (!updatedHouse) {
      return res.status(500).json({ error: "Failed to update Status" });
    }

    res.status(200).json({ updatedHouse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllAvailableProperty,
  getAllProperty,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  approvalStatusOfProperty,
};
