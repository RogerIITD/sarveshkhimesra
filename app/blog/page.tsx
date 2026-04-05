import { fetchPublishedPosts } from "@/lib/notion";
import { fetchPostBlocks } from "@/lib/notion";
import BlogList from "@/components/BlogList";
import Link from "next/link";
import type { PostMeta } from "@/lib/types";

export const revalidate = 60;

export default async function BlogPage() {
  let posts: PostMeta[] = [];

  try {
    posts = await fetchPublishedPosts();

    // Enrich short takes with their full content as excerpt
    // and essays with excerpt + read time
    posts = await Promise.all(
      posts.map(async (post) => {
        try {
          const contentHtml = await fetchPostBlocks(post.id);
          const plainText = contentHtml.replace(/<[^>]+>/g, "");
          const words = plainText.split(/\s+/).length;
          const readTime = Math.max(1, Math.round(words / 200));

          return {
            ...post,
            excerpt: post.type === "short take" ? plainText : plainText.slice(0, 150),
            readTime,
          };
        } catch {
          return post;
        }
      })
    );
  } catch {
    // Notion API not configured yet — show empty state
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
      <h1 className="font-heading text-4xl text-secondary mb-2">Blog</h1>
      <p className="text-text/60 mb-8">
        Short takes and longer essays on AI, GTM, life, and everything in
        between.
      </p>
      {/* Musings card */}
      <Link
        href="/blog/musings"
        className="block mb-8 bg-parchment rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-primary/10"
      >
        <p className="text-xs font-mono text-primary uppercase tracking-wider mb-1">Writings</p>
        <h3 className="font-heading text-xl text-secondary mb-1">Random Musings</h3>
        <p className="font-shayari text-sm text-accent">और कुछ लफ़्ज़...</p>
        <p className="text-sm text-text/60 mt-2">Shayaris and thoughts on love, realisation, life, and fire.</p>
      </Link>

      <BlogList posts={posts} />
    </div>
  );
}
