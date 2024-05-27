const express = require("express");
const router = express.Router();
const userValidator = require("../middleware/userValidator.js");
const adminController = require("../controllers/adminController.js");
const {
  adminOrSuperadminAuth,
  superAdminAuth,
} = require("../middleware/verifyAndAuthorize.js");

// // Super Admin exclusive user creation
router.post(
  "/create-user",
  userValidator,
  superAdminAuth,
  adminController.createAdmin
);

router.delete(
  "/delete-user/:id",
  adminOrSuperadminAuth,
  adminController.deleteUser
);

// // Add endpoints for blocking/unblocking users
router.put(
  "/block-unblock/:id",
  adminOrSuperadminAuth,
  adminController.blockAndUnblockUser
);
// // Add endpoints for blocking/unblocking users
router.put(
  "/activate-deactivate/:id",
  adminOrSuperadminAuth,
  adminController.activateAndDeactivateUser
);

module.exports = router;
