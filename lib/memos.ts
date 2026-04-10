import fs from "node:fs/promises";
import path from "node:path";

const memosDirectory = path.join(process.cwd(), "content", "memos");

export type Memo = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
  content: string;
};

function extractTitle(content: string, fallbackTitle: string) {
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || fallbackTitle;
}

function extractExcerpt(content: string) {
  const bodyWithoutFirstHeading = content
    .replace(/^#\s+.*$/m, "")
    .split(/\n\s*\n/)
    .map((section) => section.trim())
    .find(Boolean);

  if (!bodyWithoutFirstHeading) {
    return "";
  }

  return bodyWithoutFirstHeading.replace(/\s+/g, " ").slice(0, 140);
}

export async function getMemos() {
  const fileNames = await fs.readdir(memosDirectory);
  const markdownFiles = fileNames.filter((fileName) => fileName.endsWith(".md"));

  const memos = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const filePath = path.join(memosDirectory, fileName);
      const [content, stats] = await Promise.all([
        fs.readFile(filePath, "utf8"),
        fs.stat(filePath),
      ]);

      return {
        slug,
        title: extractTitle(content, slug),
        excerpt: extractExcerpt(content),
        updatedAt: stats.mtime.toISOString(),
        content,
      } satisfies Memo;
    }),
  );

  return memos.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}
