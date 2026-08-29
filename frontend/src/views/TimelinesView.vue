<template>
  <div class="tl-page">
    <Navbar />

    <main class="tl-main">

      <!-- SELECT UNIVERSE Label -->
      <div class="tl-universe-label">SELECT UNIVERSE</div>

      <!-- Universe Selector Pills with Category Color Coding -->
      <div class="tl-universe-bar">
        <button
          v-for="(tl, key) in TIMELINES"
          :key="key"
          type="button"
          class="tl-universe-pill"
          :class="[
            getUniverseThemeClass(key),
            { active: selectedKey === key }
          ]"
          @click="selectedKey = key; expandedIdx = null; filterType = 'ALL'; searchQ = ''"
        >
          <span class="tl-pill-icon" v-html="UNIVERSE_ICONS[key]"></span>
          {{ tl.shortName }}
        </button>
      </div>

      <!-- Filters Row: Type Pills + Search + Share -->
      <div class="tl-filters-row">
        <div class="tl-type-pills">
          <button
            v-for="t in availableTypes"
            :key="t"
            type="button"
            class="tl-type-pill"
            :class="[
              t === 'MOVIE' ? 'type-pill-movie' :
              t === 'SHOW' ? 'type-pill-show' :
              t === 'COMIC' ? 'type-pill-comic' :
              t === 'MANGA' ? 'type-pill-manga' :
              t === 'BOOK' ? 'type-pill-book' : '',
              { active: filterType === t }
            ]"
            @click="filterType = t"
          >{{ t }}</button>
        </div>

        <div class="tl-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input v-model="searchQ" type="text" class="tl-search-input" placeholder="SEARCH..." />
        </div>

        <button type="button" class="tl-share-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          SHARE
        </button>
      </div>

      <!-- Phase Groups Container -->
      <div class="tl-groups-wrap fade-in-contents">
        <section
          v-for="group in filteredGrouped"
          :key="group.name"
          class="tl-phase-group"
          :class="activeTimelineTheme"
        >
          <!-- Phase Header -->
          <div class="tl-phase-header" @click="toggleGroup(group.name)">
            <div class="tl-phase-title">
              <span class="tl-arrow-indicator">▶</span>
              <span class="tl-phase-text">{{ group.name }}</span>
            </div>
            <div class="tl-phase-right">
              <span class="tl-phase-counter">{{ getGroupDone(group) }}/{{ group.items.length }} WATCHED</span>
              <span class="tl-phase-toggle-icon">{{ collapsedGroups.has(group.name) ? '▼' : '▲' }}</span>
            </div>
          </div>

          <!-- Phase Rows Container with Timeline Track -->
          <div v-if="!collapsedGroups.has(group.name)" class="tl-phase-body">
            <!-- Timeline vertical track line -->
            <div class="tl-vertical-track"></div>

            <div
              v-for="step in group.items"
              :key="step.originalIdx"
              class="tl-step-entry"
            >
              <!-- Timeline node on the left track -->
              <div class="tl-track-node">
                <div
                  class="tl-node-circle"
                  :class="[
                    'node-' + getFormatType(step.format),
                    {
                      'node-done': isDone(step.originalIdx),
                      'node-active': expandedIdx === step.originalIdx && !isDone(step.originalIdx)
                    }
                  ]"
                >
                  <span v-if="isDone(step.originalIdx)" class="node-check">✓</span>
                  <span v-else-if="expandedIdx === step.originalIdx" class="node-dot"></span>
                </div>
                <span class="tl-node-year">{{ step.year }}</span>
              </div>

              <!-- Main Card Container -->
              <div
                class="tl-item-card"
                :class="{
                  'card-expanded': expandedIdx === step.originalIdx,
                  'card-done': isDone(step.originalIdx)
                }"
              >
                <!-- Row Main Bar -->
                <div
                  class="tl-card-header"
                  role="button"
                  tabindex="0"
                  :aria-expanded="expandedIdx === step.originalIdx"
                  @click="toggleExpanded(step.originalIdx)"
                  @keydown.enter.prevent="toggleExpanded(step.originalIdx)"
                  @keydown.space.prevent="toggleExpanded(step.originalIdx)"
                >
                  <div class="tl-card-left">
                    <span class="tl-media-badge" :class="'badge-' + getFormatType(step.format)">
                      <!-- Shape indicator icon -->
                      <span class="badge-shape-icon" :class="'shape-' + getFormatShape(step.format)"></span>
                      {{ getFormatLabel(step.format) }}
                    </span>
                    <h3 class="tl-item-title" :class="{ 'title-done': isDone(step.originalIdx) }">
                      {{ step.title }}
                    </h3>
                    <span v-if="step.detail" class="tl-item-detail">{{ step.detail }}</span>
                  </div>

                  <div class="tl-card-right">
                    <!-- Checkmark Toggle Circle -->
                    <button
                      type="button"
                      class="tl-action-check-circle"
                      :class="{ checked: isDone(step.originalIdx) }"
                      :aria-label="isDone(step.originalIdx) ? `Mark ${step.title} as unwatched` : `Mark ${step.title} as watched`"
                      @click.stop="toggleStep(step.originalIdx, step)"
                    >
                      <svg v-if="isDone(step.originalIdx)" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>

                    <!-- Expand Triangle Indicator -->
                    <button
                      type="button"
                      class="tl-action-expand-triangle"
                      :class="{ expanded: expandedIdx === step.originalIdx }"
                      :aria-label="expandedIdx === step.originalIdx ? `Collapse ${step.title}` : `Expand ${step.title}`"
                      @click.stop="toggleExpanded(step.originalIdx)"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                <!-- Expanded Content Panel -->
                <div v-if="expandedIdx === step.originalIdx" class="tl-card-detail">
                  <h4 class="tl-detail-heading">{{ step.title }}</h4>
                  <div class="tl-detail-sub">{{ step.year }} • {{ group.name }}</div>
                  
                  <div v-if="step.desc" class="tl-detail-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tl-note-icon">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    <span>{{ step.desc }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Empty state -->
        <div v-if="filteredGrouped.length === 0" class="tl-empty">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C4C4C4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>No entries found for "{{ searchQ }}"</p>
        </div>
      </div>

      <!-- Format Color Legend Bar at Very Bottom -->
      <div class="tl-legend-footer">
        <div class="tl-legend-item">
          <span class="legend-shape shape-circle bg-movie"></span>
          <span class="legend-label">MOVIE</span>
        </div>
        <div class="tl-legend-item">
          <span class="legend-shape shape-square bg-show"></span>
          <span class="legend-label">SHOW</span>
        </div>
        <div class="tl-legend-item">
          <span class="legend-shape shape-diamond bg-book"></span>
          <span class="legend-label">BOOK</span>
        </div>
        <div class="tl-legend-item">
          <span class="legend-shape shape-diamond bg-manga"></span>
          <span class="legend-label">MANGA</span>
        </div>
        <div class="tl-legend-item">
          <span class="legend-shape shape-square bg-comic"></span>
          <span class="legend-label">COMIC</span>
        </div>
      </div>

    </main>

    <!-- Toast Notification -->
    <transition name="tl-toast">
      <div v-if="toast" class="tl-toast-banner" role="status">
        <div class="tl-toast-check">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="tl-toast-msg">{{ toast }}</span>
        <button type="button" class="tl-toast-x" @click="toast = null">✕</button>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import Navbar from '../components/Navbar.vue'
import { comicStore } from '../stores/useComicStore.js'

const selectedKey = ref('mcu')
const filterType = ref('ALL')
const searchQ = ref('')
const expandedIdx = ref(null)
const collapsedGroups = ref(new Set())
const toast = ref(null)
let toastTimer = null

const UNIVERSE_ICONS = {
  mcu: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  dcau: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6 2 3 7 3 12s3 9 9 9c4 0 6-2 7-5-1 1-3 1-4 0-2-1-2-3-1-5 1-3 4-4 7-3-1-5-4-6-9-6z"/></svg>`,
  onepiece: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
  naruto: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  aot: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 9H17v1.5c0 .83-.67 1.5-1.5 1.5S14 11.33 14 10.5 14.67 9 15.5 9z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 15H7v-1.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`,
  marvel: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  dragonball: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>`,
  godzilla: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l4-8 3 5 2-3 4 6H3z"/><path d="M21 6l-3 3"/><path d="M18 3l-1 4"/><path d="M21 10l-4-1"/></svg>`,
}

const TIMELINES = {
  mcu: {
    shortName: 'MCU',
    publisher: 'Marvel Studios',
    items: [
      // PHASE 1
      { title: 'IRON MAN', year: '2008', part: 'PHASE 1', format: 'Movie', desc: 'Tony Stark builds the first Iron Man armor and launches the Marvel Cinematic Universe.' },
      { title: 'THE INCREDIBLE HULK', year: '2008', part: 'PHASE 1', format: 'Movie', desc: 'Bruce Banner struggles to control the Hulk while being hunted by General Thaddeus Ross.' },
      { title: 'IRON MAN 2', year: '2010', part: 'PHASE 1', format: 'Movie', desc: 'Tony Stark faces new enemies and the growing dangers of the Iron Man technology.' },
      { title: 'CAPTAIN AMERICA: THE FIRST AVENGER', year: '2011', part: 'PHASE 1', format: 'Movie', desc: 'Set during WWII, MCU starting point in-universe.' },
      { title: 'THOR', year: '2011', part: 'PHASE 1', format: 'Movie', desc: 'The arrogant Thor is banished to Earth and learns humility while his brother Loki schemes.' },
      { title: 'THE AVENGERS', year: '2012', part: 'PHASE 1', format: 'Movie', desc: 'Earth\'s mightiest heroes assemble to stop Loki and the Chitauri invasion of New York.' },

      // PHASE 2
      { title: 'THOR: THE DARK WORLD', year: '2013', part: 'PHASE 2', format: 'Movie', desc: 'Thor faces the Dark Elves led by Malekith who wield the deadly Aether.' },
      { title: 'IRON MAN 3', year: '2013', part: 'PHASE 2', format: 'Movie', desc: 'Tony Stark faces the Mandarin threat while struggling with PTSD after the Battle of New York.' },
      { title: 'CAPTAIN AMERICA: THE WINTER SOLDIER', year: '2014', part: 'PHASE 2', format: 'Movie', desc: 'Steve Rogers uncovers a massive conspiracy within SHIELD while facing a ghost from his past.' },
      { title: 'GUARDIANS OF THE GALAXY', year: '2014', part: 'PHASE 2', format: 'Movie', desc: 'A ragtag group of cosmic misfits unite to stop Ronan from destroying an entire planet.' },
      { title: 'AVENGERS: AGE OF ULTRON', year: '2015', part: 'PHASE 2', format: 'Movie', desc: 'Tony Stark\'s peacekeeping AI goes rogue, forcing the Avengers to confront their own hubris.' },
      { title: 'ANT-MAN', year: '2015', part: 'PHASE 2', format: 'Movie', desc: 'Scott Lang becomes the new Ant-Man and must pull off a heist to save the world.' },

      // PHASE 3
      { title: 'CAPTAIN AMERICA: CIVIL WAR', year: '2016', part: 'PHASE 3', format: 'Movie', desc: 'The Sokovia Accords divide the Avengers and introduce Black Panther and Spider-Man.' },
      { title: 'DOCTOR STRANGE', year: '2016', part: 'PHASE 3', format: 'Movie', desc: 'Stephen Strange discovers the mystic arts after a car crash ends his surgical career.' },
      { title: 'GUARDIANS OF THE GALAXY VOL. 2', year: '2017', part: 'PHASE 3', format: 'Movie', desc: 'Star-Lord meets his celestial father Ego while the Guardians face family dynamics.' },
      { title: 'SPIDER-MAN: HOMECOMING', year: '2017', part: 'PHASE 3', format: 'Movie', desc: 'Peter Parker balances high school life with taking down the Vulture.' },
      { title: 'THOR: RAGNAROK', year: '2017', part: 'PHASE 3', format: 'Movie', desc: 'Imprisoned on Sakaar, Thor must race against time to stop Hela from destroying Asgard.' },
      { title: 'BLACK PANTHER', year: '2018', part: 'PHASE 3', format: 'Movie', desc: 'T\'Challa returns to Wakanda and must fight to protect his people and the throne.' },
      { title: 'ANT-MAN AND THE WASP', year: '2018', part: 'PHASE 3', format: 'Movie', desc: 'Scott Lang and Hope van Dyne venture into the Quantum Realm to rescue Janet.' },
      { title: 'AVENGERS: INFINITY WAR', year: '2018', part: 'PHASE 3', format: 'Movie', desc: 'Thanos completes the Infinity Gauntlet and devastates the universe with the Snap.' },
      { title: 'CAPTAIN MARVEL', year: '2019', part: 'PHASE 3', format: 'Movie', desc: 'Set in 1995, Carol Danvers uncovers her past during a galactic war.' },
      { title: 'AVENGERS: ENDGAME', year: '2019', part: 'PHASE 3', format: 'Movie', desc: 'The surviving Avengers travel through time to undo the Blip and close the Infinity Saga.' },

      // PHASE 4
      { title: 'BLACK WIDOW', year: '2021', part: 'PHASE 4', format: 'Movie', desc: 'Set just after Civil War, Natasha Romanoff confronts the darkest parts of her ledger.' },
      { title: 'LOKI', year: '2021', part: 'PHASE 4', format: 'Show', desc: 'A Loki variant discovers the TVA and cracks open the multiverse timeline.' },
      { title: 'WANDAVISION', year: '2021', part: 'PHASE 4', format: 'Show', desc: 'Wanda Maximoff reshapes grief and reality inside a mysterious sitcom-inspired pocket world.' },
      { title: 'THE FALCON AND THE WINTER SOLDIER', year: '2021', part: 'PHASE 4', format: 'Show', desc: 'Sam Wilson and Bucky Barnes team up to honor Captain America\'s legacy.' },
      { title: 'SHANG-CHI AND THE LEGEND OF THE TEN RINGS', year: '2021', part: 'PHASE 4', format: 'Movie', desc: 'Shang-Chi confronts the Ten Rings organization and his formidable father.' },
      { title: 'ETERNALS', year: '2021', part: 'PHASE 4', format: 'Movie', desc: 'Ancient immortal beings emerge after millennia to protect Earth from Deviants.' },
      { title: 'HAWKEYE', year: '2021', part: 'PHASE 4', format: 'Show', desc: 'Clint Barton teams up with young archer Kate Bishop during the holiday season in NYC.' },
      { title: 'SPIDER-MAN: NO WAY HOME', year: '2021', part: 'PHASE 4', format: 'Movie', desc: 'Peter Parker\'s identity crisis shatters the multiverse.' },
      { title: 'MOON KNIGHT', year: '2022', part: 'PHASE 4', format: 'Show', desc: 'Steven Grant discovers he shares a body with mercenary Marc Spector and Egyptian gods.' },
      { title: 'DOCTOR STRANGE IN THE MULTIVERSE OF MADNESS', year: '2022', part: 'PHASE 4', format: 'Movie', desc: 'Strange and America Chavez traverse alternate realities to face a tragic threat.' },
      { title: 'MS. MARVEL', year: '2022', part: 'PHASE 4', format: 'Show', desc: 'Kamala Khan, a Jersey City super-fan, gains cosmic light-manipulation powers.' },
      { title: 'THOR: LOVE AND THUNDER', year: '2022', part: 'PHASE 4', format: 'Movie', desc: 'Thor teams up with Mighty Thor Jane Foster to stop Gorr the God Butcher.' },
      { title: 'SHE-HULK: ATTORNEY AT LAW', year: '2022', part: 'PHASE 4', format: 'Show', desc: 'Jennifer Walters navigates life as a 6-foot-7 green attorney specializing in superhuman law.' },
      { title: 'BLACK PANTHER: WAKANDA FOREVER', year: '2022', part: 'PHASE 4', format: 'Movie', desc: 'Wakanda mourns T\'Challa and defends their nation against Namor and Talokan.' },

      // PHASE 5
      { title: 'GUARDIANS OF THE GALAXY VOL. 3', year: '2023', part: 'PHASE 5', format: 'Movie', desc: 'The Guardians embark on a dangerous mission to save Rocket\'s life.' },
      { title: 'ANT-MAN AND THE WASP: QUANTUMANIA', year: '2023', part: 'PHASE 5', format: 'Movie', desc: 'Scott Lang and his family are pulled into the Quantum Realm to face Kang the Conqueror.' },
      { title: 'SECRET INVASION', year: '2023', part: 'PHASE 5', format: 'Show', desc: 'Nick Fury uncovers a covert invasion of Earth by a faction of shape-shifting Skrulls.' },
      { title: 'THE MARVELS', year: '2023', part: 'PHASE 5', format: 'Movie', desc: 'Carol Danvers, Monica Rambeau, and Kamala Khan find their powers entangling.' },
      { title: 'AGATHA ALL ALONG', year: '2024', part: 'PHASE 5', format: 'Show', desc: 'Agatha Harkness regains her freedom and walks the legendary Witches\' Road.' },
      { title: 'DEADPOOL & WOLVERINE', year: '2024', part: 'PHASE 5', format: 'Movie', desc: 'Deadpool and Wolverine bring mutant history into the MCU multiverse.' },
      { title: 'CAPTAIN AMERICA: BRAVE NEW WORLD', year: '2025', part: 'PHASE 5', format: 'Movie', desc: 'Sam Wilson steps up as Captain America during a global political crisis.' },
      { title: 'THUNDERBOLTS*', year: '2025', part: 'PHASE 5', format: 'Movie', desc: 'An antihero crew of operatives takes on covert missions for the government.' },

      // PHASE 6
      { title: 'THE FANTASTIC FOUR: FIRST STEPS', year: '2025', part: 'PHASE 6', format: 'Movie', desc: 'Marvel\'s First Family enters the MCU with a retro-futuristic cosmic adventure.' },
      { title: 'SPIDER-MAN: BRAND NEW DAY', year: '2026', part: 'PHASE 6', format: 'Movie', desc: 'Peter Parker embarks on a fresh chapter navigating a world that forgot him.' },
      { title: 'AVENGERS: DOOMSDAY', year: '2026', part: 'PHASE 6', format: 'Movie', desc: 'Earth\'s heroes face Victor von Doom in a battle for the fate of reality.' }
    ]
  },
  dcau: {
    shortName: 'DCAU',
    publisher: 'DC Universe',
    items: [
      { title: 'BATMAN: YEAR ONE', year: '1987', part: 'ORIGINS', format: 'Comic', detail: '4 issues', desc: 'Frank Miller crafts the iconic origin of the Dark Knight and Jim Gordon in Gotham.' },
      { title: 'BATMAN: THE KILLING JOKE', year: '1988', part: 'ORIGINS', format: 'Comic', detail: 'One-shot', desc: 'Alan Moore\'s definitive psychological battle between Batman and The Joker.' },
      { title: 'BATMAN: THE LONG HALLOWEEN', year: '1996', part: 'CLASSIC ERA', format: 'Comic', detail: '13 issues', desc: 'A year-long mystery hunting down the serial killer known as Holiday.' },
      { title: 'BATMAN: HUSH', year: '2002', part: 'CLASSIC ERA', format: 'Comic', detail: '12 issues', desc: 'A mysterious stalker manipulates Gotham\'s rogue gallery against Bruce Wayne.' },
      { title: 'BATMAN: COURT OF OWLS', year: '2011', part: 'NEW 52', format: 'Comic', detail: '11 issues', desc: 'Scott Snyder unleashes Gotham\'s secret ruling shadow society on Bruce Wayne.' },
      { title: 'DARK NIGHTS: METAL', year: '2017', part: 'NEW 52', format: 'Event', detail: '6 core issues', desc: 'The Dark Multiverse invades Prime Earth led by The Batman Who Laughs.' },
    ]
  },
  onepiece: {
    shortName: 'ONE PIECE',
    publisher: 'Manga Chronology',
    items: [
      { title: 'EAST BLUE SAGA', year: 'Ch. 1', part: 'PART 1: EAST BLUE', format: 'Manga', detail: '100 chapters', desc: 'Luffy gathers Zoro, Nami, Usopp, and Sanji before heading to the Grand Line.' },
      { title: 'ALABASTA SAGA', year: 'Ch. 101', part: 'PART 2: GRAND LINE', format: 'Manga', detail: '117 chapters', desc: 'The Straw Hats stop Crocodile and the Baroque Works conspiracy.' },
      { title: 'WATER 7 & ENIES LOBBY', year: 'Ch. 322', part: 'PART 2: GRAND LINE', format: 'Manga', detail: '120 chapters', desc: 'Declaring war on the World Government to rescue Nico Robin.' },
      { title: 'SUMMIT WAR / MARINEFORD', year: 'Ch. 490', part: 'PART 3: SUMMIT WAR', format: 'Manga', detail: '108 chapters', desc: 'The historic clash between Whitebeard\'s fleet and Navy Headquarters.' },
      { title: 'WANO COUNTRY SAGA', year: 'Ch. 909', part: 'PART 4: FOUR EMPERORS', format: 'Manga', detail: '149 chapters', desc: 'Luffy battles Kaido atop Onigashima to awaken Sun God Nika.' },
      { title: 'FINAL SAGA / EGGHEAD', year: 'Ch. 1058', part: 'PART 5: FINAL SAGA', format: 'Manga', detail: 'Ongoing', desc: 'Dr. Vegapunk and the Void Century secrets rock the entire globe.' },
    ]
  },
  naruto: {
    shortName: 'NARUTO',
    publisher: 'Manga Chronology',
    items: [
      { title: 'ACADEMY & LAND OF WAVES', year: 'Ch. 1', part: 'PART 1: EARLY ARC', format: 'Manga', detail: 'Ch. 1–33', desc: 'Naruto joins Team 7 and faces Zabuza on the Great Naruto Bridge.' },
      { title: 'CHUNIN EXAMS ARC', year: 'Ch. 34', part: 'PART 1: EARLY ARC', format: 'Manga', detail: 'Ch. 34–115', desc: 'Rivals clash in three-part exams that end with Orochimaru\'s invasion.' },
      { title: 'SEARCH FOR TSUNADE', year: 'Ch. 139', part: 'PART 1: CLASSIC ARC', format: 'Manga', detail: 'Ch. 139–171', desc: 'Naruto and Jiraiya recruit the Fifth Hokage while Sasuke struggles with the Cursed Mark.' },
      { title: 'SASUKE RETRIEVAL', year: 'Ch. 172', part: 'PART 1: CLASSIC ARC', format: 'Manga', detail: 'Ch. 172–238', desc: 'Naruto fights Sasuke at the Valley of the End in one of shonen\'s most iconic clashes.' },
      { title: 'KAZEKAGE RESCUE ARC', year: 'Ch. 245', part: 'PART 2: SHIPPUDEN', format: 'Manga', detail: 'Ch. 245–281', desc: 'Two-and-a-half years later, Team 7 reforms to rescue Gaara from Akatsuki.' },
      { title: 'PAIN\'S ASSAULT', year: 'Ch. 413', part: 'PART 2: SHIPPUDEN', format: 'Manga', detail: 'Ch. 413–453', desc: 'Nagato destroys Konoha; Naruto returns and defeats Pain with understanding over hatred.' },
      { title: 'FOURTH GREAT NINJA WAR', year: 'Ch. 516', part: 'PART 2: FINAL ARC', format: 'Manga', detail: 'Ch. 516–699', desc: 'The Allied Shinobi Forces face Madara, Kaguya, and the Ten-Tails in the world\'s greatest conflict.' },
    ]
  },
  aot: {
    shortName: 'ATTACK ON TITAN',
    publisher: 'Manga Chronology',
    items: [
      { title: 'FALL OF SHIGANSHINA', year: 'Ch. 1', part: 'ARC 1: SURVIVAL', format: 'Manga', detail: 'Ch. 1–5', desc: 'Titans breach Wall Maria. Eren, Mikasa and Armin lose their home.' },
      { title: 'BATTLE OF TROST DISTRICT', year: 'Ch. 6', part: 'ARC 1: SURVIVAL', format: 'Manga', detail: 'Ch. 6–34', desc: 'Eren discovers his Titan-shifting ability and helps reclaim Trost.' },
      { title: 'THE FEMALE TITAN ARC', year: 'Ch. 35', part: 'ARC 2: CONSPIRACY', format: 'Manga', detail: 'Ch. 35–58', desc: 'A mysterious Female Titan targets Eren inside the Survey Corps formation.' },
      { title: 'CLASH OF THE TITANS', year: 'Ch. 70', part: 'ARC 2: CONSPIRACY', format: 'Manga', detail: 'Ch. 70–90', desc: 'The truth about the Titans\' nature begins to surface in Utgard Castle.' },
      { title: 'MARLEY ARC', year: 'Ch. 100', part: 'ARC 3: THE TRUTH', format: 'Manga', detail: 'Ch. 100–114', desc: 'A four-year time skip reveals Marley\'s perspective and Eren\'s radical transformation.' },
      { title: 'THE RUMBLING & FINALE', year: 'Ch. 123', part: 'ARC 3: THE TRUTH', format: 'Manga', detail: 'Ch. 123–139', desc: 'Eren unleashes the Rumbling. The Alliance races to stop humanity\'s genocide.' },
    ]
  },
  marvel: {
    shortName: 'MARVEL',
    publisher: 'Marvel Comics',
    items: [
      { title: 'THE INFINITY GAUNTLET', year: '1991', part: 'COSMIC ERA', format: 'Event', detail: '6 core issues', desc: 'Thanos collects all six Infinity Gems to court Mistress Death.' },
      { title: 'CIVIL WAR', year: '2006', part: 'HEROES DIVIDED', format: 'Event', detail: '7 core issues', desc: 'Iron Man and Captain America clash over the Superhuman Registration Act.' },
      { title: 'PLANET HULK & WORLD WAR HULK', year: '2007', part: 'HEROES DIVIDED', format: 'Event', detail: 'Main arcs', desc: 'Exiled to Sakaar, Hulk returns with an alien army seeking retribution.' },
      { title: 'SPIDER-VERSE', year: '2014', part: 'MULTIVERSE ERA', format: 'Event', detail: 'Main event + tie-ins', desc: 'Every Spider-Totem across the multiverse unites against the Inheritors.' },
      { title: 'SECRET WARS', year: '2015', part: 'MULTIVERSE ERA', format: 'Event', detail: '9 core issues', desc: 'Hickman\'s climax destroying and rebuilding the Marvel Multiverse.' },
    ]
  },
  dragonball: {
    shortName: 'DRAGON BALL',
    publisher: 'Manga Chronology',
    items: [
      { title: 'DRAGON BALL: KID GOKU SAGA', year: 'Vol. 1', part: 'DRAGON BALL', format: 'Manga', detail: 'Vol. 1–16', desc: 'Young Goku meets Bulma and collects the seven Dragon Balls across the world.' },
      { title: 'DRAGON BALL Z: SAIYAN SAGA', year: 'Vol. 17', part: 'DRAGON BALL Z', format: 'Manga', detail: 'Vol. 17–23', desc: 'Goku and the Z Fighters face the arrival of Raditz, Nappa, and Vegeta.' },
      { title: 'NAMEK & FRIEZA SAGA', year: 'Vol. 24', part: 'DRAGON BALL Z', format: 'Manga', detail: 'Vol. 24–30', desc: 'The battle for Namek\'s Dragon Balls ends with Goku\'s legendary Super Saiyan transformation.' },
      { title: 'ANDROID & CELL SAGA', year: 'Vol. 31', part: 'DRAGON BALL Z', format: 'Manga', detail: 'Vol. 31–37', desc: 'Future Trunks warns of Androids while the perfect villain Cell emerges.' },
      { title: 'MAJIN BUU SAGA', year: 'Vol. 38', part: 'DRAGON BALL Z', format: 'Manga', detail: 'Vol. 38–42', desc: 'The ancient evil Majin Buu is awakened by Babidi, threatening universal destruction.' },
    ]
  },
  godzilla: {
    shortName: 'GODZILLA',
    publisher: 'MonsterVerse',
    items: [
      { title: 'GODZILLA (2014)', year: '2014', part: 'PHASE 1', format: 'Movie', detail: '2h 3m', desc: 'Godzilla returns to restore balance as MUTO creatures threaten humanity.' },
      { title: 'KONG: SKULL ISLAND', year: '2017', part: 'PHASE 1', format: 'Movie', detail: '1h 58m', desc: 'A 1973 expedition discovers Skull Island and its apex predator, Kong.' },
      { title: 'GODZILLA: KING OF THE MONSTERS', year: '2019', part: 'PHASE 2', format: 'Movie', detail: '2h 12m', desc: 'Ancient Titans awaken across the globe as Monster Zero attacks.' },
      { title: 'GODZILLA VS. KONG', year: '2021', part: 'PHASE 2', format: 'Movie', detail: '1h 53m', desc: 'Two legendary Titans clash while a conspiracy threatens both their worlds.' },
      { title: 'GODZILLA X KONG: THE NEW EMPIRE', year: '2024', part: 'PHASE 3', format: 'Movie', detail: '1h 55m', desc: 'Godzilla and Kong must team up against a powerful new threat from the Hollow Earth.' },
    ]
  },
}

const availableTypes = computed(() => {
  const types = new Set(['ALL'])
  const items = TIMELINES[selectedKey.value]?.items || []
  items.forEach(item => types.add(getFormatLabel(item.format)))
  return [...types]
})

const activeTimeline = computed(() => TIMELINES[selectedKey.value])

function getUniverseThemeClass(key) {
  if (key === 'mcu' || key === 'godzilla') return 'theme-movie'
  if (key === 'dcau' || key === 'marvel') return 'theme-comic'
  if (key === 'onepiece' || key === 'naruto' || key === 'aot' || key === 'dragonball') return 'theme-manga'
  return 'theme-movie'
}

const activeTimelineTheme = computed(() => getUniverseThemeClass(selectedKey.value))

const filteredGrouped = computed(() => {
  const groups = []
  const items = activeTimeline.value?.items || []

  items.forEach((item, originalIdx) => {
    const matchesType = filterType.value === 'ALL' || getFormatLabel(item.format) === filterType.value
    const matchesSearch = !searchQ.value || item.title.toLowerCase().includes(searchQ.value.toLowerCase())
    if (!matchesType || !matchesSearch) return

    const name = item.part
    let group = groups.find(g => g.name === name)
    if (!group) {
      group = { name, items: [] }
      groups.push(group)
    }
    group.items.push({ ...item, originalIdx })
  })

  return groups
})

function getFormatType(format) {
  const v = format.toLowerCase()
  if (v.includes('movie')) return 'movie'
  if (v.includes('show') || v.includes('series') || v.includes('episode')) return 'show'
  if (v.includes('manga')) return 'manga'
  if (v.includes('event')) return 'event'
  if (v.includes('comic')) return 'comic'
  if (v.includes('book') || v.includes('novel')) return 'book'
  return 'other'
}

function getFormatLabel(format) {
  const type = getFormatType(format)
  return { movie: 'MOVIE', show: 'SHOW', manga: 'MANGA', event: 'COMIC', comic: 'COMIC', book: 'BOOK', other: format.toUpperCase() }[type]
}

function getFormatShape(format) {
  const type = getFormatType(format)
  if (type === 'movie') return 'circle'
  if (type === 'show' || type === 'comic' || type === 'event') return 'square'
  if (type === 'manga' || type === 'book') return 'diamond'
  return 'circle'
}

function isDone(idx) {
  return !!comicStore.timelineProgress[`${selectedKey.value}_${idx}`]
}

function getGroupDone(group) {
  return group.items.filter(s => isDone(s.originalIdx)).length
}

function toggleStep(idx, step) {
  const k = `${selectedKey.value}_${idx}`
  comicStore.timelineProgress[k] = !comicStore.timelineProgress[k]
  localStorage.setItem('comicverse-timeline-progress', JSON.stringify(comicStore.timelineProgress))
  if (comicStore.timelineProgress[k]) {
    comicStore.addXp(25)
    showToast(`MARKED "${step.title}" AS WATCHED!`)
  } else {
    showToast(`"${step.title}" MARKED AS UNWATCHED`)
  }
}

function toggleExpanded(idx) {
  expandedIdx.value = expandedIdx.value === idx ? null : idx
}

function toggleGroup(name) {
  const next = new Set(collapsedGroups.value)
  if (next.has(name)) next.delete(name)
  else next.add(name)
  collapsedGroups.value = next
}

function showToast(msg) {
  toast.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<style scoped>
/* ── Page ── */
.tl-page {
  min-height: 100vh;
  background-color: var(--f-bg);
  background-image: radial-gradient(circle, rgba(0,0,0,0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
  display: flex;
  flex-direction: column;
}

.tl-main {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1.25rem 1.5rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ── Universe label ── */
.tl-universe-label {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 900;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* ── Universe pills bar ── */
.tl-universe-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tl-universe-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.3rem 0.75rem;
  background: #FFFFFF;
  border: 2px solid #111;
  border-radius: 999px;
  box-shadow: 2px 2px 0 var(--theme-shadow);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, color 120ms ease;
  white-space: nowrap;
}

.tl-universe-pill:hover {
  transform: translateY(-1px);
  box-shadow: 3px 3px 0 var(--theme-shadow);
}

/* Universe pill category color coding when active */
.tl-universe-pill.active {
  color: #FFFFFF;
  box-shadow: 2.5px 2.5px 0 var(--theme-shadow);
}

.tl-universe-pill.theme-movie.active { background: #EE3545; }
.tl-universe-pill.theme-show.active  { background: #1976D2; }
.tl-universe-pill.theme-comic.active { background: #6A1B9A; }
.tl-universe-pill.theme-manga.active { background: #E65100; }
.tl-universe-pill.theme-book.active  { background: #4E342E; }

.tl-pill-icon {
  display: flex;
  align-items: center;
}

/* ── Filters Row ── */
.tl-filters-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  border-top: 2px solid #111;
  border-bottom: 2px solid #111;
  background: #FDFAF3;
  margin: 0 -1.5rem;
  padding: 0.5rem 1.5rem;
}

.tl-type-pills {
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
}

.tl-type-pill {
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
  padding: 0.28rem 0.7rem;
  background: #FFFFFF;
  border: 2px solid #111;
  border-radius: 3px;
  box-shadow: 2px 2px 0 var(--theme-shadow);
  cursor: pointer;
  transition: background 120ms ease, transform 100ms ease, color 120ms ease;
}
.tl-type-pill:hover { transform: translateY(-1px); }

/* Type pills category color coding when active */
.tl-type-pill.active { background: var(--theme-accent, #EE3545); color: #FFF; }
.tl-type-pill.type-pill-movie.active { background: #EE3545; color: #FFF; }
.tl-type-pill.type-pill-show.active  { background: #1976D2; color: #FFF; }
.tl-type-pill.type-pill-comic.active { background: #6A1B9A; color: #FFF; }
.tl-type-pill.type-pill-manga.active { background: #E65100; color: #FFF; }
.tl-type-pill.type-pill-book.active  { background: #4E342E; color: #FFF; }

.tl-search-wrap {
  flex: 1;
  min-width: 120px;
  max-width: 260px;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: #FFFFFF;
  border: 2px solid #111;
  border-radius: 3px;
  padding: 0.28rem 0.65rem;
  box-shadow: 2px 2px 0 var(--theme-shadow);
}

.tl-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 800;
  color: #111;
}
.tl-search-input::placeholder { color: #aaa; }

.tl-share-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
  padding: 0.28rem 0.7rem;
  background: #FFFFFF;
  color: var(--theme-accent, #EE3545);
  border: 2px solid #111;
  border-radius: 3px;
  box-shadow: 2px 2px 0 var(--theme-shadow);
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 100ms ease;
}
.tl-share-btn:hover { transform: translateY(-1px); box-shadow: 3px 3px 0 var(--theme-shadow); }

/* ── Phase Groups ── */
.tl-groups-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.5rem;
}

.tl-phase-group {
  display: flex;
  flex-direction: column;
  border: 2px solid var(--theme-border, #E87A84);
  border-radius: 4px;
  background: var(--theme-bg, #FFF5F5);
  background-image: radial-gradient(circle, var(--theme-dot, rgba(238, 53, 69, 0.08)) 1.2px, transparent 1.2px);
  background-size: 10px 10px;
  overflow: hidden;
  box-shadow: 3px 3px 0 rgba(0,0,0,0.15);
  --theme-accent: #EE3545;
  --theme-border: #E87A84;
  --theme-bg: #FFF5F5;
  --theme-dot: rgba(238, 53, 69, 0.08);
}

.tl-phase-group.theme-movie {
  --theme-accent: #EE3545;
  --theme-border: #E87A84;
  --theme-bg: #FFF5F5;
  --theme-dot: rgba(238, 53, 69, 0.08);
}

.tl-phase-group.theme-show {
  --theme-accent: #1976D2;
  --theme-border: #90CAF9;
  --theme-bg: #F0F7FF;
  --theme-dot: rgba(25, 118, 210, 0.08);
}

.tl-phase-group.theme-comic {
  --theme-accent: #6A1B9A;
  --theme-border: #CE93D8;
  --theme-bg: #FAF5FF;
  --theme-dot: rgba(106, 27, 154, 0.08);
}

.tl-phase-group.theme-manga {
  --theme-accent: #E65100;
  --theme-border: #FFCC80;
  --theme-bg: #FFF8F0;
  --theme-dot: rgba(230, 81, 0, 0.08);
}

.tl-phase-group.theme-book {
  --theme-accent: #4E342E;
  --theme-border: #BCAAA4;
  --theme-bg: #F7F5F4;
  --theme-dot: rgba(78, 52, 46, 0.08);
}

/* Phase Header */
.tl-phase-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: transparent;
  cursor: pointer;
  user-select: none;
  border-bottom: 1.5px solid var(--theme-border);
}

.tl-phase-title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.tl-arrow-indicator {
  font-size: 0.7rem;
  color: var(--theme-accent);
}

.tl-phase-text {
  font-family: var(--font-comic);
  font-size: 1.2rem;
  font-style: italic;
  color: var(--theme-accent);
  letter-spacing: 0.02em;
}

.tl-phase-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.tl-phase-counter {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 900;
  color: var(--theme-accent);
  text-transform: uppercase;
}

.tl-phase-toggle-icon {
  font-size: 0.65rem;
  color: var(--theme-accent);
}

/* Phase Body */
.tl-phase-body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.85rem 1rem 0.85rem 0.85rem;
}

/* Track Line */
.tl-vertical-track {
  position: absolute;
  left: 2.2rem;
  top: 1rem;
  bottom: 1rem;
  width: 2px;
  background: repeating-linear-gradient(to bottom, var(--theme-border), var(--theme-border) 4px, transparent 4px, transparent 8px);
  z-index: 1;
}

/* Step Entry */
.tl-step-entry {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  z-index: 2;
}

/* Node circle/square/diamond on left */
.tl-track-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  flex-shrink: 0;
}

.tl-node-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2.5px solid #111;
  background: var(--theme-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 1.5px 1.5px 0 var(--theme-shadow);
}

.tl-node-circle.node-show {
  border-radius: 4px;
  background: #1976D2;
}

.tl-node-circle.node-movie {
  border-radius: 50%;
  background: #EE3545;
}

.tl-node-circle.node-comic, .tl-node-circle.node-event {
  border-radius: 4px;
  background: #6A1B9A;
}

.tl-node-circle.node-manga {
  border-radius: 3px;
  transform: rotate(45deg);
  background: #E65100;
}

.tl-node-circle.node-manga .node-check,
.tl-node-circle.node-manga .node-dot {
  transform: rotate(-45deg);
}

.tl-node-circle.node-done {
  background: #2E7D32 !important;
  border-color: #111 !important;
}

.tl-node-circle.node-active {
  background: #F5D13B !important;
  border-color: #111 !important;
}

.node-check {
  font-size: 0.7rem;
  font-weight: 900;
  color: #FFF;
}

.node-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #111;
}

.tl-node-year {
  font-family: var(--font-body);
  font-size: 0.62rem;
  font-weight: 900;
  color: #888;
  margin-top: 0.15rem;
}

/* Card Item */
.tl-item-card {
  flex: 1;
  background: #FFFFFF;
  border: 2.5px solid #111;
  border-radius: 4px;
  box-shadow: 3px 3px 0 var(--theme-shadow);
  overflow: hidden;
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}

.tl-item-card.card-expanded {
  border-color: var(--theme-accent);
  box-shadow: 3.5px 3.5px 0 var(--theme-accent);
}

.tl-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.85rem;
  cursor: pointer;
  min-height: 44px;
}

.tl-card-header:hover {
  background: #FFFDF8;
}

.tl-card-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

/* Badges & Shape Indicators */
.tl-media-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: var(--font-comic);
  font-size: 0.72rem;
  font-style: italic;
  letter-spacing: 0.04em;
  color: #FFFFFF;
  border: 1.5px solid #111;
  border-radius: 3px;
  padding: 0.12rem 0.45rem;
  box-shadow: 1.5px 1.5px 0 var(--theme-shadow);
  flex-shrink: 0;
}

.badge-shape-icon {
  display: inline-block;
  border: 1.2px solid #111;
  flex-shrink: 0;
}

.badge-shape-icon.shape-circle {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #FFFFFF;
}

.badge-shape-icon.shape-square {
  width: 8px;
  height: 8px;
  border-radius: 1px;
  background: #FFFFFF;
}

.badge-shape-icon.shape-diamond {
  width: 7px;
  height: 7px;
  transform: rotate(45deg);
  background: #FFFFFF;
  margin: 0 1px;
}

.badge-movie { background: #EE3545; }
.badge-show  { background: #1976D2; }
.badge-manga { background: #E65100; }
.badge-event { background: #6A1B9A; }
.badge-comic { background: #6A1B9A; }
.badge-book  { background: #4E342E; }
.badge-other { background: #555555; }

/* Item Title */
.tl-item-title {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-style: normal;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: #111111;
  line-height: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tl-item-title.title-done {
  color: #2E7D32;
  text-decoration: line-through;
  text-decoration-thickness: 2.5px;
  text-decoration-color: #2E7D32;
}

.tl-item-detail {
  flex-shrink: 0;
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: 900;
  color: #777;
  text-transform: uppercase;
  background: #FFF9E8;
  border: 1.5px solid #111;
  border-radius: 999px;
  padding: 0.08rem 0.45rem;
}

/* Right Actions */
.tl-card-right {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

/* Circular Check Button */
.tl-action-check-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.8px solid #2E7D32;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all 120ms ease;
}

.tl-action-check-circle:hover {
  background: #F0FDF4;
  transform: scale(1.05);
}

.tl-action-expand-triangle {
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  font-size: 0.65rem;
  color: #EE3545;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 120ms ease;
}

.tl-action-expand-triangle.expanded {
  transform: rotate(90deg);
}

/* Expanded Detail */
.tl-card-detail {
  background: #FFFFFF;
  border-top: 2.5px solid var(--theme-accent);
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.tl-detail-heading {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-style: normal;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  color: #111;
  line-height: 1.15;
}

.tl-detail-sub {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--theme-accent);
  text-transform: uppercase;
}

.tl-detail-note {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  background: #FFF5F5;
  border: 1.5px solid #FFCDD2;
  border-radius: 3px;
  padding: 0.5rem 0.75rem;
  margin-top: 0.3rem;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 700;
  color: #444;
  line-height: 1.4;
}

.tl-note-icon {
  flex-shrink: 0;
  margin-top: 0.1rem;
  color: var(--theme-accent);
}

/* ── Format Color Legend Footer ── */
.tl-legend-footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1.25rem;
  padding: 0.65rem 1rem;
  margin-top: 0.5rem;
  background: #FDF9F0;
  border: 2px solid #111;
  border-radius: 4px;
  box-shadow: 2.5px 2.5px 0 var(--theme-shadow);
  flex-wrap: wrap;
}

.tl-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.legend-shape {
  display: inline-block;
  border: 1.8px solid #111;
  box-shadow: 1px 1px 0 var(--theme-shadow);
  flex-shrink: 0;
}

.legend-shape.shape-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-shape.shape-square {
  width: 11px;
  height: 11px;
  border-radius: 2px;
}

.legend-shape.shape-diamond {
  width: 10px;
  height: 10px;
  transform: rotate(45deg);
  margin: 0 2px;
}

.legend-shape.bg-movie { background: #EE3545; }
.legend-shape.bg-show  { background: #1976D2; }
.legend-shape.bg-book  { background: #4E342E; }
.legend-shape.bg-manga { background: #E65100; }
.legend-shape.bg-comic { background: #6A1B9A; }

.legend-label {
  font-family: var(--font-comic);
  font-size: 0.95rem;
  font-style: italic;
  color: #111111;
  letter-spacing: 0.03em;
}

/* Empty State */
.tl-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 4rem 1rem;
  color: #999;
  font-family: var(--font-body);
  font-weight: 700;
}

/* Toast */
.tl-toast-banner {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #FFFFFF;
  border: 2.5px solid #111;
  border-radius: 4px;
  box-shadow: 4px 4px 0 var(--theme-shadow);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-comic);
  font-size: 0.95rem;
  font-style: italic;
  color: #111;
  z-index: 9999;
}

.tl-toast-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #2E7D32;
  background: #E8F5E9;
}

.tl-toast-msg {
  letter-spacing: 0.02em;
}

.tl-toast-x {
  border: 1.5px solid #111;
  background: #F5F5F5;
  border-radius: 2px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 900;
}

.tl-toast-enter-active, .tl-toast-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
.tl-toast-enter-from, .tl-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}

/* Mobile */
@media (max-width: 768px) {
  .tl-main { padding: 1rem 0.75rem 4rem; }
  .tl-filters-row { margin: 0 -0.75rem; padding: 0.5rem 0.75rem; }
  .tl-vertical-track { left: 1.7rem; }
  .tl-step-entry { gap: 0.5rem; }
  .tl-track-node { width: 2rem; }
  .tl-card-left {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.35rem;
  }
  .tl-item-title {
    width: 100%;
    font-size: 0.82rem;
    white-space: normal;
  }
  .tl-item-detail { display: none; }
  .tl-legend-footer { gap: 0.75rem; }
  .legend-label { font-size: 0.85rem; }
}
</style>
