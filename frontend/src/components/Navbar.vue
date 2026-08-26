<template>
  <header class="app-nav">
    <div class="nav-container">

      <!-- Logo -->
      <router-link to="/shelf" class="nav-logo">
        <span class="nav-logo-badge">POW!</span>
        <span class="nav-logo-title">Comic<span style="color: var(--f-yellow);">Shelf</span></span>
      </router-link>

      <!-- Navigation Links -->
      <nav class="nav-links">
        <router-link to="/shelf" class="nav-link" active-class="active">
          <span>📚 Shelf</span>
        </router-link>
        <router-link to="/discover" class="nav-link" active-class="active">
          <span>🔍 Discover</span>
        </router-link>
        <router-link to="/timelines" class="nav-link" active-class="active">
          <span>🗺️ Timelines</span>
        </router-link>
        <router-link to="/watchlist" class="nav-link" active-class="active">
          <span>🎬 Watchlist</span>
        </router-link>
        <router-link to="/stats" class="nav-link" active-class="active">
          <span>📊 Stats</span>
        </router-link>
        <router-link to="/achievements" class="nav-link" active-class="active">
          <span>🏆 Badges</span>
        </router-link>
      </nav>

      <!-- Right controls: Streak & Profile -->
      <div class="nav-user-controls">
        <!-- Streak -->
        <div class="streak-badge" title="Daily Reading Streak">
          <span>🔥</span>
          <span>{{ comicStore.user.streakDays }}d</span>
        </div>

        <!-- Level / XP -->
        <div class="level-badge" title="Reader Level">
          <span>Lv.{{ comicStore.user.level }}</span>
        </div>

        <!-- Profile button -->
        <router-link to="/profile" class="user-avatar-btn">
          <span>{{ comicStore.user.avatar || '🦸‍♂️' }}</span>
        </router-link>
      </div>

    </div>
  </header>
</template>

<script setup>
import { comicStore } from '../stores/useComicStore.js'
</script>

<style scoped>
.app-nav {
  background: #11141D;
  border-bottom: 3px solid #000;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0.65rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  user-select: none;
}

.nav-logo-badge {
  background: var(--f-red);
  color: #FFF;
  font-family: var(--font-comic);
  font-size: 0.95rem;
  padding: 0.15rem 0.5rem;
  border: 2px solid #000;
  box-shadow: 2px 2px 0 #000;
  transform: rotate(-3deg);
}

.nav-logo-title {
  font-family: var(--font-comic);
  font-size: 1.65rem;
  color: #FFF;
  letter-spacing: 0.04em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 860px) {
  .nav-links {
    display: none;
  }
}

.nav-link {
  font-family: var(--font-comic);
  font-size: 1.1rem;
  color: #B0B8C8;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  border: 2px solid transparent;
  transition: all 120ms ease;
}

.nav-link:hover {
  color: #FFF;
  background: rgba(255, 255, 255, 0.08);
}

.nav-link.active {
  color: #111;
  background: var(--f-yellow);
  border-color: #000;
  box-shadow: 2px 2px 0 #000;
}

.nav-user-controls {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.streak-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #1C2337;
  color: #FFF;
  font-family: var(--font-comic);
  font-size: 1.05rem;
  padding: 0.25rem 0.65rem;
  border: 2px solid #000;
  border-radius: 4px;
  box-shadow: 2px 2px 0 #000;
}

.level-badge {
  background: var(--f-purple);
  color: #FFF;
  font-family: var(--font-comic);
  font-size: 0.95rem;
  padding: 0.25rem 0.55rem;
  border: 2px solid #000;
  border-radius: 4px;
  box-shadow: 2px 2px 0 #000;
}

.user-avatar-btn {
  width: 36px;
  height: 36px;
  background: var(--f-yellow);
  border: 2px solid #000;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  box-shadow: 2px 2px 0 #000;
  cursor: pointer;
  transition: transform 100ms;
}

.user-avatar-btn:hover {
  transform: translate(-1px, -1px);
}
</style>
