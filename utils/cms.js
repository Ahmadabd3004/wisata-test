// File: WISATAAPP/utils/cms.js

import { marked } from "marked";

// --- Konfigurasi Marked ---
// Ini adalah konfigurasi yang tepat untuk memastikan Markdown terurai dengan baik.
// 'breaks: true' akan mengonversi \n tunggal menjadi <br>.
// 'gfm: true' mengaktifkan GitHub Flavored Markdown (penting untuk banyak sintaks).
marked.setOptions({
  breaks: true, // PENTING: Konversi \n tunggal menjadi <br>
  gfm: true, // PENTING: Mengaktifkan fitur-fitur Markdown yang lebih kaya
  // highlight: function(code, lang) { ... }, // Tambahkan jika ada syntax highlighting code blocks
});

const CDN_WISATA_URL = "https://cdn.wisata.app";
const CDN_TWITTER_URL = "https://pbs.twimg.com";
const CDN_WISATA_IMG_SIZE = {
  TH: "th",
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
};

/**
 * TASK: Find available image size for Twitter CDN
 */
const CDN_TWITTER_IMG_SIZE = {
  SMALL: "name=small",
  MEDIUM: "name=medium",
  LARGE: "name=large",
  ORIGINAL: "name=orig",
  "4096x4096": "name=4096x4096",
};
export { CDN_TWITTER_IMG_SIZE };

/**
 * TASK: Replace original image URL with size-optimized image URL.
 */
export function getSizeOptimizedImageUrl(originalUrl, desiredSize) {
  if (!originalUrl || !desiredSize) return originalUrl;

  if (originalUrl.startsWith(CDN_WISATA_URL)) {
    const lastDotIndex = originalUrl.lastIndexOf(".");
    if (lastDotIndex === -1) return originalUrl;

    const baseUrl = originalUrl.substring(0, lastDotIndex);
    const extension = originalUrl.substring(lastDotIndex + 1);

    return `${baseUrl}_${desiredSize}.${extension}`;
  } else if (originalUrl.startsWith(CDN_TWITTER_URL)) {
    let url = new URL(originalUrl);
    url.searchParams.delete("name");

    const sizeParam = desiredSize.split("=")[1];

    if (sizeParam && sizeParam !== "orig") {
      url.searchParams.set("name", sizeParam);
    } else if (sizeParam === "orig") {
      url.searchParams.set("name", "orig");
    }

    return url.toString();
  }

  return originalUrl;
}

/**
 * TASK: Extracts SEO attributes from diary content
 */
export function getDiaryContentSEOAttributes(contentData) {
  if (!contentData || !contentData.meta) {
    return {
      title: "Wisata App - Diary",
      description: "Discover inspiring travel stories and insights.",
      ogImage: null,
      language: "en-us",
    };
  }

  return {
    title: contentData.meta.title || "Wisata App - Diary",
    description:
      contentData.meta.description ||
      contentData.content?.substring(0, 150) + "..." ||
      "Discover inspiring travel stories and insights.",
    ogImage: contentData.meta.image || null,
    language: contentData.meta.language || "en-us",
  };
}

/**
 * TASK: Convert diary content to renderable data (HANYA TEKS).
 *
 * Menghilangkan semua embed (YouTube, TikTok, Instagram, Twitter) dan gambar.
 * Hanya menampilkan teks murni dari konten Markdown.
 *
 * @param {Object} contentData - Objek data konten diary dari API, berisi properti `content` (MDX).
 * @returns {string} Konten HTML yang siap dirender, hanya berisi teks.
 */
export function renderDiaryContent(contentData) {
  if (!contentData || !contentData.content) return "";

  let mdxContent = contentData.content;

  mdxContent = mdxContent.replace(/\u200B/g, "");

  mdxContent = mdxContent.replace(
    /<(YoutubeEmbed|TiktokEmbed|InstagramEmbed|TwitterEmbed)\s+[^>]*\/>/g,
    ""
  );

  mdxContent = mdxContent.replace(/!\[.*?\]\(.*?\)/g, "");

  let htmlResult = marked(mdxContent);

  htmlResult = htmlResult.replace(/<img\s+[^>]*>/g, "");

  return htmlResult;
}
