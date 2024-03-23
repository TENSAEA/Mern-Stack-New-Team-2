const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const roles = {
  landlord: "landlord",
  broker: "broker",
  tenant: "tenant",
  admin: "admin",
  superadmin: "superadmin",
};

const authorizedRoles = (...authorized) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!authorized.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }
  };
};
const tenantOnlyAuth = authorizedRoles(roles.tenant);
const exceptTenantAuth = authorizedRoles(
  roles.admin,
  roles.superadmin,
  roles.landlord,
  roles.broker
);
const superAdminAuth = authorizedRoles(roles.superadmin);
const adminOrSuperadminAuth = authorizedRoles(roles.admin, roles.superadmin);
const landlordAuth = authorizedRoles(roles.landlord);
const brokerAuth = authorizedRoles(roles.broker);
const landlordOrBrokerAuth = authorizedRoles(roles.landlord, roles.broker);

module.exports = {
  tenantOnlyAuth,
  adminOrSuperadminAuth,
  landlordAuth,
  brokerAuth,
  superAdminAuth,
  landlordOrBrokerAuth,
  exceptTenantAuth,
};
