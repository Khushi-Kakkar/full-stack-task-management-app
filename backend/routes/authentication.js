const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

const isStrongPassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  return (
    hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength
  );
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: xyz123
 *               password:
 *                 type: string
 *                 example: Xy^z123
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: User already exists or weak password
 *       500:
 *         description: Internal server error
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    let userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ error: "User already exists" });
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.json({ message: "User created successfully" });
  } catch (err) {
    console.log("Login Error", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login existing user
 *     description: Authenticates a user and returns a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: xyz123
 *               password:
 *                 type: string
 *                 example: Xy^z123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid username or password
 *       500:
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res
        .status(400)
        .json({ error: "Invalid password please try again" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
