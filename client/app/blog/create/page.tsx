"use client";

import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createBlog } from "@/redux/slices/blogSlice";
import { CreateBlogInput } from "@/types/blog";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CreateBlogPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { isLoading, error, currentBlog } = useAppSelector(
    (state) => state.blog
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBlogInput>();

  useEffect(() => {
    if (currentBlog && currentBlog.slug) {
      toast.success("Blog created!");
      router.push(`/blog/${currentBlog.slug}`);
    }
    if (error) toast.error(error);
  }, [currentBlog, error, router]);

  const onSubmit = (data: CreateBlogInput) => {
    if (!user?._id) {
      toast.error("You must be logged in");
      return;
    }

    dispatch(createBlog({ ...data, authorId: user._id }));
  };

  // ✅ If user not logged in, show message instead of form
  if (!user?._id) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <p className="text-lg my-4">
          You need to be logged in to create a blog.
        </p>
        <Link
          href="/login"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create a New Blog</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Content (Markdown)</label>
          <textarea
            {...register("content", { required: "Content is required" })}
            className="w-full p-2 border rounded h-40"
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Tags (comma separated)
          </label>
          <input {...register("tags")} className="w-full p-2 border rounded" />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}
