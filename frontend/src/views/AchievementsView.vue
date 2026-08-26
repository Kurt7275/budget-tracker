<template>
  <div class="badges-page">
    <Navbar />

    <main class="badges-main">
      <section class="badges-header">
        <div class="comic-badge-yellow" style="margin-bottom: 0.35rem;">TROPHIES &amp; LEVEL</div>
        <h1 class="badges-title">READER ACHIEVEMENTS</h1>
        <p class="badges-sub">Earn XP for every chapter and volume read to unlock legendary comic badges.</p>
      </section>

      <!-- Level & XP Status Banner -->
      <div class="xp-banner-card">
        <div class="xp-banner-top">
          <div>
            <div class="comic-badge-yellow">CURRENT RANK</div>
            <h2 style="font-family: var(--font-comic); font-size: 2.2rem; margin-top: 0.25rem;">
              LEVEL {{ comicStore.user.level }} — MULTIVERSE RANGER
            </h2>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-comic); font-size: 1.8rem; color: var(--f-yellow);">
              {{ comicStore.user.xp }} / {{ comicStore.user.nextLevelXp }} XP
            </div>
            <div style="font-family: var(--font-body); font-size: 0.8rem; font-weight: 700; color: #BBB;">Next level in {{ comicStore.user.nextLevelXp - comicStore.user.xp }} XP</div>
          </div>
        </div>

        <div class="ch-bar-track" style="height: 10px; border-color: #FFF;">
          <div
            class="ch-bar-fill"
            :style="{ width: ((comicStore.user.xp / comicStore.user.nextLevelXp) * 100) + '%', background: 'var(--f-yellow)' }"
          ></div>
        </div>
      </div>

      <!-- Badges Showcase Grid -->
      <div class="badges-grid">
        <div
          v-for="badge in BADGES"
          :key="badge.id"
          class="badge-item-card"
          :class="{ unlocked: badge.unlocked }"
        >
          <div class="badge-icon-box">{{ badge.icon }}</div>
          <div class="badge-info-pane">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <h4 class="badge-title">{{ badge.title }}</h4>
              <span class="card-burst-tag" :class="badge.unlocked ? 'completed' : 'plan'">
                {{ badge.unlocked ? 'UNLOCKED' : 'LOCKED' }}
              </span>
            </div>
            <p class="badge-desc">{{ badge.desc }}</p>
            <div class="badge-xp-reward">+{{ badge.xp }} XP</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import { comicStore } from '../stores/useComicStore.js'

const BADGES = [
  { id: 1, icon: '📖', title: 'First Issue', desc: 'Added your very first comic or manga to the shelf.', xp: 50, unlocked: true },
  { id: 2, icon: '⚡', title: 'Speed Reader', desc: 'Logged 25 chapters in a single reading session.', xp: 100, unlocked: true },
  { id: 3, icon: '🔥', title: 'Streak Flame', desc: 'Maintained a 7-day consecutive reading streak.', xp: 200, unlocked: true },
  { id: 4, icon: '🌌', title: 'Multiverse Hopper', desc: 'Read both Western Comics and Japanese Manga.', xp: 250, unlocked: true },
  { id: 5, icon: '👑', title: 'Shadow Monarch', desc: 'Completed a full 100+ chapter series from start to finish.', xp: 500, unlocked: true },
  { id: 6, icon: '📚', title: 'Century Club', desc: 'Log over 1,000 total chapters on your account.', xp: 750, unlocked: false },
  { id: 7, icon: '🦇', title: 'Gotham Detective', desc: 'Complete the entire Batman Modern Era reading order.', xp: 1000, unlocked: false },
  { id: 8, icon: '🏆', title: 'Legendary Lore Master', desc: 'Reach Level 10 reader status and collect 20 badges.', xp: 2000, unlocked: false }
]
</script>

<style scoped>
.badges-page {
  min-height: 100vh;
  background-color: var(--f-bg);
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
  display: flex;
  flex-direction: column;
}

.badges-main {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.badges-title {
  font-family: var(--font-comic);
  font-size: 2.8rem;
  line-height: 1;
  color: var(--f-text);
  letter-spacing: 0.04em;
}

.badges-sub {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: #666;
  margin-top: 0.25rem;
}

.xp-banner-card {
  background: #11141D;
  color: #FFF;
  border: 3px solid #000;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 6px 6px 0 #000;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.xp-banner-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.badge-item-card {
  background: #FFF;
  border: 3px solid #111;
  border-radius: 6px;
  padding: 1.25rem;
  box-shadow: 4px 4px 0 #111;
  display: flex;
  gap: 1rem;
  opacity: 0.7;
}

.badge-item-card.unlocked {
  opacity: 1;
  border-color: #111;
}

.badge-icon-box {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  background: var(--f-bg);
  border: 2px solid #111;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge-info-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.badge-title {
  font-family: var(--font-comic);
  font-size: 1.25rem;
  color: #111;
}

.badge-desc {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  color: #555;
  line-height: 1.35;
}

.badge-xp-reward {
  font-family: var(--font-comic);
  font-size: 0.95rem;
  color: var(--f-red);
  margin-top: 0.35rem;
}
</style>
