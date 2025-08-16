import BlogCard from "@/components/BlogCard";
import Navbar from "@/components/Navbar";
import { Blog } from "@/types/blog";

async function getBlogs(): Promise<Blog[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`, {
    cache: "no-store", // avoid caching during dev
  });

  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export default async function HomePage() {
  const blogs = await getBlogs();

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Latest Blogs</h1>

        <div className="grid gap-6">
          {blogs.length > 0 ? (
            blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
          ) : (
            <p>No blogs published yet.</p>
          )}
        </div>
      </main>
    </>
  );
}
