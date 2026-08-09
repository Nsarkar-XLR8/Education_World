# 🎓 Education World — Next.js 15 Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-v5-purple?style=flat-square&logo=next.js)](https://authjs.dev/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

**Education World** is a production-grade, full-stack educational platform built with **Next.js 15 (App Router)**, **TypeScript**, **Prisma ORM**, and **NextAuth v5**. It unifies learning tools, e-commerce bookstore, tuition matching, global university discovery, and gamified children's education into a single high-performance web application.

---

## ✨ Key Features & Modules

### 📚 Industry-Level Bookstore & E-Commerce
- **Catalog & Filtering**: Browse textbooks and guidebooks across School, College, University, Kids, and General literature.
- **Dynamic Search & Sorting**: Filter by category tabs or sort by Price (Low to High, High to Low) and Discount Savings.
- **Detailed Book View (`/books/[id]`)**: Interactive cover preview, author details, publisher specs, stock availability badges, discount savings calculation (`Save 15%`), and quantity selector.
- **Cart & Order Management (`/cart` & `/orders`)**: Full cart subtotal calculation, checkout address input, and real-time order status tracking (Pending, Shipped, Delivered).

### 🎓 Tuition Matching Platform
- **Verified Listings**: Pre-seeded database of verified tutor profiles and student tuition requests across Dhaka, Chittagong, Sylhet, and major regions.
- **Post Tuition / Tutor Registration Modal**: Interactive popup allowing any teacher to register or student to request a tutor with full form validation.
- **Direct Connect**: Role filters (Tutors vs Students), subject/location search bar, salary badges, and 1-click Apply / Call triggers.

### 🌐 Automated Global Study Abroad Engine (10,000+ Universities)
- **Zero Admin Data Entry**: Dynamically queries global university databases for **over 10,000+ universities across 200+ countries**.
- **Live Search & Country Filter**: Instant debounced search for ANY university, city, or discipline (e.g., *Harvard, Munich, Toronto, Oxford, Tokyo, Berlin, Sydney*).
- **🎯 Student Eligibility Matcher**: Input your **CGPA** (e.g. 3.45) and **IELTS score** (e.g. 7.0) to highlight universities where you meet admission requirements.
- **1-Click Official Sites**: Direct links to official `.edu` / `.ac.uk` / `.edu.ca` university admission portals.
- **Free Counseling Lead Modal**: Request free counseling pre-filled with selected university data.

### 🧸 Kids Zone & Real-Time Gamification Engine
- **Real-Time XP Broadcasting (`useKidsScore.ts`)**: Custom event bus synchronizing XP gains, Star rewards ⭐, and Level titles (Level 1 Explorer to Level 5 Grand Master) instantly across all components.
- **Gamified Kids Header (`KidsHeader.tsx`)**: Reusable header showing level title, XP progress bar (`45/100 XP`), stars, sound toggle (🔊/🔇), and Trophy Badges modal.
- **🧮 Math Quiz Game (`/kids/math`)**: 3-Heart Life system ❤️❤️❤️, Easy/Medium/Hard difficulty selectors, streak multipliers (+50 XP for 5-streak), keyboard shortcuts (`1`, `2`, `3`), and sound effects.
- **🐍 Canvas Snake Game (`/kids/snake`)**: HTML5 Canvas 2D game with scroll prevention (`e.preventDefault()`), Spacebar pause, Slow/Normal/Turbo speed modes, and Golden Apple power-ups (+25 XP).
- **🔤 ABC & 123 Interactive Quiz Games**: Explore mode vs Quiz game mode with Web Speech Synthesis audio out loud.

### 🎙️ Hands-Free Voice Navigation
- **Global Voice Control (`VoiceControl.tsx`)**: Web Speech API floating widget allowing users to navigate pages hands-free (e.g., *"Go to books"*, *"Open tuition"*, *"Study abroad"*).

### 🔒 Enterprise Security & Resilient Data Layer
- **NextAuth v5 & Bcryptjs**: 12-round password hashing with JWT session handling.
- **Zero-Downtime Fallback Stores**: Resilient local JSON data stores (`.data/products.json`, `tuitions.json`, `abroad.json`, `users.json`) guaranteeing 100% out-of-the-box data availability even when database connections are offline.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Framework** | Next.js 15.3 (App Router, Server & Client Components, Turbopack) |
| **Language** | TypeScript 5.0 (Strict Type Checking) |
| **Styling** | Vanilla CSS Design System with HSL Tailored Tokens, Glassmorphism, Responsive Grid |
| **Animations** | GSAP 3.12 (ScrollTrigger), Lenis Smooth Scroll, CSS Micro-animations |
| **Database & ORM** | Prisma ORM 5.0, PostgreSQL, Resilient Local JSON Storage Fallback |
| **Authentication** | NextAuth v5 (Auth.js), Bcryptjs (12 rounds) |
| **APIs & Voice** | Hipolabs Global University API, Web Speech API (SpeechRecognition & SpeechSynthesis), Web Audio API |
| **Container & CI/CD**| Docker (Multi-stage build), Docker Compose, Render Blueprint (`render.yaml`) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/education-world.git
cd education-world
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/education_world?schema=public"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Run Database Migrations (Optional)
```bash
# Push Prisma schema to database
npx prisma db push

# (Optional) Open Prisma Studio GUI
npx prisma studio
```
*Note: If PostgreSQL is not running, the application will automatically fall back to resilient local JSON storage!*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@educationworld.com` | `admin123` | Full Admin Portal (`/admin`, `/admin/abroad`) |
| **Student / User** | `user@educationworld.com` | `user123` | Bookstore, Tuition, Kids Zone, Study Abroad |

---

## 🐳 Docker Deployment

### Run Locally with Docker Compose
```bash
# Build and launch Next.js container + PostgreSQL database
docker-compose up --build
```
Access the application at `http://localhost:3000`.

---

## 📂 Project Architecture

```
education-world/
├── public/                     # Static assets, SVG icons & legacy media
│   ├── icon.svg                # Education Graduation Cap Favicon
│   └── legacy-assets/          # Preserved legacy media files
├── src/
│   ├── app/                    # Next.js 15 App Router Routes
│   │   ├── (admin)/            # Admin Portal Routes (/admin, /admin/abroad)
│   │   ├── (auth)/             # Auth Routes (/login, /signup)
│   │   ├── (main)/             # Core Platform Routes (/books, /tuition, /kids, /study-abroad)
│   │   └── api/                # REST API Endpoints (/api/products, /api/tuition, /api/abroad)
│   ├── components/             # Reusable UI & Feature Components
│   │   ├── features/           # Modals (PostTuition, UniversityDetail, KidsHeader, VoiceControl)
│   │   └── layout/             # Navbar, Footer, AdminSidebar
│   ├── hooks/                  # Custom React Hooks (useKidsScore.ts)
│   └── lib/                    # Core Business Logic & Resilient Data Stores
│       ├── abroadStore.ts      # Global University Store
│       ├── productStore.ts     # Bookstore Product Store
│       ├── tuitionStore.ts     # Tuition Listings Store
│       └── universitySearchEngine.ts # Automated 10,000+ University Search Engine
├── prisma/
│   └── schema.prisma           # Prisma Database Schema (9 Models)
├── Dockerfile                  # Production Multi-Stage Dockerfile
├── docker-compose.yml          # Docker Compose Services
├── render.yaml                 # Render Deployment Blueprint
└── package.json
```

---

## 📄 License

This project is licensed under the **MIT License**.
