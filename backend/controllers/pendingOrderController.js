const PendingOrder = require("../model/pendingOrderModel");
const House = require("../model/houseModel");
const User = require("../model/userModel");
const {
  validateBidPrice,
  checkHouseAvailability,
} = require("../utils/validationHelpers");
const {
  notifyLandlordNewOrder,
  notifyRenterOrderStatus,
} = require("../utils/notificationSystem");

exports.createPendingOrder = async (req, res) => {
  const { houseId, bidPrice } = req.body;
  const renterId = req.user._id;

  if (!validateBidPrice(bidPrice)) {
    return res.status(400).json({ message: "Invalid bid price format" });
  }

  const house = await House.findById(houseId);
  if (!house || !checkHouseAvailability(house)) {
    return res.status(400).json({ message: "House is not available" });
  }

  const pendingOrder = new PendingOrder({
    house: houseId,
    renter: renterId,
    bidPrice,
  });

  await pendingOrder.save();

  // Notify the landlord/broker about the new pending order
  notifyLandlordNewOrder(house.landlord, pendingOrder);

  res.status(201).json(pendingOrder);
};

// Add other methods for show, update, cancel, etc.

exports.updatePendingOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { bidPrice } = req.body;

    if (!validateBidPrice(bidPrice)) {
      return res.status(400).json({ message: "Invalid bid price format" });
    }

    const pendingOrder = await PendingOrder.findById(id);

    if (!pendingOrder) {
      return res.status(404).json({ message: "Pending order not found" });
    }

    if (pendingOrder.renter.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }

    pendingOrder.bidPrice = bidPrice;
    await pendingOrder.save();

    res.status(200).json(pendingOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletePendingOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pendingOrder = await PendingOrder.findById(id);

    if (!pendingOrder) {
      return res.status(404).json({ message: "Pending order not found" });
    }

    if (pendingOrder.renter.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this order" });
    }

    await PendingOrder.deleteOne({ _id: id });
    res.status(200).json({ message: "Pending order deleted" });
  } catch (error) {
    console.error(error); // Log the error to the console
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getPendingOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pendingOrder = await PendingOrder.findById(id).populate(
      "house renter"
    );

    if (!pendingOrder) {
      return res.status(404).json({ message: "Pending order not found" });
    }

    res.status(200).json(pendingOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllPendingOrdersForLandlord = async (req, res) => {
  try {
    const { landlordId } = req.params;
    const pendingOrders = await PendingOrder.find({
      "house.landlord": landlordId,
    }).populate("house renter");

    res.status(200).json(pendingOrders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.acceptPendingOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await PendingOrder.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Order is not in pending status" });
    }
    order.status = "accepted";
    await order.save();

    // Update the house status to rented
    const house = await House.findById(order.house);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }
    house.status = "rented";
    await house.save();

    // Cancel conflicting orders
    await cancelConflictingOrders(order);

    // Notify the renter about the acceptance
    notifyRenterOrderStatus(order.renter, "accepted");

    res.status(200).json(order);
  } catch (error) {
    console.error(error); // Log the full error stack to the console
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack, // Include the error stack in the response for debugging
    });
  }
};
exports.rejectPendingOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await PendingOrder.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = "rejected";
    await order.save();

    // Notify the renter about the rejection
    notifyRenterOrderStatus(order.renter, "rejected");

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.counterOfferPendingOrder = async (req, res) => {
  const { id } = req.params;
  const { newBidPrice } = req.body;
  try {
    const order = await PendingOrder.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = "counter-offered";
    order.bidPrice = newBidPrice;
    await order.save();

    // Notify the renter about the counter-offer
    notifyRenterOrderStatus(order.renter, "counter-offered");

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to cancel conflicting orders
const cancelConflictingOrders = async (acceptedOrder) => {
  const conflictingOrders = await PendingOrder.find({
    house: acceptedOrder.house,
    status: "pending",
    _id: { $ne: acceptedOrder._id },
  });

  for (const order of conflictingOrders) {
    order.status = "rejected";
    await order.save();
    notifyRenterOrderStatus(
      order.renter,
      "rejected due to another order acceptance"
    );
  }
};
