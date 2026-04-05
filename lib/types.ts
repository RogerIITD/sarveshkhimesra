export interface PostMeta {
  id: string;
  title: string;
  slug: string;
  type: "short take" | "essay";
  tags: string[];
  status: "draft" | "published";
  date: string;
  excerpt: string;
  coverUrl: string | null;
  readTime: number;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

export interface NowPageData {
  contentHtml: string;
  lastEdited: string;
}
