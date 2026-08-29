<template>
  <div class="stats-page">
    <Navbar />

    <main class="stats-main fade-in-contents">

      <!-- ── SHELF / WATCHLIST SUB-TABS ── -->
      <div class="stats-subtabs-row">
        <button
          type="button"
          class="stats-subtab-btn"
          :class="activeTab === 'SHELF' ? 'subtab-active' : 'subtab-inactive'"
          @click="activeTab = 'SHELF'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="6" y1="4" x2="6" y2="20"/>
            <line x1="10" y1="4" x2="10" y2="20"/>
            <line x1="14" y1="4" x2="18" y2="20"/>
          </svg>
          <span>SHELF</span>
        </button>

        <button
          type="button"
          class="stats-subtab-btn"
          :class="activeTab === 'WATCHLIST' ? 'subtab-active' : 'subtab-inactive'"
          @click="activeTab = 'WATCHLIST'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M2 8h20"/>
            <path d="M6 4l2 4"/>
            <path d="M12 4l2 4"/>
            <path d="M18 4l2 4"/>
          </svg>
          <span>WATCHLIST</span>
        </button>
      </div>

      <!-- ── YOUR SHELF AT A GLANCE ── -->
      <div class="stats-section-label">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        YOUR {{ activeTab }} AT A GLANCE
        <span class="section-dashed-line"></span>
      </div>
      <div class="glance-cards-row">
        <div class="glance-card glance-yellow">
          <div class="glance-label">TOTAL TITLES</div>
          <div class="glance-num glance-num-dark">{{ totalTitles }}</div>
          <div class="glance-sub glance-sub-dark">{{ completionRate }}% completion rate</div>
        </div>
        <div class="glance-card glance-violet">
          <div class="glance-label glance-label-light">COMPLETED</div>
          <div class="glance-num glance-num-light">{{ completedCount }}</div>
          <div class="glance-sub glance-sub-light">titles finished</div>
        </div>
        <div class="glance-card glance-red">
          <div class="glance-label glance-label-light">CHAPTERS READ</div>
          <div class="glance-num glance-num-light">{{ totalChaptersRead }}</div>
          <div class="glance-sub glance-sub-light">avg {{ avgChaptersPerTitle }} per title</div>
        </div>
        <div class="glance-card glance-green">
          <div class="glance-label">AVG RATING</div>
          <div class="glance-num glance-num-dark">{{ avgRating }}<span class="glance-star">★</span></div>
          <div class="glance-sub glance-sub-dark">across rated titles</div>
        </div>
        <div class="glance-card glance-lavender">
          <div class="glance-label glance-label-purple">FAVORITE TYPE</div>
          <div class="glance-num glance-type-txt">{{ favouriteType }}</div>
          <div class="glance-sub glance-sub-purple">most titles</div>
        </div>
      </div>

      <!-- ── READING ACTIVITY ── -->
      <div class="stats-section-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        READING ACTIVITY
      </div>
      <div class="stats-card">
        <div class="activity-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          <span>CHAPTERS READ — LAST 12 MONTHS</span>
        </div>
        <div class="activity-chart-wrap">
          <svg class="activity-svg" viewBox="0 0 520 80" preserveAspectRatio="none">
            <g v-for="(bar, i) in activityBars" :key="i">
              <rect
                :x="i * 44 + 2"
                :y="80 - bar.h"
                width="36"
                :height="bar.h"
                :fill="bar.h > 0 ? '#EE3545' : '#EEE'"
                rx="2"
              />
            </g>
          </svg>
          <div class="activity-months-row">
            <span v-for="m in months" :key="m">{{ m }}</span>
          </div>
        </div>
      </div>

      <!-- ── BREAKDOWN ── -->
      <div class="stats-section-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        BREAKDOWN
      </div>
      <div class="breakdown-two-col">
        <!-- By Type -->
        <div class="stats-card breakdown-card">
          <div class="breakdown-inner-title">BY TYPE</div>
          <div class="donut-layout">
            <div class="donut-svg-wrap">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#EEE" stroke-width="14"/>
                <circle
                  v-for="(seg, i) in typeDonutSegments"
                  :key="i"
                  cx="50" cy="50" r="38"
                  fill="none"
                  :stroke="seg.color"
                  stroke-width="14"
                  :stroke-dasharray="`${seg.dash} ${seg.gap}`"
                  :stroke-dashoffset="seg.offset"
                  stroke-linecap="butt"
                  style="transform: rotate(-90deg); transform-origin: 50px 50px;"
                />
                <text x="50" y="46" text-anchor="middle" font-family="Bangers, cursive" font-size="18" fill="#111">{{ totalTitles }}</text>
                <text x="50" y="60" text-anchor="middle" font-family="Comic Neue, cursive" font-size="8" font-weight="700" fill="#777">TITLES</text>
              </svg>
            </div>
            <div class="donut-legend">
              <div v-for="(seg, i) in typeDonutSegments" :key="i" class="legend-row">
                <span class="legend-dot" :style="{ background: seg.color }"></span>
                <span class="legend-lbl">{{ seg.label }}</span>
                <span class="legend-val">{{ seg.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- By Status -->
        <div class="stats-card breakdown-card">
          <div class="breakdown-inner-title">BY STATUS</div>
          <div class="donut-layout">
            <div class="donut-svg-wrap">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#EEE" stroke-width="14"/>
                <circle
                  v-for="(seg, i) in statusDonutSegments"
                  :key="i"
                  cx="50" cy="50" r="38"
                  fill="none"
                  :stroke="seg.color"
                  stroke-width="14"
                  :stroke-dasharray="`${seg.dash} ${seg.gap}`"
                  :stroke-dashoffset="seg.offset"
                  stroke-linecap="butt"
                  style="transform: rotate(-90deg); transform-origin: 50px 50px;"
                />
                <text x="50" y="46" text-anchor="middle" font-family="Bangers, cursive" font-size="18" fill="#111">{{ totalTitles }}</text>
                <text x="50" y="60" text-anchor="middle" font-family="Comic Neue, cursive" font-size="8" font-weight="700" fill="#777">TITLES</text>
              </svg>
            </div>
            <div class="donut-legend">
              <div v-for="(seg, i) in statusDonutSegments" :key="i" class="legend-row">
                <span class="legend-dot" :style="{ background: seg.color }"></span>
                <span class="legend-lbl">{{ seg.label }}</span>
                <span class="legend-val">{{ seg.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── FORMAT BREAKDOWN ── -->
      <div class="stats-section-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        FORMAT BREAKDOWN
      </div>
      <div class="stats-card">
        <div v-for="(cnt, fmt) in formatCountsFiltered" :key="fmt" class="fmt-bar-row">
          <span class="fmt-label">{{ fmt }}</span>
          <div class="fmt-bar-track">
            <div class="fmt-bar-fill" :style="{ width: totalTitles ? ((cnt / totalTitles) * 100) + '%' : '0%', background: getFormatColor(fmt) }"></div>
          </div>
          <span class="fmt-count">{{ cnt }}</span>
        </div>
      </div>

      <!-- ── HALL OF FAME / STATUS SNAPSHOT ── -->
      <div class="stats-section-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        HALL OF FAME
      </div>
      <div class="stats-card">
        <div class="hof-section-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          STATUS SNAPSHOT
        </div>
        <div v-for="(cnt, status) in statusCounts" :key="status" class="hof-row">
          <span class="hof-dot" :style="{ background: getStatusColor(status) }"></span>
          <span class="hof-lbl">{{ status }}</span>
          <span class="hof-val">{{ cnt }}</span>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import { comicStore } from '../stores/useComicStore.js'

const activeTab = ref('SHELF')

const CIRC = 2 * Math.PI * 38 // ≈ 238.76

const totalTitles = computed(() => comicStore.entries.length)

const totalChaptersRead = computed(() =>
  comicStore.entries.reduce((acc, e) => acc + (e.chapter || 0), 0)
)

const completedCount = computed(() =>
  comicStore.entries.filter(e => e.status === 'Completed').length
)

const completionRate = computed(() =>
  totalTitles.value ? Math.round((completedCount.value / totalTitles.value) * 100) : 0
)

const avgChaptersPerTitle = computed(() =>
  totalTitles.value ? Math.round(totalChaptersRead.value / totalTitles.value) : 0
)

const ratedCount = computed(() =>
  comicStore.entries.filter(e => e.rating).length
)

const avgRating = computed(() => {
  const rated = comicStore.entries.filter(e => e.rating)
  if (!rated.length) return '—'
  return (rated.reduce((a, e) => a + Number(e.rating), 0) / rated.length).toFixed(1)
})

const favouriteType = computed(() => {
  const map = {}
  comicStore.entries.forEach(e => { map[e.type] = (map[e.type] || 0) + 1 })
  return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
})

// Format counts (only non-zero)
const formatCounts = computed(() => {
  const map = { Manga: 0, Comic: 0, Manhwa: 0, Webtoon: 0 }
  comicStore.entries.forEach(e => { map[e.type] = (map[e.type] || 0) + 1 })
  return map
})

const formatCountsFiltered = computed(() => {
  const obj = {}
  Object.entries(formatCounts.value).forEach(([k, v]) => { if (v > 0) obj[k] = v })
  return obj
})

// Status counts
const statusCounts = computed(() => {
  const map = { Reading: 0, Completed: 0, 'Plan to Read': 0, 'On Hold': 0, Dropped: 0 }
  comicStore.entries.forEach(e => { if (map[e.status] !== undefined) map[e.status]++ })
  return map
})

function getStatusColor(s) {
  switch (s) {
    case 'Reading': return '#44C555'
    case 'Completed': return '#9B4BEB'
    case 'Plan to Read': return '#2B77F6'
    case 'On Hold': return '#EBA23B'
    case 'Dropped': return '#EE3545'
    default: return '#999'
  }
}

function getFormatColor(fmt) {
  switch (fmt) {
    case 'Manga': return '#EE3545'
    case 'Manhwa': return '#9B4BEB'
    case 'Comic': return '#2B77F6'
    case 'Webtoon': return '#44C555'
    default: return '#FFD600'
  }
}

// Donut segments helper
function buildSegments(items) {
  const total = items.reduce((s, i) => s + i.count, 0) || 1
  let offset = 0
  return items.map(item => {
    const dash = (item.count / total) * CIRC
    const seg = { ...item, dash, gap: CIRC - dash, offset: -offset }
    offset += dash
    return seg
  })
}

const typeDonutSegments = computed(() => buildSegments(
  Object.entries(formatCounts.value)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ label: k, count: v, color: getFormatColor(k) }))
))

const statusDonutSegments = computed(() => buildSegments(
  Object.entries(statusCounts.value)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ label: k, count: v, color: getStatusColor(k) }))
))

// Activity bar chart — 12 months mock data weighted by actual chapters
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const activityBars = computed(() => {
  const base = [12, 18, 8, 25, 15, 30, 22, totalChaptersRead.value, 20, 10, 5, 3]
  const max = Math.max(...base, 1)
  return base.map(v => ({ h: Math.round((v / max) * 72) }))
})
</script>

<style scoped>
.stats-page {
  min-height: 100vh;
  background-color: var(--f-bg);
  background-image: radial-gradient(circle, rgba(0,0,0,0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
  display: flex;
  flex-direction: column;
}

.stats-main {
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

/* ── Sub-Tabs Row (SHELF / WATCHLIST) ── */
.stats-subtabs-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-top: 0.5rem;
}

.stats-subtab-btn {
  font-family: var(--font-comic);
  font-size: 1.15rem;
  font-style: italic;
  letter-spacing: 0.05em;
  padding: 0.42rem 1.3rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.15s ease;
}

.subtab-active {
  background: #EE3545;
  color: #FFFFFF;
  border: 2.5px solid #111111;
  box-shadow: 4px 4px 0 var(--theme-shadow);
}

.subtab-active:hover {
  transform: translateY(-1px);
  box-shadow: 5px 5px 0 var(--theme-shadow);
}

.subtab-inactive {
  background: #FFFDF5;
  color: #111111;
  border: 2.5px solid #111111;
  box-shadow: none;
}

.subtab-inactive:hover {
  background: #F5F0E1;
}

/* Section label */
.stats-section-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-comic);

  font-size: 0.9rem;
  letter-spacing: 0.08em;
  color: #666;
  margin-top: 0.5rem;
}

.section-dashed-line {
  flex: 1;
  height: 1.5px;
  background: repeating-linear-gradient(to right, #bbb 0px, #bbb 6px, transparent 6px, transparent 12px);
  margin-left: 0.25rem;
}

/* Shared white card */
.stats-card {
  background: #FFF;
  border: 2.5px solid #111;
  border-radius: 4px;
  box-shadow: 5px 5px 0 var(--theme-shadow);
  padding: 1.25rem 1.5rem;
}

/* ── Glance Cards ── */
.glance-cards-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

@media (max-width: 860px) {
  .glance-cards-row { grid-template-columns: repeat(3, 1fr); }
}

.glance-card {
  border: 2.5px solid #111;
  border-radius: 4px;
  box-shadow: 5px 5px 0 var(--theme-shadow);
  padding: 0.9rem 0.85rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-height: 100px;
  transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 180ms ease;
}

.glance-yellow  { background: #F5C800; }
.glance-violet  { background: #6B21A8; }
.glance-red     { background: #EE3545; }
.glance-green   { background: #22C55E; }
.glance-lavender { background: #EBE5FF; }

/* Slight tilt per card — matching reference */
.glance-cards-row > .glance-card:nth-child(1) { transform: rotate(-1.5deg); }
.glance-cards-row > .glance-card:nth-child(2) { transform: rotate(1.2deg); }
.glance-cards-row > .glance-card:nth-child(3) { transform: rotate(2deg); }
.glance-cards-row > .glance-card:nth-child(4) { transform: rotate(-1deg); }
.glance-cards-row > .glance-card:nth-child(5) { transform: rotate(1.8deg); }

/* Clever straightening hover effect: snaps box straight to 0deg when hovered! */
.glance-cards-row > .glance-card:hover {
  transform: rotate(0deg) translateY(-5px) scale(1.025) !important;
  box-shadow: 7px 7px 0 var(--theme-shadow) !important;
  z-index: 10;
}

/* Label */
.glance-label {
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: 800;

  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(0,0,0,0.5);
}
.glance-label-light {
  color: rgba(255,255,255,0.65);
}
.glance-label-purple {
  color: #7C3AED;
}

/* Number */
.glance-num {
  font-family: var(--font-comic);
  font-size: 3rem;
  line-height: 1;
  letter-spacing: 0.01em;
  margin: 0.1rem 0;
}
.glance-num-dark  { color: #111; }
.glance-num-light { color: #FFF; }

/* The MANGA type text */
.glance-type-txt {
  font-size: 2.6rem;
  color: #6D28D9;
  -webkit-text-stroke: 0px;
  line-height: 1;

}

.glance-star {
  font-size: 2.2rem;
}

/* Sub text */
.glance-sub {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 700;

  margin-top: auto;
  padding-top: 0.35rem;
}
.glance-sub-dark  { color: rgba(0,0,0,0.55); }
.glance-sub-light { color: rgba(255,255,255,0.7); }
.glance-sub-purple { color: #8B5CF6; }

/* ── Activity Chart ── */
.activity-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-comic);
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.75rem;
  border-bottom: 1.5px solid #EEE;
  padding-bottom: 0.6rem;
}

.activity-chart-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.activity-svg {
  width: 100%;
  height: 80px;
}

.activity-months-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 700;
  color: #999;
  padding: 0 2px;
}

/* ── Breakdown ── */
.breakdown-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.breakdown-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.breakdown-inner-title {
  font-family: var(--font-comic);
  font-size: 1.1rem;
  color: #111;
  border-bottom: 1.5px solid #EEE;
  padding-bottom: 0.45rem;
}

.donut-layout {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.donut-svg-wrap {
  flex-shrink: 0;
}

.donut-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 700;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
  border: 1.5px solid rgba(0,0,0,0.2);
}

.legend-lbl {
  flex: 1;
  color: #444;
}

.legend-val {
  color: #111;
  font-weight: 800;
}

/* ── Format Breakdown ── */
.fmt-bar-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 0.7rem;
}

.fmt-label {
  font-family: var(--font-comic);
  font-size: 1rem;
  min-width: 72px;
  color: #111;
}

.fmt-bar-track {
  flex: 1;
  height: 18px;
  background: #EEE;
  border: 1.5px solid #111;
  border-radius: 3px;
  overflow: hidden;
}

.fmt-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.fmt-count {
  font-family: var(--font-comic);
  font-size: 1rem;
  min-width: 20px;
  text-align: right;
  color: #111;
}

/* ── Hall of Fame ── */
.hof-section-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-comic);
  font-size: 1rem;
  color: #555;
  border-bottom: 1.5px solid #EEE;
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
}

.hof-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid #F3F3F3;
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 700;
  color: #333;
}

.hof-dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
  border: 1.5px solid rgba(0,0,0,0.15);
}

.hof-lbl { flex: 1; }

.hof-val {
  font-family: var(--font-comic);
  font-size: 1.1rem;
  color: #111;
}
</style>
