# BudgetFlow — Budget Tracker

A full-stack **Budget Tracker** web app built with **Vue 3 + Vite** (frontend) and **Laravel** (backend, coming soon), connected to **PostgreSQL**.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue 3, Vite, Vue Router |
| HTTP Client | Axios |
| Styling | Vanilla CSS (custom design system) |
| Backend *(planned)* | Laravel 11, PHP 8.2+ |
| Database *(planned)* | PostgreSQL |

---

## 📁 Project Structure

```
budget-tracker/
├── frontend/              # Vue 3 + Vite
│   ├── public/
│   │   └── login-illustration.jpg
│   ├── src/
│   │   ├── assets/
│   │   │   ├── base.css       # Design tokens & reset
│   │   │   └── auth.css       # Auth page styles
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   └── RegisterView.vue
│   │   ├── services/
│   │   │   └── api.js         # Axios instance
│   │   ├── App.vue
│   │   └── main.js
│   ├── .env
│   └── vite.config.js
└── README.md
```

---

## ✨ Features (Frontend)

- 🎨 **Login Page** — Split card layout with 3D illustration, pink accent, light-blue inputs, pill button, Google/GitHub/Facebook OAuth buttons
- 📝 **Register Page** — Same aesthetic with first/last name, password strength meter, confirm password
- 🔐 **Form Validation** — Real-time inline validation with error states
- 👁️ **Password Toggle** — Show/hide password on both pages
- ⚡ **Animated Transitions** — Smooth page transitions between Login and Register
- 📱 **Responsive** — Mobile-friendly, illustration hidden on small screens

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

## 🔮 Roadmap

- [ ] Laravel API backend
- [ ] PostgreSQL database
- [ ] User authentication (Sanctum)
- [ ] Dashboard with charts
- [ ] Transaction management
- [ ] Category & budget limits
- [ ] Recurring transactions

---

## 📄 License

MIT
