const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const roles = {
  landlord: "landlord",
  broker: "broker",
  tenant: "tenant",
  admin: "admin",
  superadmin: "superadmin",
};

const verifyAndAuthorize = (...authorizedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!authorizedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({ message: "Forbidden" });
      }
      res.status(401).json({ message: "Not authorized" });
    }
  };
};
const tenantOnlyAuth = verifyAndAuthorize(roles.tenant);
const exceptTenantAuth = verifyAndAuthorize(
  roles.admin,
  roles.superadmin,
  roles.landlord,
  roles.broker
);
const superAdminAuth = verifyAndAuthorize(roles.superadmin);
const adminOrSuperadminAuth = verifyAndAuthorize(roles.admin, roles.superadmin);
const landlordAuth = verifyAndAuthorize(roles.landlord);
const brokerAuth = verifyAndAuthorize(roles.broker);
const landlordOrBrokerAuth = verifyAndAuthorize(roles.landlord, roles.broker);

module.exports = {
  tenantOnlyAuth,
  adminOrSuperadminAuth,
  landlordAuth,
  brokerAuth,
  superAdminAuth,
  landlordOrBrokerAuth,
  exceptTenantAuth,
};
