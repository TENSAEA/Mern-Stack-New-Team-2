const express = require("express");
const router = express.Router();
const userValidator = require("../middleware/userValidator.js");
const adminController = require("../controllers/adminController.js");

// // Super Admin exclusive user creation
router.post("/create-user", userValidator, adminController.createAdmin);

router.delete("/delet-user/:id", adminController.deleteUser);

// // Add endpoints for blocking/unblocking users
router.post("/block/:id", adminController.blockAndUnblockUser);
// // Add endpoints for blocking/unblocking users
router.post(
  "/activate-deactivate/:id",
  adminController.activateAndDeactivateUser
);

module.exports = router;
