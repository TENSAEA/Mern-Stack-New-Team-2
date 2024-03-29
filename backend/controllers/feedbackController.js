const Feedback = require("../model/feedbackModel");
const mongoose = require("mongoose");

exports.createFeedback = async (req, res) => {
  try {
    const report = {
      house: req.params.id,
      tenant: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
    };

    const oldFeedback = await Feedback.findOne({
      tenant: req.user._id,
      house: req.params.id,
    });

    if (oldFeedback) {
      return res.status(404).json({
        status: "error",
        message:
          "You have already sent feedback for this house, but you can edit your feedback.",
      });
    }
    const reportSent = await Feedback.create(report);

    res.status(201).json({
      status: "success",
      message: "Feedback sent successfully!",
      data: reportSent,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Erro while sending feedback" });
  }
};

exports.getSentFeedback = async (req, res) => {
  try {
    const reports = await Feedback.find({ tenant: req.user._id });
    if (!reports || reports.length === 0) {
      return res
        .status(404)
        .json({ error: "You haven't sent any feedback yet" });
    }

    res.status(200).json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteSentFeedback = async (req, res) => {
  try {
    const reportToBeDeleted = await Feedback.findById(req.params.id);

    if (!reportToBeDeleted) {
      return res.status(404).json({ error: "Feedback doesn't exist" });
    }

    if (reportToBeDeleted.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "It is not yours to delete" });
    }

    const deleteResult = await Feedback.deleteOne({ _id: req.params.id });

    if (deleteResult.deletedCount === 0) {
      return res.status(500).json({ error: "Failed to delete feedback" });
    }

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateSentFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const oldFeedback = await Feedback.findOne({
      tenant: req.user._id,
      house: req.params.id,
    });

    if (!oldFeedback) {
      return res.status(404).json({ error: "Feedback doesn't exist" });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        rating,
        comment,
      },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(500).json({ error: "Failed to update feedback" });
    }

    res.status(200).json({ updatedFeedback });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error while editing feedback" });
  }
};

exports.getRecivedFeedback = async (req, res) => {
  try {
    const houseId = req.params.id;
    const feedbacks = await Feedback.find({ house: houseId });

    if (feedbacks.length === 0) {
      return res
        .status(404)
        .json({ error: "You haven't received feedback for this house" });
    }

    const totalRatings = feedbacks.reduce(
      (acc, feedback) => acc + feedback.rating,
      0
    );
    const averageRating = totalRatings / feedbacks.length;

    res.status(200).json({ feedbacks, averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
