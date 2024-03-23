const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.createAdmin = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user.role === "admin") {
      if (req.user.role !== "superadmin") {
        return res.status(403).json({
          error: "Access denied. Only superadmin can delete admin users.",
        });
      }
    }
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.blockAndUnblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    const action = user.isBlocked ? "blocked" : "unblocked";
    res.status(200).json({ message: `User ${action} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.activateAndDeactivateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.isDeactivated = !user.isDeactivated;
    await user.save();
    const action = user.isDeactivated ? "deactivated" : "activated";
    res.status(200).json({ message: `Profile ${action} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
