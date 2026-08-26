# 📚 ComicShelf

> **Your entire reading life, one shelf.**
> A personal comic, manga, manhwa & webtoon tracker — with streaks, achievements, timelines, watchlists, and stats.

---

## 🦸 What is ComicShelf?

ComicShelf is a **personal media tracker** built for comic readers and manga fans. Track what you own, what you're reading, and what you want to read next — all in one beautifully designed shelf.


---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Vue 3** (Composition API) |
| Bundler | **Vite** |
| Routing | **Vue Router** |
| State Management | **Reactive store** (`useComicStore.js`) |
| Persistence | **localStorage** with JSON backup/restore |
| Styling | **Vanilla CSS** — comic book design system |
| Fonts | **Bangers**, **Comic Neue**, **Outfit** (Google Fonts) |

---

## 🗂️ Project Structure

```
frontend/
├── index.html
└── src/
    ├── App.vue
    ├── main.js                    ← Vue Router setup & app entry
    ├── assets/
    │   ├── base.css               ← Design tokens, resets, global styles
    │   └── auth.css               ← Landing page, showcase, login styles
    ├── components/
    │   └── Navbar.vue             ← Top navigation for logged-in views
    ├── stores/
    │   └── useComicStore.js       ← Global state: library, streaks, XP, user
    └── views/
        ├── LandingView.vue        ← Home page (/) with animated 2x2 showcase
        ├── LoginView.vue          ← Standalone sign-in page (/login)
        ├── RegisterView.vue       ← Registration flow
        ├── ShelfView.vue          ← Main shelf — Grid / Spines / List modes
        ├── DiscoverView.vue       ← Browse & discover new titles
        ├── TimelinesView.vue      ← Universe reading orders
        ├── WatchlistView.vue      ← Anime & TV adaptations tracker
        ├── StatsView.vue          ← Reading heatmap & analytics
        ├── AchievementsView.vue   ← Badges, XP & reader rank system
        └── ProfileView.vue        ← User profile & data backup
```

---

## 🗺️ Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Landing** | Hero section with swinging 2x2 comic preview, features grid, CTA |
| `/login` | **Sign In** | Comic-styled card with Google Sign-In button |
| `/shelf` | **My Shelf** | Your comic library — Grid, 3D Book Spines, or List view |
| `/discover` | **Discover** | Browse and search new comics, manga & manhwa |
| `/timelines` | **Timelines** | Universe reading orders (MCU, Batman Saga, One Piece, etc.) |
| `/watchlist` | **Watchlist** | Track anime & live-action adaptations by season & episode |
| `/stats` | **Stats** | GitHub-style activity heatmap, reading velocity, format breakdown |
| `/achievements` | **Achievements** | Badge system, XP, and reader rank from Initiate to Arch-Mage |
| `/profile` | **Profile** | User info, data backup to JSON, and restore |

---

## 🎨 Design System

The entire app uses a **comic book aesthetic**:

- **Background**: Parchment `#FAF4E8` with halftone dot texture
- **Shadows**: Hard `4px 4px 0 #111111` — no blur, pure comic book
- **Borders**: Solid `2.5px solid #111111` everywhere
- **Color Palette**:

| Token | Color | Hex |
|-------|-------|-----|
| Red | Crimson | `#FF1744` |
| Yellow | Electric | `#FFD600` |
| Green | Neon | `#00E676` |
| Purple | Royal | `#AA00FF` |
| Orange | Flame | `#FF6D00` |

- **Typography**: `Bangers` for headlines, `Comic Neue` for body, `Outfit` for UI elements

---

## Features

### 🏠 Landing Page
- Full hero layout with headline, description, and `START NOW` CTA
- **Animated 2x2 comic showcase** — pendulum swing animation, hoverable cards
- Each card shows: cover art, type banner (`COMICS`, `MANHWA`, `WEBTOON`, `MANGA`), chapter progress, star rating badge, streak pill, and action buttons
- "Everything in One Shelf" 6-feature grid
- "How ComicShelf Works" 4-step guide
- Format badges row (Manga, Comic, Manhwa, Webtoon, Graphic Novel, Light Novel)
- Bottom crimson CTA banner

### 🔐 Login Page
- Dedicated full-page route (`/login`)
- Comic-styled card: red header with **COMICSHELF** in yellow Bangers font
- Single yellow **SIGN IN WITH GOOGLE!** button with colored Google icon
- Back arrow button (top-left) returns to landing page

### 📚 Shelf (`/shelf`)
- **3 view modes**: Grid cards, 3D Book Spines, flat List
- Chapter progress bars, star ratings, streak flames
- Filter by status: Reading / Completed / Paused / Dropped / Want to Read

### 🔥 Reading Streaks
- Flame badges (`🔥 7D`, `🔥 5D`) tracking consecutive daily reading
- Longest streak record stored in profile

### ⭐ Star Ratings
- Comic star polygon SVG badge per title
- Ratings like `10/10`, `9/10`, `8/10` displayed inline

### 🏆 Achievements (`/achievements`)
- Badge unlock system tied to reading milestones
- XP system with reader ranks: Initiate > Reader > Scholar > Sage > Arch-Mage > Multiverse Arch-Mage

### 📊 Stats (`/stats`)
- GitHub-style annual reading activity heatmap
- Format breakdown: Manga / Comics / Manhwa / Webtoon
- Reading velocity and chapter count charts

### 📺 Watchlist (`/watchlist`)
- Track anime & live-action adaptations
- Season and episode progress per series

### 🗓️ Timelines (`/timelines`)
- Interactive universe reading orders
- Marvel MCU, DC Batman Sagas, Spider-Verse, One Piece, and more

### 💾 Data Persistence
- All data saved to browser `localStorage`
- JSON backup and restore available in `/profile`

---

## 🚀 Getting Started

```bash
# Install dependencies
cd frontend
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

App runs at: **http://localhost:5173**

---

## 🔗 Links

- **GitHub**: [github.com/Kurt7275/budget-tracker](https://github.com/Kurt7275/comic-tracker)

---

## 📌 Roadmap / Next Steps

- [ ] Real Google OAuth authentication
- [ ] Backend API (Node.js / Supabase) for cross-device sync
- [ ] Search & add titles from external APIs (MangaDex, Marvel API)
- [ ] Push notifications for new chapter releases
- [ ] Mobile responsive layout
- [ ] Dark mode toggle
- [ ] Social features — share your shelf

---

*Built with love and too many comic books.*
