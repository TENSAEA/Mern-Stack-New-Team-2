const transporter = require("../config/mailer");
const User = require("../model/userModel"); // Update the path as per your project structure

async function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Your App Name" <no-reply@example.com>', // Replace with your app name and email
    to, // List of receivers
    subject, // Subject line
    text, // Plain text body
    html, // HTML body content
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Function to notify landlord about a new order
exports.notifyLandlordNewOrder = async (landlordId, orderDetails) => {
  try {
    const landlord = await User.findById(landlordId);
    if (!landlord) {
      throw new Error("Landlord not found");
    }
    const subject = "New Order Notification";
    const text = `You have a new order: ${JSON.stringify(orderDetails)}`;
    const html = `<p>You have a new order: ${JSON.stringify(orderDetails)}</p>`;

    await sendEmail(landlord.email, subject, text, html);
  } catch (error) {
    console.error(
      `Failed to send notification to landlord ${landlordId}`,
      error
    );
  }
};

// Function to notify renter about order status
exports.notifyRenterOrderStatus = async (renterId, orderStatus) => {
  try {
    const renter = await User.findById(renterId);
    if (!renter) {
      throw new Error("Renter not found");
    }
    const subject = "Order Status Update";
    const text = `Your order status has been updated to: ${orderStatus}`;
    const html = `<p>Your order status has been updated to: ${orderStatus}</p>`;

    await sendEmail(renter.email, subject, text, html);
  } catch (error) {
    console.error(`Failed to send notification to renter ${renterId}`, error);
  }
};

// Function to notify user about report status
exports.notifyUserReportStatus = async (userId, reportStatus) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const subject = "Report Status Update";
    const text = `The status of your report has been updated to: ${reportStatus}`;
    const html = `<p>The status of your report has been updated to: ${reportStatus}</p>`;

    await sendEmail(user.email, subject, text, html);
  } catch (error) {
    console.error(`Failed to send notification to user ${userId}`, error);
  }
};
