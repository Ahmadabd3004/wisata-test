import { marked } from "marked";

marked.setOptions({
  breaks: true,
  gfm: true,
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

function replaceTiktokCustomTag(html) {
  return html.replace(/<TiktokEmbed\s+url="([^"]+)"\s*\/?>/gi, (match, url) => {
    const m = url.match(/\/video\/(\d+)/);
    const videoId = m ? m[1] : "";
    if (!videoId) return "";
    return `
        <div class="tiktok-embed-wrapper">
          <iframe
            src="https://www.tiktok.com/player/v1/${videoId}?music_info=1&description=1"
            width="100%" height="540"
            frameborder="0"
            allowfullscreen
            scrolling="no"
            style="border-radius:16px;max-width:420px;margin:1.5em auto;display:block;background:#000;"
          ></iframe>
        </div>
      `;
  });
}
function replaceInstagramCustomTag(html) {
  return html.replace(
    /<InstagramEmbed\s+url="([^"]+)"\s*\/?>/gi,
    (match, url) => {
      const m = url.match(/instagram\.com\/p\/([^/?]+)/i);
      const shortcode = m ? m[1] : "";
      if (!shortcode) return "";
      return `
        <div class="instagram-embed-wrapper">
          <iframe
            src="https://www.instagram.com/p/${shortcode}/embed"
            allowtransparency="true"
            allowfullscreen="true"
            scrolling="no"
            style="width:100%; min-width:320px; max-width:540px; border-radius:16px; background:#fff; margin: 1.5em auto; display:block;"
            frameborder="0"
          ></iframe>
        </div>
      `;
    }
  );
}
function replaceTwitterCustomTag(html) {
  return html.replace(
    /<TwitterEmbed\s+url="([^"]+)"\s*\/?>/gi,
    (match, url) => {
      if (!url) return "";
      return `
        <div class="twitter-embed-wrapper">
          <blockquote class="twitter-tweet">
            <a href="${url}"></a>
          </blockquote>
        </div>
      `;
    }
  );
}
function replaceYoutubeCustomTag(html) {
  return html.replace(
    /<YoutubeEmbed\s+url="([^"]+)"\s*\/?>/gi,
    (match, url) => {
      if (!url) return "";
      return `
        <div class="youtube-embed-wrapper">
          <iframe
            src="${url}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
            width="100%" height="360"
            style="aspect-ratio: 16/9; border-radius: 16px; background:#000; margin: 1.5em 0; display:block;"
          ></iframe>
        </div>
      `;
    }
  );
}

/**
 * TASK: Convert diary content to renderable data (HANYA TEKS).
 *
 * Menghilangkan semua embed (YouTube, TikTok, Instagram, Twitter) dan gambar.
 * Hanya menampilkan teks murni dari konten Markdown.
 *
 * @param {Object} contentData - Objek data konten diary dari API, berisi properti `content` (MDX).
 * @returns {string}
 */
export function renderDiaryContent(contentData) {
  if (!contentData || !contentData.content) return "";

  let mdxContent = contentData.content;

  let htmlResult = marked(mdxContent);
  htmlResult = replaceTiktokCustomTag(htmlResult);
  htmlResult = replaceInstagramCustomTag(htmlResult);
  htmlResult = replaceTwitterCustomTag(htmlResult);
  htmlResult = replaceYoutubeCustomTag(htmlResult);

  return htmlResult;
}
