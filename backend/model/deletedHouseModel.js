const mongoose = require("mongoose");
const House = require("./houseModel");

const deletionReasons = {
  LANDLORD_UNAVAILABLE: "House no longer available for rent",
  DUPLICATE_LISTING: "Duplicate listing",
  INCORRECT_INFORMATION: "Incorrect house information",
  BROKER_CONTRACT_EXPIRED: "Broker contract expired",
  LANDLORD_TERMINATED_CONTRACT: "Landlord terminated contract",
  HOUSE_ALREADY_RENTED: "House already rented",
  ADMIN_FRAUDULENT_LISTING: "Fraudulent listing",
  ADMIN_POLICY_VIOLATION: "Policy violation",
  ADMIN_DATA_INCONSISTENCY: "Data inconsistency",
  SUPERADMIN_MAINTENANCE: "System maintenance",
  SUPERADMIN_LEGAL_ISSUES: "Legal issues",
  SUPERADMIN_PLATFORM_CLOSURE: "Platform closure",
};

const deletedHouseSchema = new mongoose.Schema({
  ...House.schema.paths,
  deletionReason: {
    type: String,
    enum: deletionReasons,
    required: true,
  },
  deletedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DeletedHouse", deletedHouseSchema);
