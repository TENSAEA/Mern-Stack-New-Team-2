const express = require("express");
const handleImage = require("../middleware/singleFileHandler.js");
const validateLogin = require("../middleware/loginValidator.js");
const validateUser = require("../middleware/userValidator.js");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", validateUser, userController.register);
router.post("/login", validateLogin, userController.login);
router.get("/refresh", userController.refresh);
router.post("/logout", userController.logout);

// // Add forgot password endpoints
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);
// // Add user profile update endpoint
router.put(
  "/profile/:id",
  handleImage.uploadUserPhoto,
  handleImage.resizeUserPhoto,
  userController.updateProfile
);
// // Add user activateDeactivate endpoint
router.put("/activate-deactivate/:id", userController.activateDeactivate);
// // Add user search/filtering endpoint
router.get("/", userController.searchUsers);

module.exports = router;
