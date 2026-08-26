<template>
  <div>
    <!-- Pop-Art Loading Screen -->
    <transition name="loader-fade">
      <div v-if="loading" class="app-loader">
        <div class="app-loader-bg"></div>
        <div class="app-loader-content">
          <div class="app-loader-logo">COMIC<span>VERSE</span></div>
          <div class="app-loader-dots">
            <span></span><span></span><span></span>
          </div>
          <div class="app-loader-tagline">Loading your universe...</div>
        </div>
      </div>
    </transition>

    <!-- Main App -->
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Global Pop-Art Add Modal -->
    <AddModal />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AddModal from './components/AddModal.vue'

const loading = ref(true)

// Lock scroll immediately — before any rendering — so no scrollbar shows during loader
document.documentElement.style.overflow = 'hidden'
document.body.style.overflow = 'hidden'

onMounted(() => {
  setTimeout(() => {
    loading.value = false
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }, 2000)
})
</script>

<style>
/* ── Page Transition ── */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

/* ── Loader Fade Out ── */
.loader-fade-leave-active {
  transition: opacity 0.6s ease;
}
.loader-fade-leave-to {
  opacity: 0;
}

/* ── Loading Screen ── */
.app-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FAF4E8;
  overflow: hidden;
}

/* Same dot pattern as landing page */
.app-loader-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0,0,0,0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
}

.app-loader-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.app-loader-logo {
  font-family: 'Bangers', cursive;
  font-size: clamp(3.5rem, 10vw, 6rem);
  letter-spacing: 0.08em;
  color: #F5D13B;
  -webkit-text-stroke: 3px #111111;
  text-shadow: 5px 5px 0px #8B3A1C;
  line-height: 1;
}

.app-loader-logo span {
  color: #FFFFFF;
  -webkit-text-stroke: 3px #111111;
}

/* Bouncing dots */
.app-loader-dots {
  display: flex;
  gap: 0.6rem;
}

.app-loader-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #F5D13B;
  border: 2px solid #111111;
  animation: loader-bounce 0.7s ease-in-out infinite;
}

.app-loader-dots span:nth-child(2) { animation-delay: 0.15s; background: #EE3545; }
.app-loader-dots span:nth-child(3) { animation-delay: 0.30s; background: #44C555; }

@keyframes loader-bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}

.app-loader-tagline {
  font-family: 'Bangers', cursive;
  font-size: 1.1rem;
  letter-spacing: 0.12em;
  color: rgba(17,17,17,0.45);
}
</style>
