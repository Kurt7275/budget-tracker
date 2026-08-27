<template>
  <div class="cs-disc-page">
    <Navbar />

    <main class="cs-disc-main">

      <!-- Header Section -->
      <section class="cs-disc-header-box">
        <h1 class="cs-disc-main-title">DISCOVER</h1>
        <p class="cs-disc-subtitle">Find readers by username</p>
      </section>

      <!-- Search Bar Row -->
      <div class="cs-disc-search-row">
        <div class="cs-disc-search-input-box">
          <svg class="cs-disc-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#777777" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="cs-disc-input"
            placeholder="@username"
            @keyup.enter="handleSearch"
          />
        </div>
        <button type="button" class="cs-disc-search-btn" @click="handleSearch">
          SEARCH
        </button>
      </div>

      <!-- Recommended For You Title -->
      <div class="cs-disc-section-label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
        </svg>
        <span>RECOMMENDED FOR YOU</span>
      </div>

      <!-- User List Grid / Stack -->
      <div class="cs-disc-users-stack pop-up-contents">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="cs-disc-user-card"
          @click="openProfileModal(user)"
        >
          <!-- Left: Avatar & User Info -->
          <div class="cs-disc-user-info">
            <div class="cs-disc-avatar-box" :style="{ backgroundColor: user.avatarBg }">
              <img v-if="user.avatarImg" :src="user.avatarImg" :alt="user.name" class="cs-disc-avatar-img" />
              <span v-else class="cs-disc-avatar-initial">{{ user.initial }}</span>
            </div>

            <div class="cs-disc-user-text">
              <h3 class="cs-disc-user-name">{{ user.name }}</h3>
              <span class="cs-disc-username">{{ user.handle }}</span>
              <span class="cs-disc-followers">{{ user.followers }} followers</span>
            </div>
          </div>

          <!-- Right: Follow Button -->
          <button
            type="button"
            class="cs-disc-follow-btn"
            :class="{ following: user.isFollowing }"
            @click.stop="toggleFollow(user)"
          >
            <template v-if="!user.isFollowing">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="17" y1="11" x2="23" y2="11"/>
              </svg>
              <span>FOLLOW</span>
            </template>
            <template v-else>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>FOLLOWING</span>
            </template>
          </button>
        </div>

        <div v-if="filteredUsers.length === 0" class="cs-disc-empty">
          NO READERS FOUND MATCHING "{{ searchQuery }}"
        </div>
      </div>

    </main>

    <!-- ── Profile Preview Modal (Matching Attached Images) ── -->
    <div v-if="selectedUser" class="f-modal-overlay" @click.self="closeProfileModal">
      <div class="cs-user-modal-card">

        <!-- Top Bar with User Title & Close Button -->
        <div class="cs-user-modal-header">
          <h2 class="cs-user-modal-title">{{ selectedUser.name }}</h2>
          <button type="button" class="cs-user-modal-close" @click="closeProfileModal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Modal Body Content -->
        <div class="cs-user-modal-body">

          <!-- Centered Large Avatar -->
          <div class="cs-user-avatar-center">
            <div class="cs-user-avatar-circle" :style="{ backgroundColor: selectedUser.avatarBg }">
              <img v-if="selectedUser.avatarImg" :src="selectedUser.avatarImg" :alt="selectedUser.name" class="cs-user-avatar-img" />
              <svg v-else width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#777777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2 class="cs-user-modal-name">{{ selectedUser.name }}</h2>
            <span class="cs-user-modal-handle">{{ selectedUser.handle }}</span>
          </div>

          <!-- 6 Stat Counter Grid -->
          <div class="cs-user-stats-grid">
            <div class="cs-user-stat-card">
              <span class="cs-user-stat-num">{{ selectedUser.comicsCount }}</span>
              <span class="cs-user-stat-label">COMICS</span>
            </div>
            <div class="cs-user-stat-card active-manga">
              <span class="cs-user-stat-num">{{ selectedUser.mangaCount }}</span>
              <span class="cs-user-stat-label">MANGA</span>
            </div>
            <div class="cs-user-stat-card">
              <span class="cs-user-stat-num">{{ selectedUser.booksCount }}</span>
              <span class="cs-user-stat-label">BOOKS</span>
            </div>
            <div class="cs-user-stat-card">
              <span class="cs-user-stat-num">{{ selectedUser.watchlistCount }}</span>
              <span class="cs-user-stat-label">WATCHLIST</span>
            </div>
            <div class="cs-user-stat-card">
              <span class="cs-user-stat-num">{{ selectedUser.followers }}</span>
              <span class="cs-user-stat-label">FOLLOWERS</span>
            </div>
            <div class="cs-user-stat-card">
              <span class="cs-user-stat-num">{{ selectedUser.following }}</span>
              <span class="cs-user-stat-label">FOLLOWING</span>
            </div>
          </div>

          <!-- Solid Action Button (Red Follow / Green Following) -->
          <button
            type="button"
            class="cs-user-action-btn"
            :class="{ following: selectedUser.isFollowing }"
            @click="toggleFollow(selectedUser)"
          >
            <template v-if="!selectedUser.isFollowing">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="17" y1="11" x2="23" y2="11"/>
              </svg>
              <span>FOLLOW</span>
            </template>
            <template v-else>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>FOLLOWING</span>
            </template>
          </button>

          <!-- Achievements Section -->
          <div class="cs-user-section-wrap">
            <div class="cs-user-section-header">
              <div class="cs-user-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF1744" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
                </svg>
                <span>ACHIEVEMENTS</span>
              </div>
              <span class="cs-user-section-count">{{ selectedUser.achievements.length }}</span>
            </div>

            <!-- Achievement Pills Wrap -->
            <div class="cs-user-achieve-chips">
              <div
                v-for="(ach, idx) in selectedUser.achievements"
                :key="idx"
                class="cs-user-ach-chip"
                :style="{ backgroundColor: ach.color }"
                :title="ach.name"
              >
                <!-- SVG Icon according to achievement type -->
                <svg v-if="ach.icon === 'book'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                <svg v-else-if="ach.icon === 'target'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
                <svg v-else-if="ach.icon === 'edit'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 3l-4 4-4-4"/>
                </svg>
                <span>{{ ach.name }}</span>
              </div>
            </div>
          </div>

          <!-- Latest Additions Section -->
          <div class="cs-user-section-wrap" style="margin-top: 0.5rem;">
            <div class="cs-user-section-header">
              <div class="cs-user-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF1744" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <span>LATEST ADDITIONS</span>
              </div>
              <span class="cs-user-section-count">{{ selectedUser.latestAdditions.length }}</span>
            </div>

            <!-- Latest Additions 2-Column Grid -->
            <div class="cs-user-additions-grid">
              <div
                v-for="(item, idx) in selectedUser.latestAdditions"
                :key="idx"
                class="cs-user-add-card"
              >
                <div class="cs-user-add-cover-box">
                  <img :src="item.cover" :alt="item.title" class="cs-user-add-cover-img" />
                </div>
                <div class="cs-user-add-info">
                  <h4 class="cs-user-add-title">{{ item.title }}</h4>
                  <span class="cs-user-add-sub">{{ item.type }} · {{ item.chapter }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Navbar from '../components/Navbar.vue'

const searchQuery = ref('')
const selectedUser = ref(null)

const USERS = ref([
  {
    id: 1,
    name: 'SALANGI',
    handle: '@salangi1',
    followers: 4,
    following: 3,
    comicsCount: 12,
    mangaCount: 8,
    booksCount: 2,
    watchlistCount: 15,
    avatarBg: '#23272A',
    avatarImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    initial: 'S',
    isFollowing: false,
    achievements: [
      { name: 'Comic Collector', color: '#FFF59D', icon: 'target' },
      { name: 'Manga Fan', color: '#FFC1E3', icon: 'book' },
      { name: 'Harsh Critic', color: '#FFF59D', icon: 'edit' }
    ],
    latestAdditions: [
      {
        title: 'JUJUTSU KAISEN: MODERN ERA',
        type: 'Manga',
        chapter: 'Ch.271',
        cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80'
      },
      {
        title: 'BATMAN: THE LONG HALLOWEEN',
        type: 'Comic',
        chapter: 'Ch.13',
        cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 2,
    name: 'JENSSIE',
    handle: '@jena',
    followers: 2,
    following: 1,
    comicsCount: 1,
    mangaCount: 1,
    booksCount: 0,
    watchlistCount: 18,
    avatarBg: '#E91E63',
    avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    initial: 'J',
    isFollowing: false,
    achievements: [
      { name: 'Manga Fan', color: '#F8BBD0', icon: 'book' },
      { name: 'Comic Collector', color: '#FFF59D', icon: 'target' },
      { name: 'Harsh Critic', color: '#FFF59D', icon: 'edit' },
      { name: 'Binge Starter', color: '#F3E5F5', icon: 'box' }
    ],
    latestAdditions: [
      {
        title: 'THE AMAZING SPIDER-MAN: SPIDER-VERSITY',
        type: 'Comic',
        chapter: 'Ch.2',
        cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80'
      },
      {
        title: 'SPYXFAMILY: KAZOKU NO SHOUZOU',
        type: 'Manga',
        chapter: 'Ch.0',
        cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 3,
    name: 'TEST',
    handle: '@test',
    followers: 2,
    following: 5,
    comicsCount: 5,
    mangaCount: 10,
    booksCount: 1,
    watchlistCount: 4,
    avatarBg: '#E55A36',
    avatarImg: '',
    initial: 'H',
    isFollowing: false,
    achievements: [
      { name: 'Binge Starter', color: '#F3E5F5', icon: 'box' },
      { name: 'Manga Fan', color: '#F8BBD0', icon: 'book' }
    ],
    latestAdditions: [
      {
        title: 'SOLO LEVELING',
        type: 'Manhwa',
        chapter: 'Ch.179',
        cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 4,
    name: 'COMICVERSE',
    handle: '@aaa',
    followers: 2,
    following: 10,
    comicsCount: 45,
    mangaCount: 30,
    booksCount: 8,
    watchlistCount: 22,
    avatarBg: '#C0392B',
    avatarImg: '',
    initial: 'C',
    isFollowing: false,
    achievements: [
      { name: 'Comic Collector', color: '#FFF59D', icon: 'target' },
      { name: 'Harsh Critic', color: '#FFF59D', icon: 'edit' },
      { name: 'Manga Fan', color: '#F8BBD0', icon: 'book' }
    ],
    latestAdditions: [
      {
        title: 'INVINCIBLE: ULTIMATE COLLECTION',
        type: 'Comic',
        chapter: 'Ch.144',
        cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 5,
    name: 'KYEBAN19',
    handle: '@kyeban19',
    followers: 8,
    following: 4,
    comicsCount: 14,
    mangaCount: 22,
    booksCount: 3,
    watchlistCount: 9,
    avatarBg: '#2980B9',
    avatarImg: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    initial: 'K',
    isFollowing: false,
    achievements: [
      { name: 'Harsh Critic', color: '#FFF59D', icon: 'edit' },
      { name: 'Comic Collector', color: '#FFF59D', icon: 'target' }
    ],
    latestAdditions: [
      {
        title: 'BERSERK',
        type: 'Manga',
        chapter: 'Ch.376',
        cover: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=500&auto=format&fit=crop&q=80'
      }
    ]
  }
])

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return USERS.value
  return USERS.value.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.handle.toLowerCase().includes(q)
  )
})

watch(selectedUser, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

function openProfileModal(user) {
  selectedUser.value = user
}

function closeProfileModal() {
  selectedUser.value = null
}

function toggleFollow(user) {
  user.isFollowing = !user.isFollowing
  if (user.isFollowing) user.followers++
  else user.followers--
}

function handleSearch() {
  // Reactive via filteredUsers
}
</script>

<style scoped>
.cs-disc-page {
  min-height: 100vh;
  background-color: #FAF6EE;
  background-image: radial-gradient(circle, rgba(17, 17, 17, 0.08) 1.2px, transparent 1.2px);
  background-size: 14px 14px;
  display: flex;
  flex-direction: column;
}

.cs-disc-main {
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 5rem;
  display: flex;
  flex-direction: column;
}

/* Header */
.cs-disc-header-box {
  margin-bottom: 0.85rem;
}

.cs-disc-main-title {
  font-family: var(--font-comic);
  font-size: 2.8rem;
  font-style: italic;
  letter-spacing: 0.05em;
  color: #111111;
  line-height: 1;
  margin: 0;
}

.cs-disc-subtitle {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: #888877;
  margin-top: 0.25rem;
}

/* Search Bar */
.cs-disc-search-row {
  display: flex;
  gap: 0.85rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.cs-disc-search-input-box {
  flex: 1;
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border: 3.5px solid #111111;
  border-radius: 4px;
  box-shadow: 4px 4px 0px #111111;
  padding: 0 0.85rem;
  height: 48px;
  gap: 0.65rem;
}

.cs-disc-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 1.05rem;
  font-weight: 600;
  color: #111111;
}

.cs-disc-input::placeholder {
  color: #AAAA99;
}

.cs-disc-search-btn {
  height: 48px;
  padding: 0 1.5rem;
  background: #F5D13B;
  border: 3.5px solid #111111;
  border-radius: 4px;
  box-shadow: 4px 4px 0px #111111;
  font-family: var(--font-comic);
  font-size: 1.25rem;
  font-style: italic;
  letter-spacing: 0.06em;
  color: #111111;
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 100ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cs-disc-search-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #111111;
}

.cs-disc-search-btn:active {
  transform: translate(0, 0);
  box-shadow: 2px 2px 0px #111111;
}

/* Recommended Section Title */
.cs-disc-section-label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-comic);
  font-size: 1.15rem;
  font-style: italic;
  letter-spacing: 0.06em;
  color: #777766;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

/* Users List */
.cs-disc-users-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cs-disc-user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FAF6EE;
  border: 3.5px solid #111111;
  border-radius: 6px;
  box-shadow: 6px 6px 0px #111111;
  padding: 1.1rem 1.4rem;
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 100ms ease;
}

.cs-disc-user-card:hover {
  transform: translateY(-2px);
  box-shadow: 8px 8px 0px #111111;
}

.cs-disc-user-info {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.cs-disc-avatar-box {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid #111111;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-comic);
  font-size: 1.8rem;
  color: #FFFFFF;
  font-style: italic;
  box-shadow: 2px 2px 0px #111111;
}

.cs-disc-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cs-disc-user-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.cs-disc-user-name {
  font-family: var(--font-comic);
  font-size: 1.45rem;
  font-style: italic;
  letter-spacing: 0.05em;
  color: #111111;
  line-height: 1.1;
  margin: 0;
}

.cs-disc-username {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 700;
  color: #9E9E8E;
}

.cs-disc-followers {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: #A5A595;
}

/* Follow Button */
.cs-disc-follow-btn {
  background: #F5D13B;
  color: #111111;
  border: 3px solid #111111;
  border-radius: 4px;
  box-shadow: 4px 4px 0px #111111;
  padding: 0.55rem 1.4rem;
  font-family: var(--font-comic);
  font-size: 1.15rem;
  font-style: italic;
  letter-spacing: 0.06em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  transition: all 120ms ease;
}

.cs-disc-follow-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #111111;
}

.cs-disc-follow-btn.following {
  background: #00E676;
  color: #111111;
  box-shadow: 2px 2px 0px #111111;
}

.cs-disc-empty {
  font-family: var(--font-comic);
  font-size: 1.2rem;
  font-style: italic;
  color: #888877;
  text-align: center;
  padding: 3rem 1rem;
}

/* ── 5. User Profile Preview Modal (Exact Attached Screenshots) ── */
.cs-user-modal-card {
  background: #FAF6EE;
  border: 3.5px solid #111111;
  border-radius: 6px;
  box-shadow: 8px 8px 0px #111111;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 auto 2.5rem;
  animation: loaderPopIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.cs-user-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.4rem;
  background: #FFFFFF;
  border-bottom: 3.5px solid #111111;
}

.cs-user-modal-title {
  font-family: var(--font-comic);
  font-size: 1.35rem;
  font-style: italic;
  letter-spacing: 0.05em;
  color: #111111;
  margin: 0;
}

.cs-user-modal-close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #111111;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 100ms ease;
}

.cs-user-modal-close:hover {
  transform: scale(1.15);
}

.cs-user-modal-body {
  padding: 1.8rem 1.6rem 2.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Avatar Center */
.cs-user-avatar-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.cs-user-avatar-circle {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 4px solid #111111;
  box-shadow: 4px 4px 0px #A35028;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #23272A;
  margin-bottom: 0.75rem;
}

.cs-user-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cs-user-modal-name {
  font-family: var(--font-comic);
  font-size: 1.75rem;
  font-style: italic;
  letter-spacing: 0.05em;
  color: #111111;
  margin: 0;
  line-height: 1.1;
}

.cs-user-modal-handle {
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  color: #666655;
  margin-top: 0.1rem;
}

/* 6 Stat Counter Grid */
.cs-user-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.cs-user-stat-card {
  background: #FFFFFF;
  border: 2px solid #111111;
  border-radius: 4px;
  padding: 0.85rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.cs-user-stat-card.active-manga {
  border-color: #EE3545;
}

.cs-user-stat-num {
  font-family: var(--font-comic);
  font-size: 1.8rem;
  font-style: italic;
  letter-spacing: 0.04em;
  color: #111111;
  line-height: 1;
}

.cs-user-stat-label {
  font-family: var(--font-comic);
  font-size: 0.8rem;
  font-style: italic;
  letter-spacing: 0.08em;
  color: #111111;
  margin-top: 0.25rem;
}

/* Action Button */
.cs-user-action-btn {
  width: 100%;
  height: 48px;
  background: #EE3545;
  color: #FFFFFF;
  border: 3px solid #111111;
  border-radius: 4px;
  box-shadow: 4px 4px 0px #111111;
  font-family: var(--font-comic);
  font-size: 1.25rem;
  font-style: italic;
  letter-spacing: 0.06em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 120ms ease;
}

.cs-user-action-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #111111;
}

.cs-user-action-btn.following {
  background: #00E676;
  color: #111111;
}

/* Section Header */
.cs-user-section-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cs-user-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cs-user-section-title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-comic);
  font-size: 1.05rem;
  font-style: italic;
  letter-spacing: 0.06em;
  color: #111111;
}

.cs-user-section-count {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  color: #666655;
}

/* Achievements Chips */
.cs-user-achieve-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.cs-user-ach-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border: 2px solid #111111;
  border-radius: 4px;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 700;
  color: #111111;
  box-shadow: 2px 2px 0px #111111;
}

/* Latest Additions */
.cs-user-additions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.cs-user-add-card {
  background: #FFFFFF;
  border: 3px solid #111111;
  border-radius: 4px;
  box-shadow: 4px 4px 0px #111111;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.cs-user-add-cover-box {
  height: 220px;
  background: #111111;
  border-bottom: 2.5px solid #111111;
}

.cs-user-add-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cs-user-add-info {
  padding: 0.6rem 0.7rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.cs-user-add-title {
  font-family: var(--font-comic);
  font-size: 0.95rem;
  font-style: italic;
  letter-spacing: 0.03em;
  color: #111111;
  line-height: 1.15;
  margin: 0;
}

.cs-user-add-sub {
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 600;
  color: #777766;
}
</style>
