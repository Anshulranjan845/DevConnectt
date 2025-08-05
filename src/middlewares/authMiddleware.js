const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      throw new Error("No token provided");
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
};
module.exports = authMiddleware;
