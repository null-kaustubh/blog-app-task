import express from "express";
import { body } from "express-validator";
import { signup, login, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Validation rules
const signupValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Name must be between 2 and 20 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.get("/me", protect, getMe);

export default router;
