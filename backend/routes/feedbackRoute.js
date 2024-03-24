const express = require("express");
const router = express.Router();
const validateFeedback = require("../middleware/feedbackValidator");
const { tenantOnlyAuth } = require("../middleware/authMiddleware");
const feedbackController = require("../controllers/feedbackController");

router.post(
  "/submit-feedback/:id",
  tenantOnlyAuth,
  validateFeedback,
  feedbackController.createFeedback
);
router.get("/my-feedback", tenantOnlyAuth, feedbackController.getSentFeedback);
router.put(
  "/update-feedback/:id",
  tenantOnlyAuth,
  validateFeedback,
  feedbackController.updateSentFeedback
);
router.delete(
  "/delet-feedback/:id",
  tenantOnlyAuth,
  validateFeedback,
  feedbackController.deleteSentFeedback
);
router.get("/:id", feedbackController.getRecivedFeedback);

module.exports = router;
