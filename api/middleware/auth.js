import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.userId = decoded.userId; // Attach userId to request object
    next();
  });
};

export const verifyOptionalToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET || "secret-key", (err, decoded) => {
      if (!err) {
        req.userId = decoded.userId; // Attach userId if valid
      }
    });
  }

  next(); // Proceed with or without authentication
}
export default verifyToken;
