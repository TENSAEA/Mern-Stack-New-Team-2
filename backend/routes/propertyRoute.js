const express = require("express");
const router = express.Router();
const handleImage = require("../middleware/multipleFileHandler");
const { validateHouse } = require("../middleware/houseValidator");
const {
  tenantOnlyAuth,
  adminOrSuperadminAuth,
  landlordOrBrokerAuth,
} = require("../middleware/authMiddleware");

const {
  getAllAvailableProperty,
  getAllProperty,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  approvalStatusOfProperty,
} = require("../controllers/propertyController");

router.get("/", tenantOnlyAuth, getAllAvailableProperty);
router.get("/own-property", landlordOrBrokerAuth, getProperty);

router.get("/get-all-property", adminOrSuperadminAuth, getAllProperty);

router.post(
  "/create-property",
  landlordOrBrokerAuth,
  handleImage.uploadPropertyImages,
  handleImage.resizePropertyImages,
  validateHouse,
  createProperty
);

// Endpoint for updating an existing property listing
router.put("/update/:id", landlordOrBrokerAuth, updateProperty);

// Endpoint for deleting an existing property listing
router.delete("/delete/:id", adminOrSuperadminAuth, deleteProperty);

// Endpoint for landlords/brokers to mark a house as available
router.put(

  "/:id/approve-status",
  validateHouse,


  adminOrSuperadminAuth,
  approvalStatusOfProperty
);

module.exports = router;
