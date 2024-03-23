exports.validateBidPrice = (bidPrice) => {
  return typeof bidPrice === "number" && bidPrice > 0;
};

exports.checkHouseAvailability = (house) => {
  return house && house.status === "available";
};
