const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { validateReport } = require("../middleware/reportValidator");

const {
  tenantOnlyAuth,
  landlordOrBrokerAuth,
} = require("../middleware/authMiddleware");

router.post(
  "/submit-report",
  tenantOnlyAuth,
  validateReport,
  reportController.submitReport
);
router.get(
  "/my-reports",
  landlordOrBrokerAuth,
  reportController.getReportsForLandlordOrBroker
);
router.put(
  "/update-report-status",
  landlordOrBrokerAuth,
  reportController.updateReportStatus
);

module.exports = router;
