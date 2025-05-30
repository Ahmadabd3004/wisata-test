<template>
  <transition name="fade-slide">
    <div v-if="visible" class="share-menu shadow-sm" @click.self="hide">
      <p
        style="
          color: black;
          padding-left: 20px !important;
          padding-top: 10px !important;
          padding-bottom: 10px !important;
        "
      >
        Share
      </p>
      <ul class="share-list">
        <li @click="share('facebook')"><i class="bi bi-facebook me-2"></i> Facebook</li>
        <li @click="share('twitter')"><i class="bi bi-twitter me-2"></i> Twitter</li>
        <li @click="share('whatsapp')"><i class="bi bi-whatsapp me-2"></i> WhatsApp</li>
        <li @click="share('reddit')"><i class="bi bi-reddit me-2"></i> Reddit</li>
        <li @click="copyLink"><i class="bi bi-link-45deg me-2"></i> Copy link</li>
      </ul>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  url: String,
  visible: Boolean,
})
const emit = defineEmits(['hide'])

const hide = () => emit('hide')

const share = (platform) => {
  const encodedURL = encodeURIComponent(props.url)
  const shareUrls = {
    facebook: `https://facebook.com/sharer/sharer.php?u=${encodedURL}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedURL}`,
    whatsapp: `https://wa.me/?text=${encodedURL}`,
    reddit: `https://reddit.com/submit?url=${encodedURL}`,
  }
  window.open(shareUrls[platform], '_blank')
}

const copyLink = async () => {
  await navigator.clipboard.writeText(props.url)
  alert('Link copied to clipboard!')
}
</script>

<style scoped>
.share-menu {
  position: absolute;
  background: white;
  border-radius: 12px;
  padding: 10px 0;
  width: 200px;
  top: -270px;
  left: -180px;
  z-index: 99999999999;
  border: 1px solid #eee;
}
.share-list {
  list-style: none;
  padding: 0;
  margin: 0;
  color: black;
}
.share-list li {
  padding: 10px 20px !important;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  border-radius: 12px;
}
.share-list li:hover {
  background: #f5f5f5;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
