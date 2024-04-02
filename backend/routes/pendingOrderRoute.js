const express = require("express");
const router = express.Router();
const {
  tenantOnlyAuth,
  landlordOrBrokerAuth,
  landlordAuth,
} = require("../middleware/authMiddleware");
const pendingOrderController = require("../controllers/pendingOrderController");

// Only Renters can submit pending orders
router.post(
  "/pending-orders",
  tenantOnlyAuth,
  pendingOrderController.createPendingOrder
);

// Renters can update their own pending orders
router.put(
  "/pending-orders/:id",
  tenantOnlyAuth,
  pendingOrderController.updatePendingOrder
);

// Renters can delete their own pending orders
router.delete(
  "/pending-orders/:id",
  tenantOnlyAuth,
  pendingOrderController.deletePendingOrder
);

// Renters can view their own pending orders
router.get(
  "/pending-orders/:id",
  tenantOnlyAuth,
  pendingOrderController.getPendingOrder
);

// Landlords/Brokers can view all pending orders for their houses
router.get(
  "/landlord/:landlordId/pending-orders",
  landlordAuth, // or landlordOrBrokerAuth if brokers are also allowed
  pendingOrderController.getAllPendingOrdersForLandlord
);

// Landlords/Brokers can accept a pending order
router.post(
  "/pending-orders/:id/accept",
  landlordOrBrokerAuth,
  pendingOrderController.acceptPendingOrder
);

// Landlords/Brokers can reject a pending order
router.post(
  "/pending-orders/:id/reject",
  landlordOrBrokerAuth,
  pendingOrderController.rejectPendingOrder
);

// Landlords/Brokers can make a counter-offer on a pending order
router.post(
  "/pending-orders/:id/counter-offer",
  landlordOrBrokerAuth,
  pendingOrderController.counterOfferPendingOrder
);

// ... (other routes)
module.exports = router;
