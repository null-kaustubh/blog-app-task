export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  authorId: string;
  tags?: string[];
  featuredImage?: string | null;
  status: "draft" | "published";
  readTime: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateBlogInput = Pick<
  Blog,
  "title" | "content" | "tags" | "featuredImage" | "status" | "authorId"
>;

export type UpdateBlogInput = Blog;
