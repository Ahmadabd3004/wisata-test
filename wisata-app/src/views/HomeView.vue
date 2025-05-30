<template>
  <div class="detail-transition-box" ref="detailTransitionBox"></div>

  <div
    class="vh-100 d-flex flex-column justify-content-center align-items-center text-center heroes-section"
  >
    <h1 class="display-1 fw-bold text-uppercase mb-4 heroes-title">DIARIES</h1>
    <p
      class="text-uppercase small mb-5 heroes-desc"
      style="letter-spacing: 0.3rem; font-family: 'Montserrat'"
    >
      Let the journey choose you — start with our latest stories
    </p>
    <div class="text-center heroes-scroll" style="position: fixed; bottom: 0">
      <p class="text-uppercase mb-1" style="font-family: 'Montserrat'; font-size: 12px">
        Scroll to see diaries
      </p>
      <div class="animate__animated animate__bounce">
        <i class="bi bi-chevron-down fs-4"></i>
      </div>
    </div>
  </div>

  <div class="row g-3">
    <div class="col-12 col-md-4" v-for="item in items" :key="item.id">
      <div class="card-box ratio-box position-relative overflow-hidden">
        <div class="overflow-hidden w-100 h-100 position-relative">
          <img
            :src="`${item.image}`"
            class="animate-box w-100 h-100 object-fit-cover"
            :ref="(el) => (images[item.id] = el)"
            @load="item.loaded = true"
          />
          <div class="card-body-overlay">
            <div class="card-content" @click="openHeroPage(item.id)">
              <h5 class="card-title">
                {{ truncateText(item.title, 50) }}
              </h5>
              <small class="card-date fw-bold">{{ formatDate(item.date) }}</small>
              <img class="card-icon" src="/pwa-icon.png" alt="" />
              <div
                class="card-icon-share"
                style="z-index: 999999 !important"
                @click.stop="onShareClick(item.id)"
              >
                <img class="" src="/share-icon.png" alt="" style="width: 20px; height: 20px" />
                <ShareMenu
                  v-if="selectedShareItem === item.id"
                  class="share-content"
                  :visible="showShare"
                  :url="currentUrl"
                  @hide="showShare = false"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="items.slice(-3).some((item) => !item.loaded)" class="text-center w-100 py-5">
    <div class="spinner-border text-dark" style="width: 5rem; height: 5rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <InfiniteLoading @infinite="loadMore" spinner="false" />

  <div class="hero-gray-box" :ref="(el) => (heroGrayBox = el)" @click="closeHeroPage"></div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
import { useRouter } from 'vue-router'
import { getDiaryFeed } from '../../../api/cms'
import ShareMenu from '../components/ShareMenu.vue'

const showShare = ref(false)
const currentUrl = ref('')
gsap.registerPlugin(ScrollTrigger)
const detailTransitionBox = ref(null)
const realItems = ref()
const items = ref([
  {
    id: 1,
    loaded: false,
    title: 'Peran Teknologi dalam Mendukung Pariwisata Berkelanjutan',
    description:
      'Inovasi teknologi membuka jalan baru untuk praktik pariwisata yang lebih ramah lingkungan dan bertanggung jawab, mulai dari aplikasi hingga sensor pintar.',
    date: 'May 29, 2025',
  },
  {
    id: 2,
    loaded: false,
    title: 'Menjelajahi Keindahan Tersembunyi di Timur Indonesia',
    description:
      'Dari Raja Ampat hingga Wae Rebo, temukan pesona alam dan budaya yang belum banyak terekspos di kepulauan timur Indonesia.',
    date: 'April 15, 2025',
  },
  {
    id: 3,
    loaded: false,
    title: 'Festival Budaya: Jendela Keberagaman Nusantara',
    description:
      'Rangkaian festival budaya di berbagai daerah menawarkan pengalaman unik dan mendalam tentang kekayaan tradisi Indonesia.',
    date: 'March 01, 2025',
  },
  {
    id: 4,
    loaded: false,
    title: 'Kuliner Lokal yang Wajib Dicoba di Pulau Jawa',
    description:
      'Petualangan rasa di Jawa dengan mencicipi hidangan otentik dari gudeg, sate lilit, hingga rawon yang menggugah selera.',
    date: 'February 20, 2025',
  },
  {
    id: 5,
    loaded: false,
    title: 'Tips Aman Berlibur di Destinasi Populer',
    description:
      'Panduan lengkap untuk menjaga keamanan dan kenyamanan selama perjalanan Anda, termasuk tips memilih akomodasi dan transportasi.',
    date: 'January 10, 2025',
  },
  {
    id: 6,
    loaded: false,
    title: 'Eksplorasi Hutan Mangrove: Paru-Paru Hijau Pesisir',
    description:
      'Mengunjungi ekowisata mangrove yang tidak hanya indah tetapi juga penting untuk menjaga ekosistem pesisir dan keanekaragaman hayati.',
    date: 'December 05, 2024',
  },
])
const fetchDiary = async () => {
  const data = await getDiaryFeed()
  realItems.value = data.map((e) => {
    return {
      id: e.id,
      title: e.meta.title,
      description: e.meta.description,
      image: e.meta.image,
      date: e.created_dt,
      loaded: false,
    }
  })
  items.value = realItems.value.slice(0, 6)
  console.log(items.value)
}
onMounted(() => {
  fetchDiary()
  gsap.set('.heroes-title', { opacity: 0, y: 0 })
  gsap.set('.heroes-desc', { opacity: 0, y: 100 })
  gsap.set('.heroes-scroll', { opacity: 1, y: 20 })

  gsap.to('.heroes-section .heroes-title', {
    scale: 0.5,
    y: 400,
    scrollTrigger: {
      trigger: '.heroes-title',
      start: 'bottom 50%',
      end: 'top -100%',
      toggleActions: 'play none none reverse',
    },
  })
  gsap.to('.heroes-section .heroes-desc', {
    scale: 0.8,
    y: 315,
    scrollTrigger: {
      trigger: '.heroes-title',
      start: 'bottom 50%',
      end: 'top -100%',
      toggleActions: 'play none none reverse',
    },
  })
  gsap.to('.heroes-section .heroes-scroll', {
    display: 'none',
    scrollTrigger: {
      trigger: '.heroes-title',
      start: 'bottom 50%',
      end: 'top -100%',
      toggleActions: 'play none none reverse',
    },
  })

  if (detailTransitionBox.value) {
    gsap.set(detailTransitionBox.value, {
      x: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black',
      display: 'block',
      opacity: 1,
    })
    gsap.to(detailTransitionBox.value, {
      delay: 1,
      y: '-100%',
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.to('.heroes-title', { opacity: 1, y: 0 })
        gsap.to('.heroes-desc', { opacity: 1, y: 0 })
        gsap.to('.heroes-scroll', {
          y: 0,
          opacity: 0.5,
          duration: 1.7,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1,
        })
      },
    })
  }
})
const router = useRouter()

const images = ref({})
const heroGrayBox = ref(null)

const loadMore = async ($state) => {
  setTimeout(() => {
    const currentLength = items.value.length
    const nextItems = realItems.value.slice(currentLength, currentLength + 3)

    if (nextItems.length > 0) {
      items.value.push(...nextItems)
      $state.loaded()
    } else {
      $state.complete()
    }
  }, 1000)
}
watchEffect(() => {
  const newlyLoaded = items.value.slice(-3)
  const allLoaded = newlyLoaded.every((item) => item.loaded)
  if (allLoaded) animateCards()
})

function formatDate(isoString) {
  const date = new Date(isoString)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('id-ID', options)
}
const selectedShareItem = ref()
const onShareClick = (item) => {
  //   console.log('klikini', item)
  showShare.value = !showShare.value
  currentUrl.value = window.location.origin + '/' + item.id
  selectedShareItem.value = item
}

const animateCards = () => {
  const boxes = Object.values(images.value).filter((box) => box && !box.dataset.animated)

  boxes.forEach((box, i) => {
    box.dataset.animated = true

    let fromVars = { opacity: 0 }
    if (i % 3 === 0) fromVars.x = -500
    else if (i % 3 === 1) fromVars.y = 150
    else fromVars.x = 500

    gsap.fromTo(box, fromVars, {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: box,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })
  })
}

const openHeroPage = (id) => {
  const clickedTileImage = images.value[id]
  const targetGrayBox = heroGrayBox.value

  if (!clickedTileImage || !targetGrayBox) return

  const rect = clickedTileImage.getBoundingClientRect()

  gsap.to('.card-body-overlay', { opacity: 0, duration: 0.2 })

  gsap.set(targetGrayBox, {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 1,
    display: 'block',
    zIndex: 9999,
  })

  gsap.to(targetGrayBox, {
    duration: 1.2,
    x: '0',
    y: '0',
    width: '100vw',
    height: '100vh',
    ease: 'power3.inOut',
    onComplete: () => {
      router.push(`/${id}`)
      gsap.set(targetGrayBox, { clearProps: 'all', display: 'none' })
      window.scrollTo(0, 0)
    },
  })

  gsap.to(clickedTileImage, { opacity: 0, duration: 0.3 })
}
const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}
const closeHeroPage = () => {
  const targetGrayBox = heroGrayBox.value
  if (!targetGrayBox) return

  const lastClickedId = Object.keys(images.value).find(
    (id) => gsap.getProperty(images.value[id], 'opacity') < 1,
  )
  const clickedTileImage = images.value[lastClickedId]

  if (!clickedTileImage) {
    gsap.to(targetGrayBox, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.set(targetGrayBox, { display: 'none', clearProps: 'all' })
        document.body.style.overflow = ''
      },
    })
    gsap.to('.card-body-overlay', { opacity: 1, duration: 0.3 })
    return
  }

  const rect = clickedTileImage.getBoundingClientRect()

  gsap.to(targetGrayBox, {
    duration: 0.6,
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
    opacity: 0,
    ease: 'power3.inOut',
    onComplete: () => {
      gsap.set(targetGrayBox, { display: 'none', clearProps: 'all' })
      document.body.style.overflow = ''
    },
  })

  gsap.to(clickedTileImage, { opacity: 1, duration: 0.3, delay: 0.5 })
  gsap.to('.card-body-overlay', { opacity: 1, duration: 0.3, delay: 0.5 })
}
</script>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css';
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
@import url('https://fonts.googleapis.com/css2?family=Aboreto&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.heroes-title {
  font-family: 'Aboreto', system-ui;
  font-size: 80px;
  letter-spacing: 0.5rem !important;
}

@media (min-width: 768px) {
  .heroes-title {
    font-size: 150px;
    letter-spacing: 0.75rem !important;
  }
}

@media (min-width: 1024px) {
  .heroes-title {
    font-size: 180px;
    letter-spacing: 1rem !important;
  }
}

.ratio-box {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  width: 100%;
  transition: transform 0.3s ease;
  position: relative;
}

.card-box:hover {
  cursor: pointer;
}

.card-body-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: white;
  padding: 1rem;
  transition:
    height 0.4s ease,
    background 0.4s ease;
  overflow: hidden;
  /* pointer-events: none; */
  z-index: 3;
  opacity: 0;
}

.card-box:hover .card-body-overlay {
  height: 100%;
  opacity: 1;
  z-index: 3;
  justify-content: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4));
}

.card-content {
  opacity: 0;
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-left: 50px !important;
  padding-right: 50px !important;
}

.card-icon {
  position: absolute;
  bottom: 30px;
  left: 30px;
  width: 30px;
  height: 30px;
}

.card-icon-share {
  position: absolute;
  bottom: 30px;
  right: 30px;
  /* background-color: aqua; */
}

.card-box:hover .card-content {
  transform: translateY(0);
  opacity: 1;
  transition-delay: 0.1s;
}

.card-title {
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-family: 'Montserrat';
}

.card-date {
  font-size: 0.85rem;
  color: #ffffff;
  position: absolute;
  top: 30px;
  right: 30px;
  font-family: 'Montserrat';
}

.card-description {
  font-size: 0.9rem;
  margin-top: 0.75rem;
}

.animate-box {
  will-change: transform, opacity;
}

.hero-gray-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  background-color: #cccccc;
  display: none;
  opacity: 0;
  z-index: 9999;
  cursor: zoom-out;
}

.detail-transition-box {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  will-change: transform;
}

.footer {
  background-color: #333;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
}

.footer-logo {
  max-width: 40px;
  height: auto;
}

.footer-links li {
  display: inline-block;
  margin: 0 5px;
}

.footer-links a {
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #aaa;
}

.social-icons a {
  transition: color 0.3s ease;
}

.social-icons a:hover {
  color: #ddd;
}

.footer .row {
  flex-direction: column;
  text-align: center;
}

.footer .col-sm-12 {
  margin-bottom: 15px;
}

@media (min-width: 768px) {
  .footer .row {
    flex-direction: row;
    text-align: left;
  }

  .footer .col-md-4.text-md-start {
    text-align: left !important;
  }

  .footer .col-md-4.text-md-end {
    text-align: right !important;
  }

  .footer .col-md-4.text-center {
    text-align: center !important;
  }

  .footer .col-md-4 {
    margin-bottom: 0;
  }
}

p,
h1,
small,
span,
a,
li {
  font-family: 'Montserrat', sans-serif;
}
</style>
