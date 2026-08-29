<template>
  <div class="feed-page">
    <Navbar />

    <main class="feed-main fade-in-contents">

      <!-- Header Section -->
      <section class="feed-header">
        <h1 class="feed-title">{{ headerTitle }}</h1>
        <p class="feed-sub">{{ headerSubtitle }}</p>
      </section>

      <!-- Sub-Tabs Row (ACTIVITY / FOLLOWING / FOLLOWERS) -->
      <div class="feed-subtabs-row">
        <!-- 1. ACTIVITY -->
        <button
          type="button"
          class="feed-subtab-btn"
          :class="{ active: activeTab === 'activity' }"
          @click="activeTab = 'activity'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9"/>
            <path d="M4 4a16 16 0 0 1 16 16"/>
            <circle cx="5" cy="19" r="1.5" fill="currentColor"/>
          </svg>
          <span>ACTIVITY</span>
        </button>

        <!-- 2. FOLLOWING -->
        <button
          type="button"
          class="feed-subtab-btn"
          :class="{ active: activeTab === 'following' }"
          @click="activeTab = 'following'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <span>FOLLOWING ({{ followingList.length }})</span>
        </button>

        <!-- 3. FOLLOWERS -->
        <button
          type="button"
          class="feed-subtab-btn"
          :class="{ active: activeTab === 'followers' }"
          @click="activeTab = 'followers'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>FOLLOWERS ({{ followersList.length }})</span>
        </button>
      </div>

      <!-- Tab Content 1: ACTIVITY -->
      <div v-if="activeTab === 'activity'" class="feed-tab-content pop-up-contents">
        <div v-if="activityList.length === 0" class="feed-empty-box">
          <div class="feed-empty-icon-wrap">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C4C4C4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6"/>
              <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
          </div>
          <h3 class="feed-empty-title">NO ACTIVITY YET</h3>
          <p class="feed-empty-sub">The people you follow haven't logged anything yet.</p>
        </div>

        <div v-else class="feed-activity-list">
          <div v-for="item in activityList" :key="item.id" class="feed-activity-card">
            <div class="activity-user-avatar">{{ item.initial }}</div>
            <div class="activity-info">
              <span class="activity-text"><strong>{{ item.userName }}</strong> {{ item.action }} <strong>{{ item.target }}</strong></span>
              <span class="activity-time">{{ item.timeAgo }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content 2: FOLLOWING -->
      <div v-else-if="activeTab === 'following'" class="feed-tab-content pop-up-contents">
        <div v-if="followingList.length === 0" class="feed-empty-box">
          <h3 class="feed-empty-title">NOT FOLLOWING ANYONE YET</h3>
          <p class="feed-empty-sub">Find readers on the Discover tab to follow!</p>
        </div>

        <div v-else class="feed-users-list">
          <div v-for="user in followingList" :key="user.id" class="feed-user-row-card">
            <div class="feed-user-left">
              <div class="feed-user-avatar" :style="{ backgroundColor: user.avatarBg }">
                <img v-if="user.avatarImg" :src="user.avatarImg" :alt="user.name" class="feed-avatar-img" />
                <span v-else class="feed-avatar-initial">{{ user.initial }}</span>
              </div>
              <div class="feed-user-details">
                <h3 class="feed-user-name">{{ user.name }}</h3>
                <span class="feed-user-handle">{{ user.handle }}</span>
                <span class="feed-user-count">{{ user.followers }} followers</span>
              </div>
            </div>

            <button
              type="button"
              class="feed-btn-following"
              @click="toggleFollow(user)"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <polyline points="17 11 19 13 23 9"/>
              </svg>
              <span>{{ user.isFollowing ? 'FOLLOWING' : 'FOLLOW' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content 3: FOLLOWERS -->
      <div v-else-if="activeTab === 'followers'" class="feed-tab-content pop-up-contents">
        <div v-if="followersList.length === 0" class="feed-empty-box">
          <div class="feed-empty-icon-wrap">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C4C4C4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 class="feed-empty-title">NO FOLLOWERS YET</h3>
          <p class="feed-empty-sub">Share your profile to attract followers!</p>
        </div>

        <div v-else class="feed-users-list">
          <div v-for="user in followersList" :key="user.id" class="feed-user-row-card">
            <div class="feed-user-left">
              <div class="feed-user-avatar" :style="{ backgroundColor: user.avatarBg }">
                <img v-if="user.avatarImg" :src="user.avatarImg" :alt="user.name" class="feed-avatar-img" />
                <span v-else class="feed-avatar-initial">{{ user.initial }}</span>
              </div>
              <div class="feed-user-details">
                <h3 class="feed-user-name">{{ user.name }}</h3>
                <span class="feed-user-handle">{{ user.handle }}</span>
                <span class="feed-user-count">{{ user.followers }} followers</span>
              </div>
            </div>

            <button type="button" class="feed-btn-following" @click="toggleFollow(user)">
              <span>{{ user.isFollowing ? 'FOLLOWING' : 'FOLLOW' }}</span>
            </button>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '../components/Navbar.vue'

const activeTab = ref('activity')

// Following list matching exact screenshot (SALANGI & JENSSIE)
const followingList = ref([
  {
    id: 'f-1',
    name: 'SALANGI',
    handle: '@salangi1',
    followers: 5,
    initial: 'S',
    avatarBg: '#262626',
    avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isFollowing: true
  },
  {
    id: 'f-2',
    name: 'JENSSIE',
    handle: '@jena',
    followers: 3,
    initial: 'J',
    avatarBg: '#333333',
    avatarImg: '',
    isFollowing: true
  }
])

const followersList = ref([])

const activityList = ref([])

const headerTitle = computed(() => {
  if (activeTab.value === 'followers') return 'FOLLOWERS FEED'
  return 'FOLLOWING FEED'
})

const headerSubtitle = computed(() => {
  if (activeTab.value === 'activity') return 'Recent activity from readers you follow or have followed'
  if (activeTab.value === 'following') return 'Everyone you currently follow'
  return 'Readers following you'
})

function toggleFollow(user) {
  user.isFollowing = !user.isFollowing
}
</script>

<style scoped>
.feed-page {
  min-height: 100vh;
  background-color: var(--f-bg);
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
  display: flex;
  flex-direction: column;
}

.feed-main {
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feed-header {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.25rem;
}

.feed-title {
  font-family: var(--font-comic);
  font-size: 2.8rem;
  line-height: 1;
  color: var(--f-text);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.feed-sub {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: #777777;
}

/* ── Sub-Tabs Row (ACTIVITY / FOLLOWING / FOLLOWERS) ── */
.feed-subtabs-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.feed-subtab-btn {
  font-family: var(--font-comic);
  font-size: 1.15rem;
  font-style: italic;
  letter-spacing: 0.05em;
  padding: 0.45rem 1.4rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #FFFFFF;
  color: #111111;
  border: 2.5px solid #111111;
  box-shadow: 4px 4px 0px #79441B;
  transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
}

.feed-subtab-btn:hover {
  transform: translateY(-2px);
  box-shadow: 5.5px 5.5px 0px #79441B;
}

.feed-subtab-btn.active {
  background: #F5D13B;
  color: #111111;
  box-shadow: 4px 4px 0px #79441B;
}

/* Tab Content Box */
.feed-tab-content {
  margin-top: 0.5rem;
  width: 100%;
}

/* Empty State Box */
.feed-empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1.5rem;
  text-align: center;
}

.feed-empty-icon-wrap {
  margin-bottom: 0.75rem;
}

.feed-empty-title {
  font-family: var(--font-comic);
  font-size: 2.2rem;
  color: #888888;
  letter-spacing: 0.05em;
  line-height: 1;
}

.feed-empty-sub {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: #999999;
  margin-top: 0.35rem;
}

/* User Row Cards for FOLLOWING & FOLLOWERS */
.feed-users-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  width: 100%;
}

.feed-user-row-card {
  background: #FFFFFF;
  border: 2.5px solid #111111;
  border-radius: 4px;
  box-shadow: 5px 5px 0px #79441B;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.feed-user-row-card:hover {
  transform: translateY(-2px);
  box-shadow: 7px 7px 0px #79441B;
}

.feed-user-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.feed-user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid #111111;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.feed-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feed-avatar-initial {
  font-family: var(--font-comic);
  font-size: 1.6rem;
  color: #FFFFFF;
}

.feed-user-details {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.feed-user-name {
  font-family: var(--font-comic);
  font-size: 1.5rem;
  line-height: 1;
  color: #111111;
  letter-spacing: 0.03em;
  margin: 0;
}

.feed-user-handle {
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 700;
  color: #777777;
}

.feed-user-count {
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 700;
  color: #999999;
}

.feed-btn-following {
  font-family: var(--font-comic);
  font-size: 1.05rem;
  font-style: italic;
  letter-spacing: 0.05em;
  background: #FFFFFF;
  color: #111111;
  border: 2.5px solid #111111;
  border-radius: 4px;
  box-shadow: 3.5px 3.5px 0px #79441B;
  padding: 0.45rem 1.15rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
}

.feed-btn-following:hover {
  transform: translateY(-2px);
  box-shadow: 5px 5px 0px #79441B;
  background: #FFFDF5;
}

@media (max-width: 768px) {
  .feed-main {
    padding: 1rem 0.75rem 3rem;
  }
  .feed-title {
    font-size: 2rem;
  }
  .feed-subtabs-row {
    width: 100%;
  }
  .feed-subtab-btn {
    flex: 1;
    justify-content: center;
    padding: 0.45rem 0.75rem;
    font-size: 0.95rem;
  }
  .feed-user-row-card {
    padding: 0.85rem 0.85rem;
  }
  .feed-user-avatar {
    width: 46px;
    height: 46px;
  }
  .feed-user-name {
    font-size: 1.25rem;
  }
}
</style>
