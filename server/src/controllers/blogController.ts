import { BlogModel } from "../models/blog.js";
import { validationResult } from "express-validator";
import type { Request, Response } from "express";

const getQueryParam = (param: unknown, fallback: number): number => {
  if (Array.isArray(param)) return parseInt(param[0] || fallback.toString());
  if (typeof param === "string") return parseInt(param);
  return fallback;
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const page = getQueryParam(req.query.page, 1);
    const limit = getQueryParam(req.query.limit, 10);
    const skip = (page - 1) * limit;

    const search = Array.isArray(req.query.search)
      ? req.query.search[0]
      : req.query.search || "";
    const tag = Array.isArray(req.query.tag)
      ? req.query.tag[0]
      : req.query.tag || "";

    // Build query
    let query: Record<string, any> = { status: "published" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const blogs = await BlogModel.find(query)
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogModel.countDocuments(query);

    res.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching blogs",
    });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const blog = await BlogModel.findOne({ slug }).populate(
      "author",
      "name email avatar"
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Get blog error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching blog",
    });
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const blogData = {
      ...req.body,
      author: req.user.id,
    };

    const blog = await BlogModel.create(blogData);
    await blog.populate("author", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating blog",
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const slug = req.params.slug;
    let blog = await BlogModel.findOne({ slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if user owns the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this blog",
      });
    }

    blog = await BlogModel.findOneAndUpdate({ slug }, req.body, {
      new: true,
      runValidators: true,
    }).populate("author", "name email avatar");

    res.json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating blog",
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const blog = await BlogModel.findOne({ slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if user owns the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this blog",
      });
    }

    await BlogModel.findOneAndDelete({ slug });

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting blog",
    });
  }
};

// @desc    Get user's blogs
// @route   GET /api/blogs/my-blogs
// @access  Private
export const getMyBlogs = async (req: Request, res: Response) => {
  try {
    const page = getQueryParam(req.query.page, 1);
    const limit = getQueryParam(req.query.limit, 10);
    const skip = (page - 1) * limit;

    const blogs = await BlogModel.find({ author: req.user.id })
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogModel.countDocuments({ author: req.user.id });

    res.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get my blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching your blogs",
    });
  }
};
