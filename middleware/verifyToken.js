import jsonwebtoken from "jsonwebtoken";
import logger, { metaLogFormatter } from "../utils/winston_logger.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader)
  const token = authHeader && authHeader.split(" ")[1];
  //console.log(token)

  if (!token) {
    const meta = metaLogFormatter('TOKEN_MISSING', null, 401, req.originalUrl);
    logger.warn("Access denied: No token provided", { meta });
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET || "123");
    req.user = decoded; // Attach decoded token data to the request object
    next();
  } catch (error) {
    const meta = metaLogFormatter('INVALID_TOKEN', error.message, 400, req.originalUrl);
    logger.warn("Access denied: Invalid token", { meta });
    res.status(400).json({ message: "Invalid token." });
  }
};
