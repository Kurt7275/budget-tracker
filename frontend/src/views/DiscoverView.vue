<template>
  <div class="discover-page">
    <Navbar />

    <main class="discover-main">
      <section class="discover-header">
        <div class="comic-badge-yellow" style="margin-bottom: 0.35rem;">EXPLORE &amp; CATALOG</div>
        <h1 class="discover-title">DISCOVER COMICS &amp; MANGA</h1>
        <p class="discover-sub">Explore curated popular titles across Marvel, DC, Shonen, Seinen &amp; Webtoons with 1-click addition to your shelf.</p>
      </section>

      <!-- Category Filter Pills -->
      <div class="format-pills-row">
        <button
          v-for="cat in ['All', 'Manga', 'Comic', 'Manhwa', 'Webtoon']"
          :key="cat"
          class="format-pill"
          :class="{ active: selectedCat === cat }"
          @click="selectedCat = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Discover Cards Grid -->
      <div class="discover-grid">
        <div
          v-for="comic in filteredCatalog"
          :key="comic.id"
          class="discover-card"
        >
          <div class="discover-cover-wrap">
            <img :src="comic.cover" :alt="comic.title" class="discover-cover-img" />
            <span class="discover-type-badge">{{ comic.type }}</span>
            <span class="discover-rating-badge">★ {{ comic.rating }}</span>
          </div>

          <div class="discover-card-body">
            <h3 class="discover-comic-title">{{ comic.title }}</h3>
            <div class="discover-publisher">{{ comic.publisher }} • {{ comic.chapters }} Chapters</div>
            <p class="discover-synopsis">{{ comic.synopsis }}</p>

            <button
              type="button"
              class="btn-add-discover"
              :class="{ added: isAlreadyInShelf(comic.title) }"
              @click="addToShelf(comic)"
            >
              {{ isAlreadyInShelf(comic.title) ? '✓ ON YOUR SHELF' : '+ ADD TO SHELF' }}
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
import { comicStore } from '../stores/useComicStore.js'

const selectedCat = ref('All')

const CATALOG = [
  {
    id: 'cat-1',
    title: 'Jujutsu Kaisen',
    type: 'Manga',
    chapters: 271,
    rating: 9.6,
    publisher: 'Shueisha',
    cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    synopsis: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself.'
  },
  {
    id: 'cat-2',
    title: 'Batman: The Long Halloween',
    type: 'Comic',
    chapters: 13,
    rating: 9.8,
    publisher: 'DC Comics',
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    synopsis: 'Batman tracks the mysterious serial killer known as Holiday who only murders on holidays.'
  },
  {
    id: 'cat-3',
    title: 'The Beginning After The End',
    type: 'Manhwa',
    chapters: 185,
    rating: 9.4,
    publisher: 'Tapas Media',
    cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    synopsis: 'King Grey has unrivaled strength, wealth, and prestige, yet solitude lingers closely behind.'
  },
  {
    id: 'cat-4',
    title: 'Invincible: Ultimate Collection',
    type: 'Comic',
    chapters: 144,
    rating: 9.7,
    publisher: 'Image Comics',
    cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
    synopsis: 'Mark Grayson is like most guys his age. Except his father is the most powerful superhero on the planet.'
  },
  {
    id: 'cat-5',
    title: 'Lore Olympus',
    type: 'Webtoon',
    chapters: 280,
    rating: 9.1,
    publisher: 'WEBTOON',
    cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
    synopsis: 'Scandalous gossip, wild parties, and forbidden love—witness what the gods do after dark.'
  },
  {
    id: 'cat-6',
    title: 'Berserk',
    type: 'Manga',
    chapters: 376,
    rating: 9.9,
    publisher: 'Hakusensha',
    cover: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=500&auto=format&fit=crop&q=80',
    synopsis: 'Guts, a former mercenary known as the Black Swordsman, is out for vengeance against the God Hand.'
  }
]

const filteredCatalog = computed(() => {
  if (selectedCat.value === 'All') return CATALOG
  return CATALOG.filter(c => c.type === selectedCat.value)
})

function isAlreadyInShelf(title) {
  return comicStore.entries.some(e => e.title.toLowerCase() === title.toLowerCase())
}

function addToShelf(comic) {
  if (isAlreadyInShelf(comic.title)) return
  comicStore.addEntry({
    title: comic.title,
    type: comic.type,
    status: 'Plan to Read',
    chapter: 0,
    totalChapters: comic.chapters,
    rating: comic.rating,
    cover: comic.cover,
    synopsis: comic.synopsis,
    publisher: comic.publisher
  })
}
</script>

<style scoped>
.discover-page {
  min-height: 100vh;
  background-color: var(--f-bg);
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
  display: flex;
  flex-direction: column;
}

.discover-main {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.discover-title {
  font-family: var(--font-comic);
  font-size: 2.8rem;
  line-height: 1;
  color: var(--f-text);
  letter-spacing: 0.04em;
}

.discover-sub {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: #666;
  margin-top: 0.25rem;
}

.format-pills-row {
  display: flex;
  gap: 0.5rem;
}

.format-pill {
  padding: 0.4rem 1.25rem;
  background: #FFF;
  border: 2.5px solid #111;
  border-radius: 4px;
  font-family: var(--font-comic);
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 2px 2px 0 #111;
  transition: all 100ms;
}

.format-pill.active {
  background: var(--f-yellow);
  transform: translateY(-2px);
  box-shadow: 3px 3px 0 #111;
}

.discover-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.discover-card {
  background: #FFF;
  border: 3px solid #111;
  border-radius: 6px;
  box-shadow: 4px 4px 0 #111;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 120ms;
}

.discover-card:hover {
  transform: translateY(-3px);
  box-shadow: 6px 6px 0 #111;
}

.discover-cover-wrap {
  position: relative;
  height: 200px;
  background: #111;
}

.discover-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discover-type-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #111;
  color: #FFF;
  font-family: var(--font-comic);
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  border: 1px solid #FFF;
}

.discover-rating-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--f-yellow);
  color: #111;
  font-family: var(--font-comic);
  font-size: 0.85rem;
  padding: 0.15rem 0.5rem;
  border: 1.5px solid #111;
  border-radius: 3px;
  box-shadow: 1.5px 1.5px 0 #111;
}

.discover-card-body {
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  justify-content: space-between;
}

.discover-comic-title {
  font-family: var(--font-comic);
  font-size: 1.35rem;
  color: #111;
}

.discover-publisher {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 700;
  color: #777;
}

.discover-synopsis {
  font-family: var(--font-body);
  font-size: 0.88rem;
  line-height: 1.45;
  color: #444;
  margin: 0.4rem 0;
}

.btn-add-discover {
  width: 100%;
  padding: 0.6rem;
  background: var(--f-red);
  color: #FFF;
  font-family: var(--font-comic);
  font-size: 1.15rem;
  letter-spacing: 0.05em;
  border: 2px solid #111;
  border-radius: 4px;
  box-shadow: 2px 2px 0 #111;
  cursor: pointer;
  transition: all 100ms;
}

.btn-add-discover:hover {
  background: var(--f-red-hover);
}

.btn-add-discover.added {
  background: #E8F8EE;
  color: #008738;
  border-color: #008738;
  cursor: default;
}
</style>
