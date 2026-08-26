<template>
  <div class="watchlist-page">
    <Navbar />

    <main class="watchlist-main">
      <section class="watchlist-header">
        <div class="comic-badge-yellow" style="margin-bottom: 0.35rem;">ANIME &amp; MOVIES</div>
        <h1 class="watchlist-title">ADAPTATIONS WATCHLIST</h1>
        <p class="watchlist-sub">Track comic and manga TV adaptations, anime seasons, and movies.</p>
      </section>

      <!-- Watchlist Grid -->
      <div class="watchlist-grid">
        <div
          v-for="item in comicStore.watchlist"
          :key="item.id"
          class="watch-card"
        >
          <div class="watch-cover-box">
            <img :src="item.cover" :alt="item.title" class="watch-cover-img" />
            <span class="card-burst-tag reading">BINGE!</span>
          </div>

          <div class="watch-card-body">
            <div class="watch-meta-top">
              <span class="media-pill-badge" style="background: var(--f-yellow); font-size: 0.75rem;">{{ item.type }}</span>
              <span style="color: #FF8F00; font-weight: 700;">★ {{ item.rating }}</span>
            </div>

            <h3 class="watch-title">{{ item.title }}</h3>
            <p style="font-family: var(--font-body); font-size: 0.85rem; font-weight: 700; color: #666;">Season {{ item.season }}</p>

            <div class="watch-ep-progress">
              <div class="ch-bar-track">
                <div class="ch-bar-fill" :style="{ width: ((item.currentEpisode / item.totalEpisodes) * 100) + '%' }"></div>
              </div>
              <span style="font-family: var(--font-body); font-size: 0.8rem; font-weight: 700;">
                Ep. {{ item.currentEpisode }} / {{ item.totalEpisodes }}
              </span>
            </div>

            <div style="display: flex; gap: 0.4rem; margin-top: 0.25rem;">
              <button
                type="button"
                class="btn-comic-yellow"
                style="flex: 1; font-size: 0.9rem; padding: 0.35rem;"
                @click="item.currentEpisode = Math.min(item.totalEpisodes, item.currentEpisode + 1)"
              >
                +1 EPISODE
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import { comicStore } from '../stores/useComicStore.js'
</script>

<style scoped>
.watchlist-page {
  min-height: 100vh;
  background-color: var(--f-bg);
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
  display: flex;
  flex-direction: column;
}

.watchlist-main {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.watchlist-title {
  font-family: var(--font-comic);
  font-size: 2.8rem;
  line-height: 1;
  color: var(--f-text);
  letter-spacing: 0.04em;
}

.watchlist-sub {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: #666;
  margin-top: 0.25rem;
}

.watchlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.watch-card {
  background: #FFF;
  border: 3px solid #111;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 4px 4px 0 #111;
  display: flex;
  flex-direction: column;
}

.watch-cover-box {
  position: relative;
  height: 160px;
  background: #111;
}

.watch-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.watch-card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  justify-content: space-between;
}

.watch-meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.watch-title {
  font-family: var(--font-comic);
  font-size: 1.3rem;
  color: #111;
}

.watch-ep-progress {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0.35rem 0;
}
</style>
