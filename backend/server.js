require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoute");
const propertyRoutes = require("./routes/propertyRoute");

const feedbackRoutes = require("./routes/feedbackRoute.js");

const reportRoutes = require("./routes/reportRoute.js");
const pendingOrderRoutes = require("./routes/pendingOrderRoute.js");

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/properties", propertyRoutes);
app.use("/pending", pendingOrderRoutes);
app.use("/reports", reportRoutes);

const connectDb = require("./config/db");
connectDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
