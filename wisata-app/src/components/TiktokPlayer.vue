<template>
  <div class="tiktok-player">
    <iframe
      ref="tiktokIframe"
      :src="playerSrc"
      height="540"
      width="320"
      allow="fullscreen"
      frameborder="0"
      title="TikTok Player"
      style="border-radius: 16px; max-width: 100%; background: #000"
    ></iframe>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Terima videoId lewat props
const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
})

const tiktokIframe = ref(null)
const to = ref('0')

// Dynamic src TikTok
// const playerSrc = `https://www.tiktok.com/player/v1/${props.videoId}?music_info=1&description=1`
// const playerSrc = `https://www.tiktok.com/player/v1/7499883450241928470?music_info=1&description=1`
const playerSrc = `https://www.tiktok.com/player/v1/${props.videoId}?music_info=1&description=1`

function jumpTo() {
  if (tiktokIframe.value) {
    tiktokIframe.value.contentWindow.postMessage(
      {
        type: 'seekTo',
        value: Number(to.value),
        'x-tiktok-player': true,
      },
      '*',
    )
  }
}
</script>

<style scoped>
.tiktok-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2em 0;
}
.tiktok-player iframe {
  width: 100% !important;
  max-width: 420px !important;
  min-height: 450px !important;
  border-radius: 16px !important;
  background: #000 !important;
}
</style>
