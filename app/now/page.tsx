import { fetchNowPage } from "@/lib/notion";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Now | Sarvesh Khimesra",
  description: "What Sarvesh is up to right now.",
};

export default async function NowPage() {
  let contentHtml = "";
  let lastEdited = "";

  try {
    const data = await fetchNowPage();
    contentHtml = data.contentHtml;
    lastEdited = new Date(data.lastEdited).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    contentHtml =
      "<p>This page is powered by Notion. Content will appear once the Notion integration is configured.</p>";
    lastEdited = "";
  }

  return (
    <div className="max-w-[680px] mx-auto px-6 pt-24 pb-20">
      <header className="mb-10">
        <h1 className="font-heading text-4xl text-secondary mb-2">Now</h1>
        <p className="text-text/60 text-sm">
          What I&apos;m up to right now.
          {lastEdited && (
            <span className="ml-2 text-text/40">
              Last updated: {lastEdited}
            </span>
          )}
        </p>
      </header>

      <article
        className="prose prose-slate max-w-none
          prose-headings:font-heading prose-headings:text-secondary
          prose-p:leading-relaxed prose-p:text-text/85
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-primary
          prose-code:font-mono prose-code:text-sm prose-code:bg-parchment prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-blockquote:border-l-primary prose-blockquote:text-text/70
          prose-img:rounded-xl
        "
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
