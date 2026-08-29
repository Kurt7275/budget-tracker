<template>
  <div class="shelf-page">
    <Navbar />

    <main class="cs-home-page-container">

      <!-- ── 1. Status Stats Counter Cards Row ── -->
      <div class="cs-stats-cards-row">
        <div class="cs-stat-card card-total" @click="activeStatus = 'ALL'">
          <div class="cs-card-binder-spine"></div>
          <div class="cs-card-content">
            <div class="cs-card-label">TOTAL</div>
            <div class="cs-card-number">{{ totalCount }}</div>
          </div>
        </div>

        <div class="cs-stat-card card-reading" @click="activeStatus = 'READING'">
          <div class="cs-card-binder-spine"></div>
          <div class="cs-card-content">
            <div class="cs-card-label">READING</div>
            <div class="cs-card-number">{{ readingCount }}</div>
          </div>
        </div>

        <div class="cs-stat-card card-done" @click="activeStatus = 'COMPLETED'">
          <div class="cs-card-binder-spine"></div>
          <div class="cs-card-content">
            <div class="cs-card-label">DONE</div>
            <div class="cs-card-number">{{ doneCount }}</div>
          </div>
        </div>

        <div class="cs-stat-card card-planned" @click="activeStatus = 'PLAN TO READ'">
          <div class="cs-card-binder-spine"></div>
          <div class="cs-card-content">
            <div class="cs-card-label">PLANNED</div>
            <div class="cs-card-number">{{ plannedCount }}</div>
          </div>
        </div>

        <div class="cs-stat-card card-hold" @click="activeStatus = 'ON HOLD'">
          <div class="cs-card-binder-spine"></div>
          <div class="cs-card-content">
            <div class="cs-card-label">ON HOLD</div>
            <div class="cs-card-number">{{ onHoldCount }}</div>
          </div>
        </div>

        <div class="cs-stat-card card-dropped" @click="activeStatus = 'DROPPED'">
          <div class="cs-card-binder-spine"></div>
          <div class="cs-card-content">
            <div class="cs-card-label">DROPPED</div>
            <div class="cs-card-number">{{ droppedCount }}</div>
          </div>
        </div>
      </div>

      <!-- ── 2. Reading Goal Progress Banner Card (Matching Screenshot) ── -->
      <div
        class="cs-goal-progress-card"
        role="button"
        tabindex="0"
        aria-label="Edit reading goal"
        @click="isGoalModalOpen = true"
        @keydown.enter="isGoalModalOpen = true"
        @keydown.space.prevent="isGoalModalOpen = true"
      >
        <span class="cs-goal-badge-tag">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
          <span>{{ comicStore.goal?.year || 2026 }} GOAL</span>
        </span>

        <div class="cs-goal-bar-row">
          <div class="cs-goal-bar-track">
            <div
              class="cs-goal-bar-fill"
              :style="{ width: goalProgressPercent + '%' }"
            ></div>
          </div>
          <span class="cs-goal-percent-txt">{{ goalProgressPercent }}%</span>
        </div>

        <div class="cs-goal-subtext">
          {{ doneCount }} / {{ comicStore.goal?.titlesGoal || 12 }} titles completed
        </div>
      </div>

      <!-- ── 3. Search and Action Row ── -->
      <div class="cs-search-row">
        <div class="cs-search-input-wrap">
          <svg class="cs-search-icon-inside" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="cs-search-input"
            placeholder="Search your shelf."
          />
        </div>

        <select v-model="sortBy" class="cs-sort-select">
          <option value="recent">Recently Added ˅</option>
          <option value="title">Title A-Z</option>
          <option value="rating">Highest Score</option>
          <option value="progress">Progress</option>
        </select>

        <button type="button" class="cs-select-btn" :class="{ active: isSelectMode }" @click="isSelectMode = !isSelectMode">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <span>SELECT</span>
        </button>
      </div>

      <!-- ── 4. Filter Pills Section ── -->
      <!-- Row 1: Status Filters -->
      <div class="cs-filter-pills-row">
        <button
          v-for="st in STATUS_OPTIONS"
          :key="st"
          type="button"
          class="cs-pill-btn"
          :class="[
            getStatusPillClass(st),
            { active: activeStatus === st }
          ]"
          @click="activeStatus = st"
        >
          {{ st }}
        </button>
      </div>

      <!-- Row 2: Type Filters -->
      <div class="cs-filter-pills-row">
        <button
          v-for="tp in TYPE_OPTIONS"
          :key="tp"
          type="button"
          class="cs-pill-btn"
          :class="{ active: activeType === tp }"
          @click="activeType = tp"
        >
          {{ tp }}
        </button>
      </div>

      <!-- Horizontal Black Separator Line -->
      <div class="shelf-divider-line"></div>

      <!-- ── 5. Empty State Message ── -->
      <div v-if="filteredEntries.length === 0" class="cs-empty-state-box">
        <h3 class="cs-empty-state-text">YOUR SHELF IS EMPTY – ADD YOUR FIRST TITLE!</h3>
        <button type="button" class="cs-btn-add-inline" @click="isAddModalOpen = true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.3rem"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ADD TITLE NOW
        </button>
      </div>

      <!-- ── 6. Titles Display Grid (Exact Attached Screenshots Spec) ── -->
      <TransitionGroup v-else name="card-fade" tag="div" class="comic-shelf-grid pop-up-contents">
        <div
          v-for="item in filteredEntries"
          :key="item.id"
          class="cs-pop-card"
          :class="getStatusThemeClass(item.status)"
        >
          <div class="cs-pop-burst-tag" :class="getStatusThemeClass(item.status)">
            {{ getBurstText(item.status) }}
          </div>

          <!-- Cover Art Box -->
          <div class="cs-pop-cover-box" @click="openDetail(item)">
            <!-- Cover Image or NO COVER Fallback -->
            <template v-if="item.cover && !item.hasCoverError">
              <img
                :src="item.cover"
                :alt="item.title"
                class="cs-pop-cover-img"
                @error="item.hasCoverError = true"
              />
            </template>
            <template v-else>
              <div class="cs-pop-no-cover-box">
                <span class="cs-pop-no-cover-txt">NO<br />COVER</span>
              </div>
              <!-- Yellow Bottom Cover Banner (Only shown when NO COVER) -->
              <div class="cs-pop-cover-bottom-banner">
                <span>{{ item.title }}</span>
              </div>
            </template>
          </div>

          <!-- Card Body Content -->
          <div class="cs-pop-card-body">

            <!-- Title -->
            <h3 class="cs-pop-title" :title="item.title" @click="openDetail(item)">
              {{ item.title }}
            </h3>

            <!-- Chapter Progress & Time -->
            <div class="cs-pop-progress-text-row">
              <span class="cs-pop-ch-text">CH. {{ item.chapter || 0 }}<template v-if="item.totalChapters"> / {{ item.totalChapters }}</template></span>
              <span class="cs-pop-time-text">{{ item.updatedAtText || 'just now' }}</span>
            </div>

            <!-- Progress Bar Track & Fill -->
            <div class="cs-pop-bar-track">
              <div
                class="cs-pop-bar-fill"
                :class="getStatusThemeClass(item.status)"
                :style="{ width: getProgressPercent(item) + '%' }"
              ></div>
            </div>

            <!-- Star Rating Badge (If rating exists) -->
            <div v-if="item.rating" class="cs-pop-star-wrap">
              <div class="cs-pop-star-badge">
                <svg class="cs-pop-star-svg" viewBox="0 0 50 50">
                  <polygon
                    points="25,2 32,18 49,18 35,29 40,46 25,35 10,46 15,29 1,18 18,18"
                    fill="#F5D13B"
                    stroke="#111111"
                    stroke-width="3"
                    stroke-linejoin="miter"
                  />
                </svg>
                <div class="cs-pop-star-num">{{ item.rating }}/10</div>
              </div>
            </div>

            <!-- Genre Tags (If tags exist) -->
            <div v-if="item.tags && item.tags.length" class="cs-pop-tags-row">
              <span v-for="tag in item.tags" :key="tag" class="cs-pop-tag-pill">
                {{ tag }}
              </span>
            </div>

            <!-- Bottom Action Control Buttons -->
            <div class="cs-pop-controls-row">
              <button
                type="button"
                class="cs-pop-ctrl-btn btn-minus"
                title="Previous Chapter"
                @click.stop="comicStore.incrementChapter(item.id, -1)"
              >
                −
              </button>
              <button
                type="button"
                class="cs-pop-ctrl-btn btn-plus-red"
                title="Next Chapter (+1)"
                @click.stop="comicStore.incrementChapter(item.id, 1)"
              >
                +
              </button>
              <button
                type="button"
                class="cs-pop-ctrl-btn btn-sync"
                title="Edit / Details"
                @click.stop="openDetail(item)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </button>
            </div>

          </div>

          <div class="cs-pop-type-banner" :class="getStatusThemeClass(item.status)">
            <span>{{ item.type || 'MANGA' }}</span>
          </div>
        </div>
      </TransitionGroup>

    </main>

    <!-- ── Modal: Detail & Editor ── -->
    <div v-if="selectedItem" class="f-modal-overlay" @click.self="selectedItem = null">
      <div class="f-modal-card" style="max-width: 540px;">
        <button type="button" class="f-modal-close" @click="selectedItem = null">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div style="display: flex; gap: 1rem; margin-bottom: 1.25rem;">
            <img :src="selectedItem.cover" :alt="selectedItem.title" style="width: 90px; height: 130px; object-fit: cover; border: 2.5px solid #000; border-radius: 4px; box-shadow: 2px 2px 0 var(--theme-shadow);" />
          <div>
            <span class="card-burst-tag" :class="getStatusClass(selectedItem.status)" style="position: static; transform: none; display: inline-block; margin-bottom: 0.35rem;">
              {{ selectedItem.status }}
            </span>
            <h2 style="font-family: var(--font-comic); font-size: 1.5rem; line-height: 1.15;">{{ selectedItem.title }}</h2>
            <div style="font-size: 0.85rem; color: #555; margin-top: 0.2rem;">{{ selectedItem.publisher }} • {{ selectedItem.type }}</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="f-input-field">
              <label class="f-input-label">Reading Status</label>
              <select v-model="selectedItem.status" class="f-input-box">
                <option v-for="st in ['Reading', 'Plan to Read', 'Completed', 'On Hold', 'Dropped']" :key="st" :value="st">{{ st }}</option>
              </select>
            </div>

            <div class="f-input-field">
              <label class="f-input-label">Score (1 - 10)</label>
              <input v-model.number="selectedItem.rating" type="number" step="0.1" min="0" max="10" class="f-input-box" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="f-input-field">
              <label class="f-input-label">Current Chapter</label>
              <input v-model.number="selectedItem.chapter" type="number" min="0" class="f-input-box" />
            </div>
            <div class="f-input-field">
              <label class="f-input-label">Total Chapters</label>
              <input v-model.number="selectedItem.totalChapters" type="number" min="0" class="f-input-box" />
            </div>
          </div>

          <div class="f-input-field">
            <label class="f-input-label">Personal Notes / Review</label>
            <textarea v-model="selectedItem.notes" rows="2" class="f-input-box" style="height: auto; padding: 0.5rem;"></textarea>
          </div>

          <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
            <button type="button" class="btn-comic-red" style="flex: 1;" @click="saveDetail">
              SAVE CHANGES
            </button>
            <button type="button" class="btn-comic-yellow" style="background: #FFEBEB; color: #B71C1C;" @click="deleteSelected">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.3rem"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              Delete
            </button>
          </div>
        </div>

      </div>
    </div>



    <!-- ── Modal: Set Reading Goal ── -->
    <div v-if="isGoalModalOpen" class="f-modal-overlay" @click.self="isGoalModalOpen = false">
      <div class="cs-goal-modal-card">

        <!-- Title & Subtitle -->
        <h2 class="cs-goal-modal-title">SET YOUR GOAL!</h2>
        <p class="cs-goal-modal-sub">Progress counts from today — not your existing shelf.</p>

        <!-- Inputs Row -->
        <div class="cs-goal-inputs-grid">
          <div class="cs-goal-field">
            <label class="cs-goal-label">TITLES TO FINISH</label>
            <input
              v-model.number="goalTitles"
              type="number"
              min="1"
              class="cs-goal-input"
              placeholder="E.G. 5"
            />
          </div>

          <div class="cs-goal-field">
            <label class="cs-goal-label">CHAPTERS TO READ</label>
            <input
              v-model.number="goalChapters"
              type="number"
              min="1"
              class="cs-goal-input"
              placeholder="E.G. 100"
            />
          </div>
        </div>

        <!-- Finish By Duration Pills -->
        <div class="cs-goal-duration-sec">
          <label class="cs-goal-label">FINISH BY</label>

          <div class="cs-duration-pills-row">
            <button
              v-for="dur in DURATION_OPTIONS"
              :key="dur.label"
              type="button"
              class="cs-duration-pill"
              :class="{ active: selectedDuration === dur.label }"
              @click="selectedDuration = dur.label"
            >
              {{ dur.label }}
            </button>
          </div>

          <div class="cs-goal-deadline-txt">
            Deadline: {{ computedDeadlineDate }}
          </div>
        </div>

        <!-- Bottom Action Buttons -->
        <div class="cs-goal-actions-row">
          <button type="button" class="cs-btn-nope" @click="isGoalModalOpen = false">
            NOPE
          </button>

          <button type="button" class="cs-btn-save-goal" @click="saveReadingGoal">
            SAVE GOALS!
          </button>
        </div>

      </div>
    </div>

    <!-- ── Toast Notification Popup (Matching Screenshot) ── -->
    <transition name="toast-slide">
      <div v-if="toastMessage" class="cs-toast-notification">
        <div class="cs-toast-left-bar"></div>
        <div class="cs-toast-check-circle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E676" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <span class="cs-toast-msg-txt">{{ toastMessage }}</span>
        <button type="button" class="cs-toast-close-btn" @click="toastMessage = ''">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import { comicStore } from '../stores/useComicStore.js'
import '../assets/auth.css'

const activeStatus = ref('ALL')
const activeType = ref('ALL TYPES')
const searchQuery = ref('')
const sortBy = ref('recent')
const isSelectMode = ref(false)

const selectedItem = ref(null)
const isAddModalOpen = ref(false)
const isGoalModalOpen = ref(false)

const goalTitles = ref(comicStore.goal?.titlesGoal || 5)
const goalChapters = ref(comicStore.goal?.chaptersGoal || 100)
const selectedDuration = ref('1 MONTH')

const DURATION_OPTIONS = [
  { label: '1 WEEK', days: 7 },
  { label: '2 WEEKS', days: 14 },
  { label: '1 MONTH', days: 30 },
  { label: '3 MONTHS', days: 90 },
  { label: '6 MONTHS', days: 180 },
  { label: '1 YEAR', days: 365 }
]

const computedDeadlineDate = computed(() => {
  const option = DURATION_OPTIONS.find(d => d.label === selectedDuration.value) || DURATION_OPTIONS[2]
  const targetDate = new Date(Date.now() + option.days * 86400000)
  return targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
})

const toastMessage = ref('')
let toastTimer = null

function triggerToast(msg) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

const goalProgressPercent = computed(() => {
  const target = comicStore.goal?.titlesGoal || 12
  if (!target || target === 0) return 0
  return Math.min(100, Math.round((doneCount.value / target) * 100))
})

function saveReadingGoal() {
  comicStore.goal = {
    ...comicStore.goal,
    titlesGoal: goalTitles.value,
    chaptersGoal: goalChapters.value,
    duration: selectedDuration.value,
    deadline: computedDeadlineDate.value
  }
  isGoalModalOpen.value = false
  triggerToast('GOAL SAVED!')
}

const STATUS_OPTIONS = ['ALL', 'READING', 'PLAN TO READ', 'COMPLETED', 'ON HOLD', 'DROPPED']
const TYPE_OPTIONS = ['ALL TYPES', 'MANGA', 'MANHWA', 'WEBTOON', 'COMIC', 'MANHUA', 'BOOK']

function getStatusPillClass(st) {
  switch (st) {
    case 'ALL': return 'pill-all'
    case 'READING': return 'pill-reading'
    case 'PLAN TO READ': return 'pill-planned'
    case 'COMPLETED': return 'pill-completed'
    case 'ON HOLD': return 'pill-hold'
    case 'DROPPED': return 'pill-dropped'
    default: return ''
  }
}

const newItem = reactive({
  title: '',
  type: 'Manga',
  status: 'Reading',
  chapter: 0,
  totalChapters: 0,
  rating: 8.5,
  cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
  publisher: 'Shueisha'
})

// Count statistics
const totalCount = computed(() => comicStore.entries.length)
const readingCount = computed(() => comicStore.entries.filter(e => e.status === 'Reading').length)
const doneCount = computed(() => comicStore.entries.filter(e => e.status === 'Completed').length)
const plannedCount = computed(() => comicStore.entries.filter(e => e.status === 'Plan to Read').length)
const onHoldCount = computed(() => comicStore.entries.filter(e => e.status === 'On Hold').length)
const droppedCount = computed(() => comicStore.entries.filter(e => e.status === 'Dropped').length)

const filteredEntries = computed(() => {
  return comicStore.entries.filter(item => {
    // Status filter
    const statusMap = {
      'ALL': null,
      'READING': 'Reading',
      'PLAN TO READ': 'Plan to Read',
      'COMPLETED': 'Completed',
      'ON HOLD': 'On Hold',
      'DROPPED': 'Dropped'
    }
    const targetStatus = statusMap[activeStatus.value]
    const matchesStatus = !targetStatus || item.status === targetStatus

    // Type filter
    const matchesType = activeType.value === 'ALL TYPES' || (item.type && item.type.toUpperCase() === activeType.value)

    // Search query filter
    const q = searchQuery.value.trim().toLowerCase()
    const matchesQuery = !q || item.title.toLowerCase().includes(q) || (item.publisher && item.publisher.toLowerCase().includes(q))

    return matchesStatus && matchesType && matchesQuery
  }).sort((a, b) => {
    if (sortBy.value === 'title') return a.title.localeCompare(b.title)
    if (sortBy.value === 'rating') return (b.rating || 0) - (a.rating || 0)
    if (sortBy.value === 'progress') return (b.chapter || 0) - (a.chapter || 0)
    return (b.lastReadAt || 0) - (a.lastReadAt || 0)
  })
})

function getBurstText(status) {
  switch (status) {
    case 'Reading': return 'POW!'
    case 'Completed': return 'KA-POW!'
    case 'Plan to Read': return 'ZAP!'
    case 'On Hold': return 'HMM...'
    case 'Dropped': return 'SPLAT!'
    default: return 'POW!'
  }
}

function getStatusThemeClass(status) {
  switch (status) {
    case 'Reading': return 'theme-reading'
    case 'Plan to Read': return 'theme-planned'
    case 'Completed': return 'theme-completed'
    case 'On Hold': return 'theme-hold'
    case 'Dropped': return 'theme-dropped'
    default: return 'theme-reading'
  }
}

function getProgressPercent(item) {
  if (!item.totalChapters || item.totalChapters === 0) return 10
  return Math.min(100, Math.round(((item.chapter || 0) / item.totalChapters) * 100))
}

function openDetail(item) {
  selectedItem.value = JSON.parse(JSON.stringify(item))
}

function saveDetail() {
  if (selectedItem.value) {
    comicStore.updateEntry(selectedItem.value.id, selectedItem.value)
    selectedItem.value = null
  }
}

function deleteSelected() {
  if (selectedItem.value) {
    comicStore.deleteEntry(selectedItem.value.id)
    selectedItem.value = null
  }
}

function submitAddTitle() {
  comicStore.addEntry(newItem)
  isAddModalOpen.value = false
  newItem.title = ''
  newItem.chapter = 0
  newItem.totalChapters = 0
}

const handleOpenAddModal = () => {
  isAddModalOpen.value = true
}

onMounted(() => {
  window.addEventListener('open-add-comic-modal', handleOpenAddModal)
})

onUnmounted(() => {
  window.removeEventListener('open-add-comic-modal', handleOpenAddModal)
})
</script>

<style scoped>
.shelf-page {
  min-height: 100vh;
  background-color: var(--f-bg);
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
  display: flex;
  flex-direction: column;
}
</style>
