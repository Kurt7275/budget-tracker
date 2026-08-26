<template>
  <div class="stats-page">
    <Navbar />

    <main class="stats-main">
      <section class="stats-header">
        <div class="comic-badge-yellow" style="margin-bottom: 0.35rem;">ANALYTICS &amp; ACTIVITY</div>
        <h1 class="stats-title">READING STATS &amp; HEATMAP</h1>
        <p class="stats-sub">Track your daily reading volume, streak endurance, and library breakdown.</p>
      </section>

      <!-- Top Summary Metrics Cards -->
      <div class="stats-summary-grid">
        <div class="stat-summary-card">
          <div class="stat-card-icon">📚</div>
          <div>
            <div class="stat-big-num">{{ totalTitles }}</div>
            <div class="stat-label-txt">Titles On Shelf</div>
          </div>
        </div>

        <div class="stat-summary-card">
          <div class="stat-card-icon">⚡</div>
          <div>
            <div class="stat-big-num">{{ totalChaptersRead }}</div>
            <div class="stat-label-txt">Chapters Read</div>
          </div>
        </div>

        <div class="stat-summary-card">
          <div class="stat-card-icon">🔥</div>
          <div>
            <div class="stat-big-num">{{ comicStore.user.streakDays }} Days</div>
            <div class="stat-label-txt">Current Reading Streak</div>
          </div>
        </div>

        <div class="stat-summary-card">
          <div class="stat-card-icon">🏆</div>
          <div>
            <div class="stat-big-num">{{ comicStore.user.xp }} XP</div>
            <div class="stat-label-txt">Level {{ comicStore.user.level }} Reader</div>
          </div>
        </div>
      </div>

      <!-- Annual Activity Heatmap Container -->
      <div class="heatmap-section-card">
        <div class="heatmap-header-row">
          <h3 style="font-family: var(--font-comic); font-size: 1.6rem;">ANNUAL READING HEATMAP (2026)</h3>
          <span style="font-family: var(--font-body); font-weight: 700; font-size: 0.85rem; color: #555;">
            {{ totalChaptersRead }} chapters logged this year
          </span>
        </div>

        <!-- Heatmap Grid -->
        <div class="heatmap-calendar-grid">
          <div
            v-for="(day, idx) in heatmapDays"
            :key="idx"
            class="heatmap-cell"
            :class="'level-' + day.level"
            :title="day.date + ': ' + day.count + ' chapters'"
          ></div>
        </div>

        <div class="heatmap-legend">
          <span>Less</span>
          <span class="legend-box level-0"></span>
          <span class="legend-box level-1"></span>
          <span class="legend-box level-2"></span>
          <span class="legend-box level-3"></span>
          <span class="legend-box level-4"></span>
          <span>More chapters</span>
        </div>
      </div>

      <!-- Library Format Breakdown -->
      <div class="format-breakdown-card">
        <h3 style="font-family: var(--font-comic); font-size: 1.6rem; margin-bottom: 1rem;">FORMAT BREAKDOWN</h3>
        <div class="breakdown-bars-stack">
          <div v-for="(cnt, fmt) in formatCounts" :key="fmt" class="breakdown-bar-item">
            <div class="breakdown-label-row">
              <span style="font-family: var(--font-comic); font-size: 1.1rem;">{{ fmt }}</span>
              <span style="font-weight: 700;">{{ cnt }} titles ({{ Math.round((cnt / totalTitles) * 100) || 0 }}%)</span>
            </div>
            <div class="ch-bar-track">
              <div class="ch-bar-fill" :style="{ width: ((cnt / totalTitles) * 100) + '%', background: getFormatColor(fmt) }"></div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import { comicStore } from '../stores/useComicStore.js'

const totalTitles = computed(() => comicStore.entries.length)
const totalChaptersRead = computed(() => {
  return comicStore.entries.reduce((acc, curr) => acc + (curr.chapter || 0), 0)
})

const formatCounts = computed(() => {
  const map = { Manga: 0, Comic: 0, Manhwa: 0, Webtoon: 0 }
  comicStore.entries.forEach(e => {
    map[e.type] = (map[e.type] || 0) + 1
  })
  return map
})

function getFormatColor(fmt) {
  switch (fmt) {
    case 'Manga': return '#FF1744'
    case 'Manhwa': return '#AA00FF'
    case 'Comic': return '#2979FF'
    case 'Webtoon': return '#00C853'
    default: return '#FFD600'
  }
}

// Generate realistic mock heatmap dots
const heatmapDays = computed(() => {
  const days = []
  for (let i = 0; i < 160; i++) {
    const r = Math.random()
    const level = r > 0.75 ? 4 : r > 0.5 ? 3 : r > 0.25 ? 2 : r > 0.1 ? 1 : 0
    days.push({
      date: `2026-08-${(i % 30) + 1}`,
      count: level * 3,
      level
    })
  }
  return days
})
</script>

<style scoped>
.stats-page {
  min-height: 100vh;
  background-color: var(--f-bg);
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
  display: flex;
  flex-direction: column;
}

.stats-main {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-title {
  font-family: var(--font-comic);
  font-size: 2.8rem;
  line-height: 1;
  color: var(--f-text);
  letter-spacing: 0.04em;
}

.stats-sub {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: #666;
  margin-top: 0.25rem;
}

.stats-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}

.stat-summary-card {
  background: #FFF;
  border: 3px solid #111;
  border-radius: 6px;
  padding: 1.25rem;
  box-shadow: 4px 4px 0 #111;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  background: var(--f-bg);
  border: 2px solid #111;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-big-num {
  font-family: var(--font-comic);
  font-size: 2rem;
  line-height: 1;
  color: #111;
}

.stat-label-txt {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  color: #666;
  margin-top: 0.2rem;
}

.heatmap-section-card {
  background: #FFF;
  border: 3px solid #111;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 6px 6px 0 #111;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.heatmap-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #EEE;
  padding-bottom: 0.75rem;
}

.heatmap-calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14px, 1fr));
  gap: 6px;
  padding: 0.5rem 0;
}

.heatmap-cell {
  height: 14px;
  border: 1px solid #111;
  border-radius: 2px;
  cursor: pointer;
}

.heatmap-cell.level-0 { background: #EEE; }
.heatmap-cell.level-1 { background: #C8E6C9; }
.heatmap-cell.level-2 { background: #81C784; }
.heatmap-cell.level-3 { background: #4CAF50; }
.heatmap-cell.level-4 { background: #1B5E20; }

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 700;
  justify-content: flex-end;
}

.legend-box {
  width: 12px;
  height: 12px;
  border: 1px solid #111;
}

.legend-box.level-0 { background: #EEE; }
.legend-box.level-1 { background: #C8E6C9; }
.legend-box.level-2 { background: #81C784; }
.legend-box.level-3 { background: #4CAF50; }
.legend-box.level-4 { background: #1B5E20; }

.format-breakdown-card {
  background: #FFF;
  border: 3px solid #111;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 6px 6px 0 #111;
}

.breakdown-bars-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.breakdown-label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  font-family: var(--font-body);
}
</style>
