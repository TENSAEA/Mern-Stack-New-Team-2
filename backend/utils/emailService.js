// backend/utils/emailService.js
const transporter = require("../config/mailer");

async function sendPasswordResetEmail(email, resetToken, protocol, host) {
  const mailOptions = {
    from: '"Your App Name" <no-reply@example.com>',
    to: email,
    subject: "Password Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${protocol}://${host}/users/reset-password/${resetToken}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      <a href="${protocol}://${host}/users/reset-password/${resetToken}">Reset Password</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error; // Re-throw the error to be caught by the calling function
  }
}

module.exports = sendPasswordResetEmail;
