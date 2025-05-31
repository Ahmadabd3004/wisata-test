<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useRouter, useRoute } from 'vue-router'

import { getDiaryContentById } from '../../../api/cms'
import {
  renderDiaryContent,
  getDiaryContentSEOAttributes,
  getSizeOptimizedImageUrl,
} from '../../../utils/cms'

const detailTransitionBox = ref(null)
const router = useRouter()
const route = useRoute()

const currentArticle = ref(null)
const loading = ref(true)
const error = ref(null)
const renderedContent = ref('')

const fetchArticle = async (id) => {
  loading.value = true
  error.value = null
  currentArticle.value = null
  renderedContent.value = ''

  try {
    const data = await getDiaryContentById(id)
    if (data) {
      console.log(data, 'cekinidata')
      currentArticle.value = data

      renderedContent.value = renderDiaryContent(data)

      const seoAttributes = getDiaryContentSEOAttributes(data)
      document.title = seoAttributes.title
      let metaDescriptionTag = document.querySelector('meta[name="description"]')
      if (!metaDescriptionTag) {
        metaDescriptionTag = document.createElement('meta')
        metaDescriptionTag.name = 'description'
        document.head.appendChild(metaDescriptionTag)
      }
      metaDescriptionTag.setAttribute('content', seoAttributes.description)

      let ogImageTag = document.querySelector('meta[property="og:image"]')
      if (!ogImageTag) {
        ogImageTag = document.createElement('meta')
        ogImageTag.setAttribute('property', 'og:image')
        document.head.appendChild(ogImageTag)
      }
      if (seoAttributes.ogImage) {
        ogImageTag.setAttribute('content', seoAttributes.ogImage)
      }
    } else {
      error.value = 'Article not found.'
    }
  } catch (err) {
    error.value = 'Failed to load article content: ' + (err.message || 'Unknown error')
    console.error('Error fetching article:', err)
  } finally {
    loading.value = false
  }
}

const getOptimizedImage = (url, size) => {
  return getSizeOptimizedImageUrl(url, size)
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  try {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (e) {
    console.error('Error formatting date:', e)
    return isoString
  }
}

onMounted(() => {
  nextTick(() => {
    if (window.twttr && window.twttr.widgets && window.twttr.widgets.load) {
      window.twttr.widgets.load()
    }
  })
  if (route.params.id) {
    fetchArticle(route.params.id)
  } else {
    error.value = 'No article ID provided.'
    loading.value = false
  }

  gsap.set('.title', {
    y: 50,
    opacity: 0,
  })
  gsap.set('.date', {
    y: 50,
    opacity: 0,
  })
  gsap.set('.badge', {
    y: 50,
    opacity: 0,
  })
  gsap.set('.row', {
    opacity: 0,
    height: '0%',
  })

  if (detailTransitionBox.value) {
    gsap.set(detailTransitionBox.value, {
      x: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black',
      display: 'block',
      opacity: 1,
      zIndex: 99999,
    })

    gsap.to(detailTransitionBox.value, {
      x: '100%',
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(detailTransitionBox.value, { display: 'none', clearProps: 'all' })
        gsap.to('.title', {
          y: 0,
          opacity: 1,
          ease: 'hop',
          duration: 0.7,
        })
        gsap.to('.date', {
          y: 0,
          opacity: 1,
          ease: 'hop',
          duration: 0.7,
        })
        gsap.to('.badge', {
          y: 0,
          opacity: 1,
          ease: 'hop',
          duration: 0.7,
        })
        gsap.to('.row', {
          opacity: 1,
          duration: 0.8,
          ease: 'hop',
        })
      },
    })
  }
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchArticle(newId)
    } else {
      error.value = 'No article ID provided.'
      loading.value = false
    }
  },
)
watch(renderedContent, async () => {
  await nextTick()
  if (window.twttr && window.twttr.widgets && window.twttr.widgets.load) {
    window.twttr.widgets.load()
  }
})

const handleBack = () => {
  gsap.set(detailTransitionBox.value, {
    x: 0,
    width: '0',
    height: '100vh',
    backgroundColor: 'black',
    display: 'block',
    zIndex: 99999,
  })
  gsap.to(detailTransitionBox.value, {
    x: 0,
    duration: 0.7,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black',
    display: 'block',
    zIndex: 99999,
    onComplete: () => {
      router.back()
    },
  })
}
</script>
<template>
  <div class="detail-transition-box" ref="detailTransitionBox"></div>

  <div class="detail-content-wrapper">
    <div
      v-if="loading"
      class="loading-state vh-100 d-flex justify-content-center align-items-center"
    >
      <div class="spinner-border text-dark" style="width: 5rem; height: 5rem" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div
      v-else-if="error"
      class="error-state vh-100 d-flex justify-content-center align-items-center text-danger"
    >
      <p>Error loading content: {{ error }}</p>
    </div>

    <div v-else-if="currentArticle">
      <div class="position-relative w-100" style="height: 40vh; min-height: 380px">
        <img
          :src="getOptimizedImage(currentArticle.meta.image, 'large')"
          class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
          style="filter: blur(10px); opacity: 1; z-index: 1"
          alt="Background"
        />

        <div
          class="h-100 w-100 position-absolute"
          style="background-color: black; z-index: 9; opacity: 0.5"
        ></div>
        <div class="d-flex flex-column justify-content-center align-items-center w-100 h-100">
          <img
            :src="getOptimizedImage(currentArticle.meta.image, 'large')"
            class="w-100 h-100 object-fit-cover"
            style="z-index: 2; max-width: 1024px"
            alt="Main"
          />
          <div
            class="position-absolute text-white d-flex flex-column justify-content-center align-items-start px-5 pb-5 w-100"
            style="z-index: 9999999999; bottom: 0; max-width: 1024px"
          >
            <img
              src="/back-white.png"
              alt="Back"
              style="width: 50px"
              class="back-btn"
              @click="handleBack"
            />
            <br />
            <span class="badge bg-light text-dark mb-2 p-2 type" style="font-family: 'Montserrat'"
              >Artikel</span
            >
            <h1 class="display-5 fw-bold title w-100" style="font-family: 'Montserrat'">
              {{ currentArticle.meta.title }}
            </h1>
            <small class="text-light date" style="font-family: 'Montserrat'">{{
              formatDate(currentArticle.created_dt)
            }}</small>
          </div>
        </div>
      </div>

      <div class="d-flex flex-column justify-content-center align-items-center w-100 h-100">
        <div
          class="row px-5 py-4 diary-content"
          style="max-width: 1024px; line-height: 2"
          v-html="renderedContent"
        ></div>
      </div>
    </div>
    <div v-else class="no-content-state vh-100 d-flex justify-content-center align-items-center">
      <p>Content not found or invalid ID.</p>
    </div>
  </div>
</template>

<style scoped>
.detail-transition-box {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  will-change: transform;
}

.detail-content-wrapper {
  position: relative;
  z-index: 1;
}

.back-btn {
  transition: transform 0.3s ease;
  z-index: 99999999999;
  position: fixed;
  top: 30px;
  left: 45px;
  width: 50px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.back-btn:hover {
  transform: scale(1.2);
}

.diary-content div {
  margin-bottom: 1em;
}
.diary-content h1,
.diary-content h2,
.diary-content h3,
.diary-content h4,
.diary-content h5,
.diary-content h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: bold;
}
.diary-content p {
  margin-bottom: 1em;
}
.diary-content ul,
.diary-content ol {
  margin-bottom: 1em;
  padding-left: 20px;
}
.diary-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
}

.video-embed-wrapper,
.tiktok-embed-wrapper,
.instagram-embed-wrapper,
.twitter-embed-wrapper {
  margin: 1.5em 0;
}

.loading-state,
.error-state,
.no-content-state {
  text-align: center;
}
.detail-transition-box {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  will-change: transform;
}

.detail-content-wrapper {
  position: relative;
  z-index: 1;
}

.back-btn {
  transition: transform 0.3s ease;
  z-index: 99999999999;
  position: fixed;
  top: 30px;
  left: 45px;
  width: 50px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.back-btn:hover {
  transform: scale(1.2);
}

.article-content {
  line-height: 1.8;
  font-size: 1.05rem;
  color: #333;
}

.article-content p {
  margin-bottom: 100px !important;
}

.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4,
.article-content h5,
.article-content h6 {
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3;
  font-family: 'Montserrat', sans-serif;
  color: #222;
}

.article-content h1 {
  font-size: 2.2em;
}
.article-content h2 {
  font-size: 1.8em;
  color: #111;
}
.article-content h5 {
  font-size: 1.2em;
  font-weight: bold;
}

.article-content ul,
.article-content ol {
  margin-bottom: 1.5em;
  padding-left: 25px;
}
.article-content li {
  margin-bottom: 0.5em;
}

.article-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1.5em auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.article-content strong {
  font-weight: 700;
  color: #000;
}

.loading-state,
.error-state,
.no-content-state {
  text-align: center;
}

.article-content p {
  margin-bottom: 1.5em;
}
.diary-content {
  font-family: 'Inter', Arial, sans-serif !important;
  font-size: 1.05rem !important;
  line-height: 1.9 !important;
  color: #232323 !important;
  background: #fff !important;
  word-break: break-word !important;
}

.diary-content :deep(h1),
.diary-content :deep(h2),
.diary-content :deep(h3) {
  font-weight: 700 !important;
  margin-top: 2rem !important;
  margin-bottom: 1rem !important;
  line-height: 1.2 !important;
}

.diary-content :deep(p) {
  margin-bottom: 1.2em !important;
}

.diary-content :deep(ul),
.diary-content :deep(ol) {
  margin-left: 1.3em !important;
  margin-bottom: 1.2em !important;
}

.diary-content :deep(img) {
  max-width: 100% !important;
  border-radius: 12px !important;
  margin: 1.5em 0 !important;
  display: block !important;
  height: auto !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.09) !important;
}

.diary-content :deep(blockquote) {
  border-left: 4px solid #00d8cc !important;
  background: #f6f9f8 !important;
  color: #464646 !important;
  padding: 1em 1.5em !important;
  margin: 1.5em 0 !important;
  border-radius: 8px !important;
  font-style: italic !important;
}

.diary-content :deep(iframe),
.diary-content :deep(embed) {
  max-width: 100% !important;
  width: 100% !important;
  min-height: 360px !important;
  border-radius: 12px !important;
  margin: 2em 0 !important;
  display: block !important;
}

.diary-content :deep(.twitter-tweet) {
  margin: 2em auto !important;
  border-radius: 12px !important;
  overflow: hidden !important;
}

.diary-content :deep(TiktokEmbed),
.diary-content :deep(YoutubeEmbed),
.diary-content :deep(InstagramEmbed),
.diary-content :deep(TwitterEmbed) {
  display: block !important;
  margin: 2em 0 !important;
  width: 100% !important;
  /* min-height: 360px !important; */
  border-radius: 12px !important;
  background: #f9f9f9 !important;
}

.diary-content :deep(.twitter-embed-wrapper) {
  width: 100% !important;
  max-width: 540px !important;
  margin: 2em auto !important;
  display: flex !important;
  justify-content: center !important;
  background: transparent !important;
}
.diary-content :deep(.twitter-tweet) {
  margin: 0 !important;
  border-radius: 16px !important;
  overflow: hidden !important;
  background: #fff !important;
}
</style>
