import { Client } from "@notionhq/client";
import type { PostMeta, Post, NowPageData } from "./types";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;
const NOW_PAGE_ID = process.env.NOTION_NOW_PAGE_ID!;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPlainText(richText: any[]): string {
  return richText.map((t: any) => t.plain_text).join("");
}

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// ---------------------------------------------------------------------------
// Fetch published posts
// ---------------------------------------------------------------------------

export async function fetchPublishedPosts(): Promise<PostMeta[]> {
  if (!DATABASE_ID) return [];

  const response = await notion.dataSources.query({
    data_source_id: DATABASE_ID,
    filter: {
      property: "Status",
      select: {
        equals: "published",
      },
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  return response.results.map((page: any) => {
    const props = page.properties;
    const title = getPlainText(props.Title?.title || []);
    const slug = getPlainText(props.Slug?.rich_text || []);
    const type = props.Type?.select?.name === "essay" ? "essay" : "short take";
    const tags = (props.Tags?.multi_select || []).map((t: any) => t.name);
    const status = props.Status?.select?.name === "published" ? "published" : "draft";
    const date = props.Date?.date?.start || new Date().toISOString().split("T")[0];
    const coverUrl = props.Cover?.files?.[0]?.file?.url || props.Cover?.files?.[0]?.external?.url || null;

    return {
      id: page.id,
      title,
      slug,
      type: type as "short take" | "essay",
      tags,
      status: status as "draft" | "published",
      date,
      excerpt: "",
      coverUrl,
      readTime: 0,
    };
  });
}

// ---------------------------------------------------------------------------
// Fetch single post by slug
// ---------------------------------------------------------------------------

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  if (!DATABASE_ID) return null;

  const response = await notion.dataSources.query({
    data_source_id: DATABASE_ID,
    filter: {
      and: [
        {
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
        {
          property: "Status",
          select: {
            equals: "published",
          },
        },
      ],
    },
  });

  if (response.results.length === 0) return null;

  const page: any = response.results[0];
  const props = page.properties;

  const title = getPlainText(props.Title?.title || []);
  const type = props.Type?.select?.name === "essay" ? "essay" : "short take";
  const tags = (props.Tags?.multi_select || []).map((t: any) => t.name);
  const date = props.Date?.date?.start || new Date().toISOString().split("T")[0];
  const coverUrl = props.Cover?.files?.[0]?.file?.url || props.Cover?.files?.[0]?.external?.url || null;

  const contentHtml = await fetchPostBlocks(page.id);
  const readTime = estimateReadTime(contentHtml.replace(/<[^>]+>/g, ""));

  return {
    id: page.id,
    title,
    slug,
    type: type as "short take" | "essay",
    tags,
    status: "published",
    date,
    excerpt: contentHtml.replace(/<[^>]+>/g, "").slice(0, 150),
    coverUrl,
    readTime,
    contentHtml,
  };
}

// ---------------------------------------------------------------------------
// Fetch blocks for a page and render to HTML
// ---------------------------------------------------------------------------

export async function fetchPostBlocks(pageId: string): Promise<string> {
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });

  let html = "";

  for (const block of blocks.results as any[]) {
    switch (block.type) {
      case "paragraph":
        html += `<p>${renderRichText(block.paragraph.rich_text)}</p>`;
        break;
      case "heading_1":
        html += `<h1>${renderRichText(block.heading_1.rich_text)}</h1>`;
        break;
      case "heading_2":
        html += `<h2>${renderRichText(block.heading_2.rich_text)}</h2>`;
        break;
      case "heading_3":
        html += `<h3>${renderRichText(block.heading_3.rich_text)}</h3>`;
        break;
      case "bulleted_list_item":
        html += `<ul><li>${renderRichText(block.bulleted_list_item.rich_text)}</li></ul>`;
        break;
      case "numbered_list_item":
        html += `<ol><li>${renderRichText(block.numbered_list_item.rich_text)}</li></ol>`;
        break;
      case "quote":
        html += `<blockquote>${renderRichText(block.quote.rich_text)}</blockquote>`;
        break;
      case "code":
        html += `<pre><code class="${block.code.language || ""}">${renderRichText(block.code.rich_text)}</code></pre>`;
        break;
      case "divider":
        html += `<hr />`;
        break;
      case "image": {
        const url =
          block.image.type === "file"
            ? block.image.file.url
            : block.image.external.url;
        const caption = renderRichText(block.image.caption || []);
        html += `<figure><img src="${url}" alt="${caption}" loading="lazy" />${
          caption ? `<figcaption>${caption}</figcaption>` : ""
        }</figure>`;
        break;
      }
      case "callout":
        html += `<div class="callout"><span class="callout-icon">${
          block.callout.icon?.emoji || ""
        }</span><div>${renderRichText(block.callout.rich_text)}</div></div>`;
        break;
      case "toggle":
        html += `<details><summary>${renderRichText(
          block.toggle.rich_text
        )}</summary></details>`;
        break;
      case "bookmark":
        html += `<a href="${block.bookmark.url}" target="_blank" rel="noopener noreferrer" class="bookmark">${block.bookmark.url}</a>`;
        break;
      default:
        break;
    }
  }

  return html;
}

function renderRichText(richTextArray: any[]): string {
  if (!richTextArray || richTextArray.length === 0) return "";

  return richTextArray
    .map((t: any) => {
      let text = t.plain_text;
      // Escape HTML entities
      text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      if (t.annotations.bold) text = `<strong>${text}</strong>`;
      if (t.annotations.italic) text = `<em>${text}</em>`;
      if (t.annotations.strikethrough) text = `<del>${text}</del>`;
      if (t.annotations.underline) text = `<u>${text}</u>`;
      if (t.annotations.code) text = `<code>${text}</code>`;
      if (t.href) text = `<a href="${t.href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

      return text;
    })
    .join("");
}

// ---------------------------------------------------------------------------
// Fetch /now page
// ---------------------------------------------------------------------------

export async function fetchNowPage(): Promise<NowPageData | null> {
  if (!NOW_PAGE_ID) return null;

  const page: any = await notion.pages.retrieve({ page_id: NOW_PAGE_ID });
  const contentHtml = await fetchPostBlocks(NOW_PAGE_ID);
  const lastEdited = page.last_edited_time || new Date().toISOString();

  return {
    contentHtml,
    lastEdited,
  };
}
