const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  const token = req.cookies.auth;
  if (!token) {
    return res.status(401).json({ err: "Unauthorized: No token provided" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ err: "Invalid or expired token" });
  }
};
module.exports = verifyToken;
