// backend/utils/emailService.js
const transporter = require("../config/mailer");

async function sendPasswordResetEmail(email, resetToken, host) {
  const mailOptions = {
    from: "marakiBetoch@gmail.com>",
    to: email,
    subject: "Password Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${host}/reset-password/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      <a href="${host}/reset-password/${resetToken}">Reset Password</a> 
      <p>! the link will expire after 15 minute</p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}

module.exports = sendPasswordResetEmail;
