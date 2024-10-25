const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token." });
  }
};

const adminMiddleware = (req, res, next) => {
  // authenticateToken should be used before this middleware
  if (!req.user) {
    return res.status(500).json({
      success: false,
      message: "User authentication required before checking admin status.",
    });
  }

  if (!req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

module.exports = { authenticateToken, adminMiddleware };
