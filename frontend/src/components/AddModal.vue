<template>
  <div v-if="isOpen" class="f-modal-overlay" @click.self="closeModal">
    <!-- Hidden file inputs -->
    <input ref="shelfFileInput" type="file" accept="image/*" style="display:none" @change="onShelfFileChange" />
    <input ref="watchFileInput" type="file" accept="image/*" style="display:none" @change="onWatchFileChange" />
    <div class="cs-add-modal-card">

      <!-- ── Top Tab Switcher ── -->
      <div class="cs-add-tabs-header">
        <button
          type="button"
          class="cs-add-tab-btn tab-shelf"
          :class="{ active: activeTab === 'SHELF' }"
          @click="activeTab = 'SHELF'"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span>SHELF</span>
        </button>

        <button
          type="button"
          class="cs-add-tab-btn tab-watchlist"
          :class="{ active: activeTab === 'WATCHLIST' }"
          @click="activeTab = 'WATCHLIST'"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 3l-4 4L8 3"/>
          </svg>
          <span>WATCHLIST</span>
        </button>
      </div>

      <!-- ── Modal Content Container ── -->
      <div class="cs-add-modal-body">

        <!-- Title Banner with Vector SVG Icon & 3D Shadow -->
        <h2 class="cs-add-modal-title" :class="activeTab.toLowerCase()">
          <span v-if="activeTab === 'SHELF'" class="cs-title-inner">
            <svg class="cs-modal-title-svg shelf-svg" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#F5D13B" stroke-width="3"/>
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#F5D13B" stroke-width="3" stroke-linecap="round"/>
            </svg>
            <span>ADD TO SHELF</span>
          </span>
          <span v-else class="cs-title-inner">
            <svg class="cs-modal-title-svg watch-svg" viewBox="0 0 24 24" fill="none" stroke="#E28BF9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="#E28BF9" stroke-width="2.2"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke="#E28BF9" stroke-width="2"/>
              <line x1="7" y1="6" x2="7" y2="11" stroke="#E28BF9" stroke-width="2"/>
              <line x1="7" y1="13" x2="7" y2="18" stroke="#E28BF9" stroke-width="2"/>
              <line x1="17" y1="6" x2="17" y2="11" stroke="#E28BF9" stroke-width="2"/>
              <line x1="17" y1="13" x2="17" y2="18" stroke="#E28BF9" stroke-width="2"/>
            </svg>
            <span>ADD TO WATCHLIST</span>
          </span>
        </h2>

        <!-- ── FORM 1: SHELF ── -->
        <form v-if="activeTab === 'SHELF'" @submit.prevent="submitShelf" class="cs-add-form">
          <!-- Title -->
          <div class="cs-field-group">
            <label class="cs-field-label">TITLE</label>
            <input v-model="shelfForm.title" type="text" class="cs-pop-input" placeholder="ENTER TITLE..." required />
          </div>

          <!-- Type & Status -->
          <div class="cs-field-row-2">
            <div class="cs-field-group">
              <label class="cs-field-label">TYPE</label>
              <select v-model="shelfForm.type" class="cs-pop-select">
                <option>Manga</option>
                <option>Manhwa</option>
                <option>Webtoon</option>
                <option>Comic</option>
                <option>Manhua</option>
                <option>Book</option>
              </select>
            </div>
            <div class="cs-field-group">
              <label class="cs-field-label">STATUS</label>
              <select v-model="shelfForm.status" class="cs-pop-select">
                <option>Plan to Read</option>
                <option>Reading</option>
                <option>Completed</option>
                <option>On Hold</option>
                <option>Dropped</option>
              </select>
            </div>
          </div>

          <!-- Pin to top -->
          <label class="cs-checkbox-line">
            <input v-model="shelfForm.pinned" type="checkbox" />
            <span>PIN TO TOP</span>
          </label>

          <!-- Search for Cover -->
          <div class="cs-field-group">
            <label class="cs-field-label">SEARCH FOR COVER</label>
            <div class="cs-input-btn-wrap">
              <input v-model="coverSearchQuery" type="text" class="cs-pop-input" placeholder="Press Enter to search..." @keyup.enter="searchCover" />
              <button type="button" class="cs-btn-pop-yellow" @click="searchCover">SEARCH</button>
            </div>
          </div>

          <!-- Cover Image Section -->
          <div class="cs-field-group">
            <label class="cs-field-label">COVER</label>
            <div class="cs-cover-picker-row">
              <div class="cs-cover-preview-box">
                <img v-if="shelfForm.cover" :src="shelfForm.cover" alt="Cover" class="cs-cover-img-preview" />
                <span v-else class="cs-cover-question-mark">?</span>
              </div>
              <button type="button" class="cs-btn-pop-white" @click="triggerShelfUpload">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.3rem"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                UPLOAD
              </button>
            </div>
          </div>

          <!-- Current Chapter & Total -->
          <div class="cs-field-row-2">
            <div class="cs-field-group">
              <label class="cs-field-label">CURRENT CHAPTER.</label>
              <input v-model.number="shelfForm.chapter" type="number" min="0" class="cs-pop-input" />
            </div>
            <div class="cs-field-group">
              <label class="cs-field-label">TOTAL (OPT.)</label>
              <input v-model.number="shelfForm.totalChapters" type="number" min="0" class="cs-pop-input" placeholder="?" />
            </div>
          </div>

          <!-- Tags / Genres -->
          <div class="cs-field-group">
            <label class="cs-field-label">TAGS / GENRES</label>
            <div class="cs-input-btn-wrap">
              <input v-model="tagInput" type="text" class="cs-pop-input" placeholder="TYPE A TAG, PRESS ENTER..." @keyup.enter="addTag" />
              <button type="button" class="cs-btn-pop-yellow" @click="addTag">+ ADD</button>
              <button type="button" class="cs-btn-pop-white" @click="isPresetsOpen = !isPresetsOpen">PRESETS ▼</button>
            </div>
            <div v-if="isPresetsOpen" class="cs-presets-dropdown">
              <button v-for="preset in PRESET_TAGS" :key="preset" type="button" class="cs-preset-pill" @click="selectPreset(preset)">
                + {{ preset }}
              </button>
            </div>
            <div v-if="shelfForm.tags.length" class="cs-selected-tags-row">
              <span v-for="(tag, idx) in shelfForm.tags" :key="idx" class="cs-tag-chip">
                {{ tag }} <button type="button" @click="shelfForm.tags.splice(idx, 1)"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </span>
            </div>
          </div>

          <!-- Rating (1-10) -->
          <div class="cs-field-group">
            <label class="cs-field-label">YOUR RATING (1-10)</label>
            <div class="cs-rating-buttons-row">
              <button
                v-for="r in 10"
                :key="r"
                type="button"
                class="cs-rating-sq-btn"
                :class="{ active: shelfForm.rating === r }"
                @click="shelfForm.rating = r"
              >
                {{ r }}
              </button>
            </div>
          </div>

          <!-- Notes -->
          <div class="cs-field-group">
            <label class="cs-field-label">NOTES</label>
            <textarea v-model="shelfForm.notes" class="cs-pop-textarea" placeholder="Thoughts, where you left off.."></textarea>
          </div>

          <!-- Keep Private -->
          <div class="cs-checkbox-box">
            <label class="cs-checkbox-line">
              <input v-model="shelfForm.private" type="checkbox" />
              <span>Keep private (won't show in followers' feed)</span>
            </label>
          </div>

          <!-- Actions -->
          <div class="cs-add-actions-row">
            <button type="button" class="cs-btn-pop-white cs-btn-nope" @click="closeModal">NOPE</button>
            <button type="submit" class="cs-btn-pop-yellow cs-btn-submit">ADD IT!</button>
          </div>
        </form>

        <!-- ── FORM 2: WATCHLIST ── -->
        <form v-else @submit.prevent="submitWatchlist" class="cs-add-form">
          <!-- Title -->
          <div class="cs-field-group">
            <label class="cs-field-label">TITLE</label>
            <input v-model="watchForm.title" type="text" class="cs-pop-input" placeholder="ENTER TITLE..." required />
          </div>

          <!-- Type & Status -->
          <div class="cs-field-row-2">
            <div class="cs-field-group">
              <label class="cs-field-label">TYPE</label>
              <select v-model="watchForm.type" class="cs-pop-select">
                <option>MOVIE</option>
                <option>ANIME</option>
                <option>TV SERIES</option>
                <option>K-DRAMA</option>
                <option>CARTOON</option>
              </select>
            </div>
            <div class="cs-field-group">
              <label class="cs-field-label">STATUS</label>
              <select v-model="watchForm.status" class="cs-pop-select">
                <option>PLAN TO WATCH</option>
                <option>WATCHING</option>
                <option>COMPLETED</option>
                <option>ON HOLD</option>
                <option>DROPPED</option>
              </select>
            </div>
          </div>

          <!-- Search for Cover -->
          <div class="cs-field-group">
            <label class="cs-field-label">SEARCH FOR COVER</label>
            <div class="cs-input-btn-wrap">
              <input v-model="watchCoverQuery" type="text" class="cs-pop-input" placeholder="PRESS ENTER TO SEARCH..." @keyup.enter="searchWatchCover" />
              <button type="button" class="cs-btn-pop-yellow" @click="searchWatchCover">SEARCH</button>
            </div>
          </div>

          <!-- Cover Image Section -->
          <div class="cs-field-group">
            <label class="cs-field-label">COVER</label>
            <div class="cs-cover-picker-row">
              <div class="cs-cover-preview-box">
                <img v-if="watchForm.cover" :src="watchForm.cover" alt="Cover" class="cs-cover-img-preview" />
                <span v-else class="cs-cover-question-mark">?</span>
              </div>
              <button type="button" class="cs-btn-pop-white" @click="triggerWatchUpload">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.3rem"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                UPLOAD
              </button>
            </div>
          </div>

          <!-- Runtime & IMDb Rating -->
          <div class="cs-field-row-2">
            <div class="cs-field-group">
              <label class="cs-field-label">RUNTIME (MIN.)</label>
              <input v-model="watchForm.runtime" type="text" class="cs-pop-input" placeholder="E.G. 124" />
            </div>
            <div class="cs-field-group">
              <label class="cs-field-label">IMDB RATING</label>
              <input v-model="watchForm.imdbRating" type="text" class="cs-pop-input" placeholder="E.G. 8.5" />
            </div>
          </div>

          <!-- Genre & Director -->
          <div class="cs-field-row-2">
            <div class="cs-field-group">
              <label class="cs-field-label">GENRE</label>
              <input v-model="watchForm.genre" type="text" class="cs-pop-input" placeholder="E.G. ACTION, SCI-FI" />
            </div>
            <div class="cs-field-group">
              <label class="cs-field-label">DIRECTOR</label>
              <input v-model="watchForm.director" type="text" class="cs-pop-input" placeholder="E.G. CHRISTOPHER NOLAN" />
            </div>
          </div>

          <!-- Rating (1-10) -->
          <div class="cs-field-group">
            <label class="cs-field-label">YOUR RATING (1-10)</label>
            <div class="cs-rating-buttons-row">
              <button
                v-for="r in 10"
                :key="r"
                type="button"
                class="cs-rating-sq-btn pink-mode"
                :class="{ active: watchForm.rating === r }"
                @click="watchForm.rating = r"
              >
                {{ r }}
              </button>
            </div>
          </div>

          <!-- Notes -->
          <div class="cs-field-group">
            <label class="cs-field-label">NOTES</label>
            <textarea v-model="watchForm.notes" class="cs-pop-textarea" placeholder="YOUR THOUGHTS, REMINDERS..."></textarea>
          </div>

          <!-- Keep Private -->
          <div class="cs-checkbox-box">
            <label class="cs-checkbox-line">
              <input v-model="watchForm.private" type="checkbox" />
              <span>Keep private (won't show in followers' feed)</span>
            </label>
          </div>

          <!-- Actions -->
          <div class="cs-add-actions-row">
            <button type="button" class="cs-btn-pop-white cs-btn-nope" @click="closeModal">NOPE</button>
            <button type="submit" class="cs-btn-pop-pink cs-btn-submit">ADD IT!</button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { comicStore } from '../stores/useComicStore.js'
import '../assets/auth.css'

const isOpen = ref(false)
const shelfFileInput = ref(null)
const watchFileInput = ref(null)

watch(isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
const activeTab = ref('SHELF')

const coverSearchQuery = ref('')
const watchCoverQuery = ref('')

const tagInput = ref('')
const isPresetsOpen = ref(false)
const PRESET_TAGS = ['Action', 'Adventure', 'Sci-Fi', 'Fantasy', 'Romance', 'Drama', 'Comedy', 'Superhero', 'Supernatural', 'Thriller']

const shelfForm = reactive({
  title: '',
  type: 'Manga',
  status: 'Plan to Read',
  pinned: false,
  cover: '',
  chapter: 0,
  totalChapters: 0,
  tags: [],
  rating: 8,
  notes: '',
  private: false
})

const watchForm = reactive({
  title: '',
  type: 'MOVIE',
  status: 'PLAN TO WATCH',
  cover: '',
  runtime: '',
  imdbRating: '',
  genre: '',
  director: '',
  rating: 8,
  notes: '',
  private: false
})

function addTag() {
  const val = tagInput.value.trim()
  if (val && !shelfForm.tags.includes(val)) {
    shelfForm.tags.push(val)
  }
  tagInput.value = ''
}

function selectPreset(tag) {
  if (!shelfForm.tags.includes(tag)) {
    shelfForm.tags.push(tag)
  }
  isPresetsOpen.value = false
}

function searchCover() {
  if (!coverSearchQuery.value.trim()) return
  shelfForm.cover = `https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80`
}

function searchWatchCover() {
  if (!watchCoverQuery.value.trim()) return
  watchForm.cover = `https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80`
}

function triggerShelfUpload() {
  shelfFileInput.value?.click()
}

function triggerWatchUpload() {
  watchFileInput.value?.click()
}

function onShelfFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { shelfForm.cover = ev.target.result }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function onWatchFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { watchForm.cover = ev.target.result }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function submitShelf() {
  comicStore.addEntry({
    title: shelfForm.title,
    type: shelfForm.type,
    status: shelfForm.status,
    pinned: shelfForm.pinned,
    cover: shelfForm.cover || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    chapter: shelfForm.chapter || 0,
    totalChapters: shelfForm.totalChapters || 0,
    tags: [...shelfForm.tags],
    rating: shelfForm.rating,
    notes: shelfForm.notes,
    publisher: 'Publisher'
  })
  closeModal()
}

function submitWatchlist() {
  comicStore.watchlist.push({
    id: Date.now(),
    title: watchForm.title,
    type: watchForm.type,
    status: watchForm.status,
    cover: watchForm.cover || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
    runtime: watchForm.runtime,
    rating: watchForm.rating,
    currentEpisode: 1,
    totalEpisodes: 12,
    season: 1
  })
  closeModal()
}

function closeModal() {
  isOpen.value = false
}

function handleOpenEvent(e) {
  isOpen.value = true
  if (e?.detail?.tab) {
    activeTab.value = e.detail.tab
  }
}

onMounted(() => {
  window.addEventListener('open-add-comic-modal', handleOpenEvent)
})

onUnmounted(() => {
  window.removeEventListener('open-add-comic-modal', handleOpenEvent)
})
</script>
