// Load environment variables
require("dotenv").config();
const bodyParser = require("body-parser");
// Load dependencies
const express = require("express");
const cors = require("cors");

const app = express();

// Parse incoming request bodies
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Import routes
const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoute");
const propertyRoutes = require("./routes/propertyRoute");
const feedbackRoutes = require("./routes/feedbackRoute.js");
const reportRoutes = require("./routes/reportRoute.js");
const pendingOrderRoutes = require("./routes/pendingOrderRoute.js");

// Use middleware
app.use(cors());

// Use routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/propertie", propertyRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/pending", pendingOrderRoutes);
app.use("/api/v1//reports", reportRoutes);

const connectDb = require("./config/db");
connectDb();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
