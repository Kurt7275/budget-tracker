<template>
  <div class="shelf-page">
    <Navbar />

    <main class="shelf-main">

      <!-- ── Shelf Header Controls ── -->
      <section class="shelf-top-bar">
        <div>
          <div class="comic-badge-yellow" style="margin-bottom: 0.35rem;">MY COLLECTION</div>
          <h1 class="shelf-title">COMIC VAULT &amp; SHELF</h1>
        </div>

        <div class="shelf-action-buttons">
          <button type="button" class="btn-add-comic" @click="isAddModalOpen = true">
            <span>+ ADD TITLE</span>
          </button>
        </div>
      </section>

      <!-- ── Filter & Search Toolbar ── -->
      <div class="shelf-toolbar">

        <!-- Status Filter Tabs -->
        <div class="status-tabs-row">
          <button
            v-for="st in statusList"
            :key="st"
            type="button"
            class="status-tab-btn"
            :class="{ active: activeStatus === st }"
            @click="activeStatus = st"
          >
            {{ st }}
            <span class="tab-count-badge">{{ getCountForStatus(st) }}</span>
          </button>
        </div>

        <!-- Right: Search & View Modes -->
        <div class="toolbar-right">
          <div class="search-input-wrap">
            <input
              v-model="searchQuery"
              type="text"
              class="shelf-search-input"
              placeholder="Search by title, publisher, author…"
            />
          </div>

          <!-- View Mode Switcher -->
          <div class="view-mode-toggle">
            <button
              type="button"
              class="view-mode-btn"
              :class="{ active: viewMode === 'grid' }"
              title="Grid View"
              @click="viewMode = 'grid'"
            >
              ⊞ Grid
            </button>
            <button
              type="button"
              class="view-mode-btn"
              :class="{ active: viewMode === 'spines' }"
              title="Realistic Bookshelf View"
              @click="viewMode = 'spines'"
            >
              📚 Spines
            </button>
            <button
              type="button"
              class="view-mode-btn"
              :class="{ active: viewMode === 'list' }"
              title="List Table"
              @click="viewMode = 'list'"
            >
              ☰ List
            </button>
          </div>
        </div>

      </div>

      <!-- ── Empty State ── -->
      <div v-if="filteredEntries.length === 0" class="empty-shelf-box">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">📖</div>
        <h3 style="font-family: var(--font-comic); font-size: 1.6rem;">NO COMICS FOUND</h3>
        <p style="font-family: var(--font-body); font-size: 0.95rem; color: #666; margin-top: 0.25rem;">
          Try searching for a different title or click "+ Add Title" to add a new comic!
        </p>
      </div>

      <!-- ── 1. Grid View ── -->
      <div v-else-if="viewMode === 'grid'" class="comic-shelf-grid">
        <div
          v-for="item in filteredEntries"
          :key="item.id"
          class="shelf-comic-card"
        >
          <!-- Cover Art -->
          <div class="card-cover-container" @click="openDetail(item)">
            <img :src="item.cover" :alt="item.title" class="card-cover-img" />
            <span class="card-burst-tag" :class="getStatusClass(item.status)">
              {{ getBurstText(item.status) }}
            </span>
            <span class="card-type-tag">{{ item.type }}</span>
          </div>

          <!-- Card Content -->
          <div class="card-info-pane">
            <h3 class="card-comic-title" :title="item.title" @click="openDetail(item)">
              {{ item.title }}
            </h3>

            <div class="card-meta-line">
              <span class="card-publisher-txt">{{ item.publisher || 'Independent' }}</span>
              <span class="card-rating-stars">★ {{ item.rating || '—' }}</span>
            </div>

            <!-- Chapter Progress Bar -->
            <div class="card-ch-progress-wrap">
              <div class="ch-bar-track">
                <div
                  class="ch-bar-fill"
                  :style="{ width: getProgressPercent(item) + '%' }"
                ></div>
              </div>
              <span class="ch-count-txt">
                Ch. {{ item.chapter || 0 }}<span v-if="item.totalChapters"> / {{ item.totalChapters }}</span>
              </span>
            </div>

            <!-- Increment Controls -->
            <div class="card-controls-row">
              <div class="ch-inc-group">
                <button
                  type="button"
                  class="btn-ch-step"
                  title="Previous Chapter"
                  @click="comicStore.incrementChapter(item.id, -1)"
                >
                  −
                </button>
                <button
                  type="button"
                  class="btn-ch-step btn-ch-plus"
                  title="Next Chapter (+1)"
                  @click="comicStore.incrementChapter(item.id, 1)"
                >
                  +1 CH
                </button>
              </div>

              <button type="button" class="btn-card-edit" @click="openDetail(item)">
                ⚙ Edit
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- ── 2. Realistic 3D Bookshelf View ── -->
      <div v-else-if="viewMode === 'spines'" class="bookshelf-wood-unit">
        <div class="bookshelf-surface">
          <div
            v-for="item in filteredEntries"
            :key="item.id"
            class="book-spine-item"
            :style="{ '--spine-accent': getSpineColor(item.type) }"
            @click="openDetail(item)"
          >
            <div class="spine-strip"></div>
            <div class="spine-title-vertical">{{ item.title }}</div>
            <div class="spine-vol-tag">Ch.{{ item.chapter }}</div>
          </div>
        </div>
      </div>

      <!-- ── 3. List Table View ── -->
      <div v-else class="list-table-container">
        <table class="comic-table">
          <thead>
            <tr>
              <th style="width: 60px;">Cover</th>
              <th>Title</th>
              <th>Format</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Score</th>
              <th style="text-align: right;">Quick Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredEntries" :key="item.id">
              <td>
                <img :src="item.cover" :alt="item.title" class="table-cover-thumb" @click="openDetail(item)" />
              </td>
              <td>
                <strong class="table-title-link" @click="openDetail(item)">{{ item.title }}</strong>
                <div style="font-size: 0.8rem; color: #666;">{{ item.publisher }}</div>
              </td>
              <td>
                <span class="media-pill-badge" style="font-size: 0.75rem; padding: 0.15rem 0.45rem;">
                  {{ item.type }}
                </span>
              </td>
              <td>
                <span class="card-burst-tag" :class="getStatusClass(item.status)" style="position: static; transform: none; display: inline-block;">
                  {{ item.status }}
                </span>
              </td>
              <td>
                Ch. {{ item.chapter }}<span v-if="item.totalChapters"> / {{ item.totalChapters }}</span>
              </td>
              <td style="color: #FF8F00; font-weight: 700;">★ {{ item.rating || '—' }}</td>
              <td style="text-align: right;">
                <button
                  type="button"
                  class="btn-comic-yellow"
                  style="font-size: 0.85rem; padding: 0.25rem 0.65rem;"
                  @click="comicStore.incrementChapter(item.id, 1)"
                >
                  +1 CH
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </main>

    <!-- ── Modal: Comic Detail & Progress Editor ── -->
    <div v-if="selectedItem" class="f-modal-overlay" @click.self="selectedItem = null">
      <div class="f-modal-card" style="max-width: 540px;">
        <button type="button" class="f-modal-close" @click="selectedItem = null">✕</button>

        <div style="display: flex; gap: 1rem; margin-bottom: 1.25rem;">
          <img :src="selectedItem.cover" :alt="selectedItem.title" style="width: 90px; height: 130px; object-fit: cover; border: 2.5px solid #000; border-radius: 4px; box-shadow: 2px 2px 0 #000;" />
          <div>
            <span class="card-burst-tag" :class="getStatusClass(selectedItem.status)" style="position: static; transform: none; display: inline-block; margin-bottom: 0.35rem;">
              {{ selectedItem.status }}
            </span>
            <h2 style="font-family: var(--font-comic); font-size: 1.5rem; line-height: 1.15;">{{ selectedItem.title }}</h2>
            <div style="font-size: 0.85rem; color: #555; margin-top: 0.2rem;">{{ selectedItem.publisher }} • {{ selectedItem.type }}</div>
          </div>
        </div>

        <!-- Form fields inside detail -->
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
              🗑 Delete
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Modal: Add Custom Title ── -->
    <div v-if="isAddModalOpen" class="f-modal-overlay" @click.self="isAddModalOpen = false">
      <div class="f-modal-card" style="max-width: 520px;">
        <button type="button" class="f-modal-close" @click="isAddModalOpen = false">✕</button>
        
        <div style="text-align: center; margin-bottom: 1.25rem;">
          <div class="comic-badge-yellow" style="margin-bottom: 0.35rem;">CATALOG CREATOR</div>
          <h2 style="font-family: var(--font-comic); font-size: 1.8rem;">ADD TO YOUR SHELF</h2>
        </div>

        <form @submit.prevent="submitAddTitle" style="display: flex; flex-direction: column; gap: 0.85rem;">
          <div class="f-input-field">
            <label class="f-input-label">Title</label>
            <input v-model="newItem.title" type="text" class="f-input-box" placeholder="e.g. Jujutsu Kaisen" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="f-input-field">
              <label class="f-input-label">Format</label>
              <select v-model="newItem.type" class="f-input-box">
                <option>Manga</option>
                <option>Comic</option>
                <option>Manhwa</option>
                <option>Webtoon</option>
                <option>Light Novel</option>
              </select>
            </div>

            <div class="f-input-field">
              <label class="f-input-label">Status</label>
              <select v-model="newItem.status" class="f-input-box">
                <option>Reading</option>
                <option>Plan to Read</option>
                <option>Completed</option>
                <option>On Hold</option>
                <option>Dropped</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="f-input-field">
              <label class="f-input-label">Current Chapter</label>
              <input v-model.number="newItem.chapter" type="number" min="0" class="f-input-box" />
            </div>
            <div class="f-input-field">
              <label class="f-input-label">Total Chapters</label>
              <input v-model.number="newItem.totalChapters" type="number" min="0" class="f-input-box" />
            </div>
          </div>

          <div class="f-input-field">
            <label class="f-input-label">Cover Image URL</label>
            <input v-model="newItem.cover" type="url" class="f-input-box" placeholder="https://..." />
          </div>

          <button type="submit" class="btn-comic-red" style="margin-top: 0.5rem;">
            ADD TO SHELF
          </button>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import { comicStore } from '../stores/useComicStore.js'

const activeStatus = ref('All')
const searchQuery = ref('')
const viewMode = ref('grid') // 'grid' | 'spines' | 'list'
const selectedItem = ref(null)
const isAddModalOpen = ref(false)

const statusList = ['All', 'Reading', 'Plan to Read', 'Completed', 'On Hold', 'Dropped']

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

const filteredEntries = computed(() => {
  return comicStore.entries.filter(item => {
    const matchesStatus = activeStatus.value === 'All' || item.status === activeStatus.value
    const matchesQuery = !searchQuery.value.trim() ||
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (item.publisher && item.publisher.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchesStatus && matchesQuery
  })
})

function getCountForStatus(status) {
  if (status === 'All') return comicStore.entries.length
  return comicStore.entries.filter(e => e.status === status).length
}

function getBurstText(status) {
  switch (status) {
    case 'Reading': return 'POW!'
    case 'Completed': return 'KAPOW!'
    case 'Plan to Read': return 'ZAP!'
    case 'On Hold': return 'HMM...'
    case 'Dropped': return 'SPLAT!'
    default: return 'BAM!'
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'Reading': return 'reading'
    case 'Completed': return 'completed'
    case 'Plan to Read': return 'plan'
    default: return 'reading'
  }
}

function getProgressPercent(item) {
  if (!item.totalChapters || item.totalChapters === 0) return 10
  return Math.min(100, Math.round(((item.chapter || 0) / item.totalChapters) * 100))
}

function getSpineColor(type) {
  switch (type) {
    case 'Manga': return '#FF1744'
    case 'Manhwa': return '#AA00FF'
    case 'Comic': return '#2979FF'
    case 'Webtoon': return '#00C853'
    default: return '#FFD600'
  }
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

.shelf-main {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.shelf-top-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.shelf-title {
  font-family: var(--font-comic);
  font-size: 2.8rem;
  line-height: 1;
  color: var(--f-text);
  letter-spacing: 0.04em;
}

.btn-add-comic {
  background: var(--f-red);
  color: #FFF;
  font-family: var(--font-comic);
  font-size: 1.2rem;
  letter-spacing: 0.05em;
  padding: 0.6rem 1.5rem;
  border: 3px solid #111;
  border-radius: 4px;
  box-shadow: 3px 3px 0 #111;
  cursor: pointer;
  transition: all 100ms;
}

.btn-add-comic:hover {
  background: var(--f-red-hover);
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 #111;
}

/* Toolbar */
.shelf-toolbar {
  background: #FFF;
  border: 3px solid #111;
  border-radius: 6px;
  box-shadow: 4px 4px 0 #111;
  padding: 0.85rem 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.status-tabs-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.status-tab-btn {
  padding: 0.35rem 0.75rem;
  background: var(--f-bg);
  border: 2px solid #111;
  border-radius: 4px;
  font-family: var(--font-comic);
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 100ms;
}

.status-tab-btn.active {
  background: var(--f-yellow);
  color: #111;
  box-shadow: 2px 2px 0 #111;
  transform: translateY(-1px);
}

.tab-count-badge {
  background: #111;
  color: #FFF;
  font-size: 0.75rem;
  padding: 0.05rem 0.35rem;
  border-radius: 3px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.shelf-search-input {
  height: 38px;
  padding: 0 0.85rem;
  background: var(--f-bg);
  border: 2px solid #111;
  border-radius: 4px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 700;
  min-width: 240px;
  outline: none;
}

.view-mode-toggle {
  display: flex;
  border: 2px solid #111;
  border-radius: 4px;
  overflow: hidden;
}

.view-mode-btn {
  padding: 0.4rem 0.65rem;
  background: var(--f-bg);
  border: none;
  border-right: 2px solid #111;
  font-family: var(--font-comic);
  font-size: 0.95rem;
  cursor: pointer;
}
.view-mode-btn:last-child { border-right: none; }
.view-mode-btn.active {
  background: var(--f-yellow);
}

/* Grid */
.comic-shelf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.5rem;
}

.shelf-comic-card {
  background: #FFF;
  border: 3px solid #111;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 4px 4px 0 #111;
  display: flex;
  flex-direction: column;
  transition: transform 120ms, box-shadow 120ms;
}

.shelf-comic-card:hover {
  transform: translateY(-4px);
  box-shadow: 6px 6px 0 #111;
}

.card-cover-container {
  position: relative;
  height: 250px;
  cursor: pointer;
  background: #111;
}

.card-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-burst-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  font-family: var(--font-comic);
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  border: 2px solid #111;
  border-radius: 3px;
  box-shadow: 1.5px 1.5px 0 #111;
  transform: rotate(3deg);
}

.card-burst-tag.reading { background: #00C853; color: #000; }
.card-burst-tag.completed { background: #AA00FF; color: #FFF; }
.card-burst-tag.plan { background: #2979FF; color: #FFF; }

.card-type-tag {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: #FFF;
  font-family: var(--font-comic);
  font-size: 0.75rem;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  border: 1px solid #FFF;
}

.card-info-pane {
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  justify-content: space-between;
}

.card-comic-title {
  font-family: var(--font-comic);
  font-size: 1.25rem;
  color: #111;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-comic-title:hover {
  color: var(--f-red);
}

.card-meta-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 700;
  color: #666;
}

.card-rating-stars {
  color: #FF8F00;
  font-weight: 700;
}

.card-ch-progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0.2rem 0;
}

.ch-bar-track {
  height: 6px;
  background: #E0E0E0;
  border: 1.5px solid #111;
  border-radius: 2px;
  overflow: hidden;
}

.ch-bar-fill {
  height: 100%;
  background: var(--f-red);
}

.ch-count-txt {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 700;
  color: #444;
}

.card-controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.ch-inc-group {
  display: flex;
  gap: 0.25rem;
}

.btn-ch-step {
  padding: 0.2rem 0.55rem;
  background: var(--f-bg);
  border: 1.5px solid #111;
  border-radius: 3px;
  font-family: var(--font-comic);
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 1px 1px 0 #111;
}

.btn-ch-plus {
  background: var(--f-yellow);
  font-weight: 700;
}

.btn-card-edit {
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 700;
  color: #777;
  cursor: pointer;
}
.btn-card-edit:hover { color: #111; text-decoration: underline; }

/* 3D Bookshelf */
.bookshelf-wood-unit {
  background: #5D4037;
  border: 4px solid #111;
  border-radius: 8px;
  padding: 1.5rem 1.25rem 0.5rem;
  box-shadow: 6px 6px 0 #111;
}

.bookshelf-surface {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
  border-bottom: 12px solid #3E2723;
}

.book-spine-item {
  width: 44px;
  height: 240px;
  background: var(--spine-accent, #FF1744);
  border: 2.5px solid #111;
  border-radius: 3px;
  box-shadow: 3px 0 0 rgba(0, 0, 0, 0.4);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.75rem 0.2rem;
  transition: transform 150ms ease;
  user-select: none;
}

.book-spine-item:hover {
  transform: translateY(-20px);
}

.spine-title-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-family: var(--font-comic);
  font-size: 1.05rem;
  color: #FFF;
  letter-spacing: 0.05em;
  text-shadow: 1px 1px 0 #000;
  white-space: nowrap;
  overflow: hidden;
  max-height: 160px;
}

.spine-vol-tag {
  font-family: var(--font-comic);
  font-size: 0.75rem;
  background: #FFF;
  color: #000;
  padding: 0.1rem 0.2rem;
  border: 1.5px solid #111;
  text-align: center;
  border-radius: 2px;
}

/* List Table */
.list-table-container {
  background: #FFF;
  border: 3px solid #111;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 4px 4px 0 #111;
}

.comic-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.comic-table th {
  background: var(--f-frame-bg);
  border-bottom: 2px solid #111;
  padding: 0.75rem 1rem;
  font-family: var(--font-comic);
  font-size: 1.1rem;
}

.comic-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1.5px solid #EEE;
  font-family: var(--font-body);
  font-size: 0.95rem;
  vertical-align: middle;
}

.table-cover-thumb {
  width: 44px;
  height: 60px;
  object-fit: cover;
  border: 1.5px solid #111;
  border-radius: 3px;
  cursor: pointer;
}

.table-title-link {
  font-family: var(--font-comic);
  font-size: 1.15rem;
  cursor: pointer;
}
.table-title-link:hover { color: var(--f-red); }

.empty-shelf-box {
  background: #FFF;
  border: 3px dashed #111;
  border-radius: 8px;
  padding: 4rem 1.5rem;
  text-align: center;
}
</style>
