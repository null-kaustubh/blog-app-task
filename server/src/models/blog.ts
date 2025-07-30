import mongoose from "mongoose";
import { nanoid } from "nanoid";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featuredImage: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    readTime: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    this.slug = `${baseSlug}-${nanoid(6)}`;
  }

  if (this.isModified("content")) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }

  if (this.isModified("content") && !this.excerpt) {
    this.excerpt = this.content.split(" ").slice(0, 30).join(" ") + "...";
  }

  next();
});

export const BlogModel = mongoose.model("Blog", blogSchema);
