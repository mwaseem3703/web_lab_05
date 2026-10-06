const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // req.user is populated by authMiddleware.js
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden. Requires one of: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = checkRole;
