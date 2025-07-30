import express from "express";
import { body } from "express-validator";
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} from "../controllers/blogController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Validation rules
const blogValidation = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  body("content")
    .trim()
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters long"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each tag must be between 1 and 50 characters"),
];

// Public routes
router.get("/", getBlogs);
router.get("/:slug", getBlog);

// Protected routes
router.use(protect); // All routes below this middleware require authentication
router.get("/user/my-blogs", getMyBlogs);
router.post("/", blogValidation, createBlog);
router.put("/:slug", blogValidation, updateBlog);
router.delete("/:slug", deleteBlog);

export default router;
