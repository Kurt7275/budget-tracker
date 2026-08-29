<template>
  <div class="achievements-page">
    <Navbar />

    <main class="achievements-container fade-in-contents">

      <!-- ── 1. YOUR STREAK ── -->
      <section class="ach-section">
        <div class="ach-section-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
          <h2>YOUR STREAK</h2>
        </div>

        <div class="ach-card card-white-brown-shadow">
          <div class="streak-body">
            <div class="streak-flame-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
              </svg>
            </div>
            <div class="streak-info">
              <div class="streak-number">
                <span>{{ comicStore.user?.streak || 1 }}</span>
                <span class="streak-unit">DAYS</span>
              </div>
              <div class="streak-sub">Last activity: Today</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 2. ACHIEVEMENT PROGRESS ── -->
      <section class="ach-section">
        <div class="ach-section-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="7"/>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
          </svg>
          <h2>ACHIEVEMENT PROGRESS</h2>
        </div>

        <div class="ach-card card-white-brown-shadow">
          <div class="progress-header-row">
            <span class="progress-earned-txt">5 of 20 earned</span>
            <span class="progress-percent-txt">25%</span>
          </div>

          <div class="progress-bar-container">
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: 25%;"></div>
            </div>
            <div class="progress-ticks-row">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 3. CATEGORY BADGE CARDS ── -->

      <!-- SHELF Category -->
      <section class="ach-section">
        <div class="ach-category-title">SHELF</div>
        <div class="badge-card badge-red">
          <div class="badge-card-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </div>
          <div class="badge-card-content">
            <h3 class="badge-card-title">FIRST ISSUE</h3>
            <p class="badge-card-desc">Complete your first title</p>
            <div class="badge-card-pill">Today</div>
          </div>
        </div>
      </section>

      <!-- CHAPTERS Category -->
      <section class="ach-section">
        <div class="ach-category-title">CHAPTERS</div>
        <div class="badge-card badge-teal">
          <div class="badge-card-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div class="badge-card-content">
            <h3 class="badge-card-title">PAGE TURNER</h3>
            <p class="badge-card-desc">Read 100 chapters</p>
            <div class="badge-card-pill">Today</div>
          </div>
        </div>
      </section>

      <!-- EXPLORER Category -->
      <section class="ach-section">
        <div class="ach-category-title">EXPLORER</div>
        <div class="badge-card badge-red">
          <div class="badge-card-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <div class="badge-card-content">
            <h3 class="badge-card-title">MANGA FAN</h3>
            <p class="badge-card-desc">Add a manga to your shelf</p>
            <div class="badge-card-pill">Today</div>
          </div>
        </div>
      </section>

      <!-- RATINGS Category -->
      <section class="ach-section">
        <div class="ach-category-title">RATINGS</div>
        <div class="badge-card badge-yellow">
          <div class="badge-card-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div class="badge-card-content">
            <h3 class="badge-card-title">HARSH CRITIC</h3>
            <p class="badge-card-desc">Give a rating 1-10 to any title</p>
            <div class="badge-card-pill">Today</div>
          </div>
        </div>
      </section>

      <!-- GOALS Category -->
      <section class="ach-section">
        <div class="ach-category-title">GOALS</div>
        <div class="badge-card badge-green">
          <div class="badge-card-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <div class="badge-card-content">
            <h3 class="badge-card-title">GOAL SETTER</h3>
            <p class="badge-card-desc">Create a reading goal</p>
            <div class="badge-card-pill">Today</div>
          </div>
        </div>
      </section>

      <!-- ── 4. MORE TO DISCOVER ── -->
      <section class="ach-section">
        <div class="ach-section-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <h2>MORE TO DISCOVER</h2>
        </div>

        <div class="ach-card card-white-brown-shadow discover-card">
          <div class="discover-center-box">
            <svg class="discover-lock-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <h3 class="discover-title">17 HIDDEN BADGES</h3>
            <p class="discover-sub">Keep reading and watching to unlock new achievements!</p>
          </div>

          <div class="locked-badges-grid">
            <div class="locked-badge-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span class="locked-txt">Locked</span>
            </div>
            <div class="locked-badge-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span class="locked-txt">Locked</span>
            </div>
            <div class="locked-badge-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span class="locked-txt">Locked</span>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import { comicStore } from '../stores/useComicStore.js'
import '../assets/auth.css'
</script>

<style scoped>
.achievements-page {
  min-height: 100vh;
  background-color: var(--f-bg);
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
  display: flex;
  flex-direction: column;
}

.achievements-container {
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Section Header */
.ach-section {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.ach-section-header {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: #111111;
}

.ach-section-header h2 {
  font-family: var(--font-comic);
  font-size: 1.15rem;
  letter-spacing: 0.05em;
  color: #111111;
  text-transform: uppercase;
}

.ach-category-title {
  font-family: var(--font-comic);
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  color: #111111;
  text-transform: uppercase;
}

/* White Card with Brown Shadow */
.ach-card {
  background: #FAF6EE;
  border: 3px solid #111111;
  border-radius: 4px;
  padding: 1.15rem 1.35rem;
}

.card-white-brown-shadow {
  box-shadow: 6px 6px 0px var(--theme-shadow);
}

/* Streak Card Body */
.streak-body {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.streak-flame-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F97316;
  flex-shrink: 0;
}

.streak-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.streak-number {
  font-family: var(--font-comic);
  font-size: 2.4rem;
  line-height: 1;
  color: #111111;
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

.streak-unit {
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  color: #555555;
}

.streak-sub {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 700;
  color: #777777;
}

/* Progress Section */
.progress-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.progress-earned-txt {
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 700;
  color: #444444;
}

.progress-percent-txt {
  font-family: var(--font-comic);
  font-size: 1.3rem;
  color: #111111;
}

.progress-bar-container {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.progress-bar-track {
  height: 14px;
  background: #FFFFFF;
  border: 2px solid #111111;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #FF9100;
}

.progress-ticks-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: 700;
  color: #888888;
}

/* Category Badge Cards with Status Color-Coded Shadows */
.badge-card {
  border: 3px solid #111111;
  border-radius: 4px;
  padding: 1.35rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.45rem;
  max-width: 220px;
}

/* Red Badge Card (SHELF / EXPLORER) */
.badge-red {
  background: #EE3545;
  color: #FFFFFF;
  box-shadow: 6px 6px 0px #9B1C28;
}

/* Teal Badge Card (CHAPTERS) */
.badge-teal {
  background: #00838F;
  color: #FFFFFF;
  box-shadow: 6px 6px 0px #004D40;
}

/* Yellow Badge Card (RATINGS) */
.badge-yellow {
  background: #F5D13B;
  color: #111111;
  box-shadow: 6px 6px 0px #B36B0C;
}

/* Green Badge Card (GOALS) */
.badge-green {
  background: #00C853;
  color: #FFFFFF;
  box-shadow: 6px 6px 0px #1B6B2A;
}

.badge-card-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.1rem;
}

.badge-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.badge-card-title {
  font-family: var(--font-comic);
  font-size: 1.15rem;
  letter-spacing: 0.05em;
  line-height: 1.1;
}

.badge-card-desc {
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 700;
  opacity: 0.9;
  line-height: 1.25;
}

.badge-card-pill {
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 700;
  opacity: 0.75;
  margin-top: 0.35rem;
}

/* Discover Card */
.discover-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.75rem 1.25rem;
  text-align: center;
}

.discover-center-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.discover-lock-icon {
  color: #111111;
  margin-bottom: 0.2rem;
}

.discover-title {
  font-family: var(--font-comic);
  font-size: 1.35rem;
  letter-spacing: 0.05em;
  color: #111111;
}

.discover-sub {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  color: #666666;
}

.locked-badges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.1rem;
  width: 100%;
  max-width: 620px;
}

@media (max-width: 600px) {
  .locked-badges-grid {
    grid-template-columns: 1fr;
  }
}

.locked-badge-box {
  background: #FAF6EE;
  border: 2.5px dashed #AAAAAA;
  border-radius: 4px;
  padding: 1.1rem 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  box-shadow: 4px 4px 0px var(--theme-shadow);
}

.locked-txt {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 700;
  color: #888888;
}
</style>
