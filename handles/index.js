import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { db } from "../database.js";  // Ensure this path is correct
import logger, { metaLogFormatter } from "../utils/winston_logger.js";

export const getUser = async (request, response) => {
  try {
    response.status(200).json({ message: "hello" });
  } catch (error) {
    response.status(500).json({ message: "server error" });
  }
};

export const postUser = async (request, response) => {
  try {
    const { userName, email, hassedPassword } = request.body;
    const password = hassedPassword;

    if (!userName || !email || !password) {
      const meta = metaLogFormatter('AUTH_LOGIN_MISSING_FIELDS', null, 400, '/auth/login', 'Missing fields');
      logger.info("Invalid credentials provided", { meta });
      return response.status(400).json({ message: "Invalid credentials" });
    }

    const [rows] = await db.execute(
      "SELECT * FROM usercredentials WHERE email = ?",
      [email]
    );

    const userFound = rows;

    if (!userFound.length) {
      return response.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, userFound[0].hassedPassword);

    if (!isPasswordValid) {
      return response.status(400).json({ message: "Incorrect password" });
    }

    const accessToken = jsonwebtoken.sign(
      { userName: userFound[0].userName, email: userFound[0].email, id: userFound[0].id },
      process.env.JWT_SECRET || "123",
      { expiresIn: "3h" }
    );

    return response.status(201).json({
      status: 201,
      message: "Logged in Successfully",
      accessToken,
    });
  } catch (error) {
    return response.status(500).json({ status: 500, message: "Something went wrong" });
  }
};

export const getUserProfile = async (request, response) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM usercredentials WHERE id = ?",
      [request.user.id]
    );

    if (!rows.length) {
      const meta = metaLogFormatter('USER_PROFILE_NOT_FOUND', null, 404, '/user/profile', `User ID: ${request.user.id}`);
      logger.warn("User profile not found", { meta });
      return response.status(404).json({ message: "User not found" });
    }

    const meta = metaLogFormatter('USER_PROFILE_FETCHED', null, 200, '/user/profile');
    logger.info("User Profile fetched successfully", { meta });
    response.status(200).json({
      status: 200,
      message: "User profile fetched successfully",
      user: rows[0],
    });
  } catch (error) {
    const meta = metaLogFormatter('PROFILE_FETCH_ERROR', error.message, 500, '/user/profile');
    logger.error("Error during profile fetch", { meta });
    response.status(500).json({ message: "Server error", error });
  }
};
