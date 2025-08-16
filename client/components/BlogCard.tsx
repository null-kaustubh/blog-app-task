import Link from "next/link";
import { Blog } from "@/types/blog";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <div className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      <h2 className="text-xl font-semibold mb-2">
        <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
      </h2>

      <p className="text-gray-600 mb-3">
        {blog.excerpt ?? "No summary available."}
      </p>

      <div className="text-sm text-gray-500">
        {blog.readTime} min read • {new Date(blog.createdAt).toDateString()}
      </div>
    </div>
  );
}
