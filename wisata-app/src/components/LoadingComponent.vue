<template>
    <div class="detail-transition-box" ref="detailTransitionBox"></div>

    <div class="loading-container d-flex flex-column justify-content-center align-items-center"
        ref="loadingContainerRef">
        <h1 ref="countRef">{{ count }}</h1>
        <img ref="logoRef" src="/logo.svg" alt="website-logo" width="200" height="50"
            style="opacity: 0; transform: translateY(20px);" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

const detailTransitionBox = ref(null);

const props = defineProps({
    setLoading: Function
});

const count = ref(0);

const loadingContainerRef = ref(null);
const countRef = ref(null);
const logoRef = ref(null);

let tl = null;

const triggerAnimation = () => {
    tl = gsap.timeline();
    tl.to(".loading-container h1", {
        duration: 1,
        ease: "hop",
        y: -100,
        opacity: 0
    })
        .to(".loading-container h1", {
            display: "none",
        }, "-0.01")
        .to(".loading-container img", {
            y: 0,
            opacity: 1,
            ease: "hop",
            duration: 1,
            onComplete: () => {
                gsap.set(detailTransitionBox.value, {
                    y: '100%',
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'black',
                    display: 'block',
                    zIndex: 99999,
                });
                gsap.to(detailTransitionBox.value, {
                    delay: 0.5,
                    duration: 0.7,
                    ease: 'power3.inOut',
                    y: 0,
                    backgroundColor: 'black',
                    display: 'block',
                    zIndex: 99999,
                    onComplete: () => {
                        gsap.set(detailTransitionBox.value, { display: 'none', clearProps: 'all' });
                        props.setLoading(true);
                    }
                });
            }
        }, "<")
};

onMounted(() => {
    const interval = setInterval(() => {
        if (count.value >= 100) {
            count.value = 100;
            clearInterval(interval);
            return;
        }

        const currentCount = count.value;
        if (currentCount >= 96) {
            count.value = 100;
        } else {
            count.value = Math.min(100, currentCount + 8);
        }
    }, 100);

    return () => clearInterval(interval);
});

watch(count, (newCount, oldCount) => {
    if (newCount >= 96 && oldCount < 96) {
        triggerAnimation();
    }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Aboreto&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.loading-container {
    height: 100vh;
    width: 100vw;
    background: rgb(255, 255, 255);
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    font-family: "Aboreto", system-ui;
}

.detail-transition-box {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    will-change: transform;
}
</style>