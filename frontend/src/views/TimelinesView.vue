<template>
  <div class="timelines-page">
    <Navbar />

    <main class="timelines-main">
      <section class="timelines-header">
        <div class="comic-badge-yellow" style="margin-bottom: 0.35rem;">CHRONOLOGIES &amp; ORDERS</div>
        <h1 class="timelines-title">UNIVERSE READING ORDERS</h1>
        <p class="timelines-sub">Interactive checklists for the most iconic storylines, events, and universe sagas in comic book history.</p>
      </section>

      <!-- Timeline Tabs -->
      <div class="timeline-tabs-row">
        <button
          v-for="(tl, key) in TIMELINES"
          :key="key"
          class="timeline-tab-btn"
          :class="{ active: selectedKey === key }"
          @click="selectedKey = key"
        >
          {{ tl.name }}
        </button>
      </div>

      <!-- Active Timeline Journey Card -->
      <div class="timeline-content-card">
        <div class="timeline-meta-bar">
          <div>
            <h2 style="font-family: var(--font-comic); font-size: 2rem;">{{ activeTimeline.name }}</h2>
            <p style="font-family: var(--font-body); font-size: 0.95rem; font-weight: 700; color: #666; margin-top: 0.2rem;">
              {{ activeTimeline.desc }}
            </p>
          </div>

          <div class="timeline-progress-pill">
            <span style="font-family: var(--font-comic); font-size: 1.4rem; color: var(--f-red);">
              {{ getCompletedCount(selectedKey) }} / {{ activeTimeline.items.length }}
            </span>
            <span style="font-family: var(--font-body); font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Issues Read</span>
          </div>
        </div>

        <!-- Timeline Steps List -->
        <div class="timeline-steps-stack">
          <div
            v-for="(step, idx) in activeTimeline.items"
            :key="idx"
            class="timeline-step-row"
            :class="{ completed: isStepDone(selectedKey, idx) }"
            @click="toggleStep(selectedKey, idx)"
          >
            <div class="step-check-box">
              <span v-if="isStepDone(selectedKey, idx)">✓</span>
            </div>

            <div class="step-info-col">
              <div class="step-num-pill">Step {{ idx + 1 }} • {{ step.era }}</div>
              <h4 class="step-title-txt">{{ step.title }}</h4>
              <p class="step-sub-txt">{{ step.desc }}</p>
            </div>

            <div class="step-right-badge">
              <span class="card-burst-tag" :class="isStepDone(selectedKey, idx) ? 'completed' : 'reading'">
                {{ isStepDone(selectedKey, idx) ? 'READ' : 'QUEUED' }}
              </span>
            </div>
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

const selectedKey = ref('batman')

const TIMELINES = {
  batman: {
    name: 'DC: Batman Modern Saga',
    desc: 'The definitive reading order for modern Batman from Year One to Court of Owls and Dark Nights Metal.',
    items: [
      { title: 'Batman: Year One (1987)', era: 'Origin', desc: 'Frank Miller & David Mazzucchelli craft the iconic origin of the Dark Knight.' },
      { title: 'Batman: The Long Halloween (1996)', era: 'Early Career', desc: 'A year-long mystery hunting down the serial killer known as Holiday.' },
      { title: 'Batman: The Killing Joke (1988)', era: 'Classic Rivalry', desc: 'Alan Moore’s definitive psychological battle between Batman & The Joker.' },
      { title: 'Batman: Hush (2002)', era: 'Modern Era', desc: 'A mysterious stalker manipulates Gotham’s rogue gallery against Bruce Wayne.' },
      { title: 'Batman: Court of Owls (2011)', era: 'New 52', desc: 'Scott Snyder unleashes Gotham’s secret ruling shadow society.' },
      { title: 'Dark Nights: Metal (2017)', era: 'Multiverse Crisis', desc: 'The Dark Multiverse invades Prime Earth led by The Batman Who Laughs.' }
    ]
  },
  marvel: {
    name: 'Marvel: Modern Cosmic & Events',
    desc: 'The greatest Marvel crossover comic storylines that redefined the Marvel Universe.',
    items: [
      { title: 'The Infinity Gauntlet (1991)', era: 'Cosmic War', desc: 'Thanos collects all six Infinity Gems to court Mistress Death.' },
      { title: 'Civil War (2006)', era: 'Earth Crisis', desc: 'Iron Man & Captain America clash over the Superhuman Registration Act.' },
      { title: 'Planet Hulk & World War Hulk (2007)', era: 'Revenge Saga', desc: 'Exiled to Sakaar, Hulk returns with an alien army seeking retribution.' },
      { title: 'Spider-Verse (2014)', era: 'Spider-Man', desc: 'Every Spider-Totem across the multiverse unites against the Inheritors.' },
      { title: 'Secret Wars (2015)', era: 'Multiverse Collapse', desc: 'Jonathan Hickman’s climax destroying and rebuilding the Marvel Multiverse.' }
    ]
  },
  onepiece: {
    name: 'One Piece: Epic Sagas Chronology',
    desc: 'Eiichiro Oda’s generational pirate journey mapped across major storylines.',
    items: [
      { title: 'East Blue Saga (Ch. 1 - 100)', era: 'The Journey Begins', desc: 'Luffy gathers Zoro, Nami, Usopp, and Sanji before heading to the Grand Line.' },
      { title: 'Alabasta Saga (Ch. 101 - 217)', era: 'Desert Rebellion', desc: 'The Straw Hats stop Crocodile and the Baroque Works conspiracy.' },
      { title: 'Water 7 & Enies Lobby (Ch. 322 - 441)', era: 'Peak Shonen', desc: 'Declaring war on the World Government to rescue Nico Robin.' },
      { title: 'Summit War / Marineford (Ch. 490 - 597)', era: 'World At War', desc: 'The historic clash between Whitebeard’s fleet and Navy Headquarters.' },
      { title: 'Wano Country Saga (Ch. 909 - 1057)', era: 'Four Emperors War', desc: 'Luffy battles Kaido atop Onigashima to awaken Sun God Nika.' },
      { title: 'Final Saga / Egghead (Ch. 1058 - Present)', era: 'The Truth of the World', desc: 'Dr. Vegapunk and the Void Century secrets rock the entire globe.' }
    ]
  }
}

const activeTimeline = computed(() => TIMELINES[selectedKey.value])

function isStepDone(tlKey, idx) {
  return !!comicStore.timelineProgress[`${tlKey}_${idx}`]
}

function getCompletedCount(tlKey) {
  const items = TIMELINES[tlKey].items
  return items.filter((_, idx) => isStepDone(tlKey, idx)).length
}

function toggleStep(tlKey, idx) {
  const k = `${tlKey}_${idx}`
  comicStore.timelineProgress[k] = !comicStore.timelineProgress[k]
  localStorage.setItem('comicshelf-timeline-progress', JSON.stringify(comicStore.timelineProgress))
  if (comicStore.timelineProgress[k]) {
    comicStore.addXp(25)
  }
}
</script>

<style scoped>
.timelines-page {
  min-height: 100vh;
  background-color: var(--f-bg);
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
  display: flex;
  flex-direction: column;
}

.timelines-main {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timelines-title {
  font-family: var(--font-comic);
  font-size: 2.8rem;
  line-height: 1;
  color: var(--f-text);
  letter-spacing: 0.04em;
}

.timelines-sub {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: #666;
  margin-top: 0.25rem;
}

.timeline-tabs-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.timeline-tab-btn {
  padding: 0.5rem 1.25rem;
  background: #FFF;
  border: 2.5px solid #111;
  border-radius: 4px;
  font-family: var(--font-comic);
  font-size: 1.15rem;
  cursor: pointer;
  box-shadow: 2px 2px 0 #111;
  transition: all 100ms;
}

.timeline-tab-btn.active {
  background: var(--f-yellow);
  transform: translateY(-2px);
  box-shadow: 3px 3px 0 #111;
}

.timeline-content-card {
  background: #FFF;
  border: 3px solid #111;
  border-radius: 8px;
  box-shadow: 6px 6px 0 #111;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.timeline-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #EEE;
  padding-bottom: 1rem;
  gap: 1rem;
}

.timeline-progress-pill {
  background: var(--f-bg);
  border: 2px solid #111;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 2px 0 #111;
}

.timeline-steps-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.timeline-step-row {
  background: var(--f-bg);
  border: 2px solid #111;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  box-shadow: 2px 2px 0 #111;
  transition: all 120ms;
}

.timeline-step-row:hover {
  transform: translateX(4px);
  background: #FFF;
}

.timeline-step-row.completed {
  background: #E8F8EE;
  border-color: #008738;
}

.step-check-box {
  width: 32px;
  height: 32px;
  border: 2.5px solid #111;
  border-radius: 4px;
  background: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-comic);
  font-size: 1.4rem;
  color: #008738;
  flex-shrink: 0;
}

.timeline-step-row.completed .step-check-box {
  background: #00C853;
  color: #000;
}

.step-info-col {
  flex: 1;
}

.step-num-pill {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  color: #777;
  text-transform: uppercase;
}

.step-title-txt {
  font-family: var(--font-comic);
  font-size: 1.25rem;
  color: #111;
}

.step-sub-txt {
  font-family: var(--font-body);
  font-size: 0.88rem;
  color: #555;
  font-weight: 700;
  margin-top: 0.15rem;
}
</style>
