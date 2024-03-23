const express = require("express");
const router = express.Router();
const { tenantOnlyAuth } = require("../middleware/authMiddleware");
const pendingOrderController = require("../controllers/pendingOrderController");

router.post(
  "/pending-orders",
  tenantOnlyAuth,
  pendingOrderController.createPendingOrder
);
router.put(
  "/pending-orders/:id",
  tenantOnlyAuth,
  pendingOrderController.updatePendingOrder
);
router.delete(
  "/pending-orders/:id",
  tenantOnlyAuth,
  pendingOrderController.deletePendingOrder
);
router.get(
  "/pending-orders/:id",
  tenantOnlyAuth,
  pendingOrderController.getPendingOrder
);
router.get(
  "/landlord/:landlordId/pending-orders",
  tenantOnlyAuth,
  pendingOrderController.getAllPendingOrdersForLandlord
);

router.post(
  "/pending-orders/:id/accept",
  tenantOnlyAuth,
  pendingOrderController.acceptPendingOrder
);
router.post(
  "/pending-orders/:id/reject",
  tenantOnlyAuth,
  pendingOrderController.rejectPendingOrder
);
router.post(
  "/pending-orders/:id/counter-offer",
  tenantOnlyAuth,
  pendingOrderController.counterOfferPendingOrder
);

// ... (other routes)
module.exports = router;
