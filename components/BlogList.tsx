"use client";

import { useState, useMemo } from "react";
import FilterBar from "./FilterBar";
import PostCard from "./PostCard";
import type { PostMeta } from "@/lib/types";

interface BlogListProps {
  posts: PostMeta[];
}

export default function BlogList({ posts }: BlogListProps) {
  const [activeType, setActiveType] = useState("All");
  const [activeTag, setActiveTag] = useState("");

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Type filter
      if (activeType === "Short Takes" && post.type !== "short take") return false;
      if (activeType === "Essays" && post.type !== "essay") return false;

      // Tag filter
      if (activeTag && !post.tags.includes(activeTag)) return false;

      return true;
    });
  }, [posts, activeType, activeTag]);

  if (posts.length === 0) {
    return null;
  }

  return (
    <>
      <FilterBar
        onTypeChange={setActiveType}
        onTagChange={setActiveTag}
        activeType={activeType}
        activeTag={activeTag}
        availableTags={availableTags}
      />

      {filteredPosts.length === 0 ? (
        <p className="text-center text-text/50 py-12">
          No posts match this filter.
        </p>
      ) : (
        <div className="space-y-5">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
