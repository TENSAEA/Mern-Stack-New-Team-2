const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const sendPasswordResetEmail = require("../utils/emailService");

exports.register = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    if (role === "admin" || role === "superadmin") {
      return res
        .status(401)
        .json({ error: "You are not authorized to create an admin account" });
    }

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already in use" });
    }

    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      password: hashedPassword,
      email,
      role,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const accessToken = jwt.sign(
          { id: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
          { id: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
          _id: user._id,
          name: user.username,
          email: user.email,
          isBlocked: user.isBlocked,
          isDeactivated: user.isDeactivated,
          photo: user.photo,
          role: user.role,
          token: accessToken,
          message: "Login successful",
        });
      } else {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    } else {
      return res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
exports.refresh = async (req, res) => {
  let refreshToken;
  if (req.cookies) {
    refreshToken = req.cookies.jwt;
  } else {
    return res.status(401).json({ error: "cookie dosn't exit" });
  }
  if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token expired" });
    } else {
      return res.status(403).json({ error: "Invalid token" });
    }
  }
};

exports.logout = (req, res) => {
  const cookies = req.cookies;
  console.log(req.headers.origin);
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "logging out was successful" });
};

exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ error: "The user profile could not be found." });
    }

    if (user._id.toString() !== id) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to update this profile." });
    }

    if (req.file) {
      updates.photo = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updates, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ message: "Profile updated successfully.", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

exports.activateDeactivate = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user._id.toString() !== id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this profile" });
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

exports.searchUsers = async (req, res) => {
  const { role, username, email } = req.query;
  try {
    const query = {};
    if (role) {
      query.role = role;
      if (role === "superadmin") {
        return res
          .status(403)
          .json({ error: "Access denied for superadmin search" });
      }
    }
    if (username) query.username = { $regex: username, $options: "i" };
    if (email) query.email = email;
    query.isDeactivated = false;

    const users = await User.find(query);

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.RESATE_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await sendPasswordResetEmail(user.email, resetToken, req.headers.origin);
    res
      .status(200)
      .json({ message: "Password reset email sent,check your email" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.RESATE_TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found, check your email again" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    const responce = await user.save();

    if (!responce) {
      return res.status(404).json({ error: "problem while resating password" });
    }

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    res.status(500).json({ error: "Server error" });
  }
};
