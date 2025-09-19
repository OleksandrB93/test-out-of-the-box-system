# Star Wars Movie Explorer 🌟

An interactive web application for exploring Star Wars movies with immersive 3D animations and modern design.

🚀 **Live Demo:** [https://test-out-of-the-box-system.vercel.app/](https://test-out-of-the-box-system.vercel.app/)  
🎥 **Video:** [https://www.loom.com/share/fe7bf648d4024067b219003f8696c6c9](https://www.loom.com/share/fe7bf648d4024067b219003f8696c6c9)

## 🎯 Project Overview

Star Wars Movie Explorer is a modern web application that allows users to explore the Star Wars universe through interactive 3D movie cards. The project showcases cutting-edge web technologies and creates an engaging user experience with animations reminiscent of space adventures.

### ✨ Key Features

- **3D Interactive Cards** - Browse movies as 3D cards with smooth animations
- **Star Field Background** - Dynamic animated starfield background
- **Detailed Information** - Complete movie information, cast, and crew details
- **Responsive Design** - Optimized for all devices
- **Dark/Light Theme** - Theme switching capability
- **Smooth Animations** - GSAP-powered animations for enhanced UX

## 🛠 Technologies

### Frontend Framework

- **Next.js 15.5.3** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Typed JavaScript

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - Pre-built UI components
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library

### Animations & 3D

- **GSAP 3.13.0** - Professional animation library
- **Three.js 0.180.0** - 3D graphics in the browser
- **PixiJS 8.13.2** - 2D WebGL renderer

### Additional Libraries

- **next-themes** - Theme system
- **React Player** - Video playback
- **class-variance-authority** - Conditional CSS classes

## 📁 Project Structure

```
test-out-of-the-box-system/
├── app/                          # Next.js App Router
│   ├── (routes)/
│   │   └── movie/
│   │       └── [id]/
│   │           └── page.tsx      # Movie details page
│   ├── favicon.ico               # Favicon
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
│
├── components/                   # React components
│   ├── MovieItem/               # Movie components
│   │   ├── index.tsx            # Main movie item component
│   │   ├── Header.tsx           # Movie header component
│   │   ├── MovieCasts.tsx       # Cast information
│   │   ├── MovieCrew.tsx        # Crew information
│   │   ├── MovieDetails.tsx     # Movie details
│   │   ├── MoviePoster.tsx      # Movie poster
│   │   ├── MovieReviews.tsx     # Reviews
│   │   └── MovieTrailer.tsx     # Trailer
│   │
│   ├── providers/               # React providers
│   │   ├── MainProvider.tsx     # Main app provider
│   │   └── ThemeProvider.tsx    # Theme provider
│   │
│   ├── ui/                      # UI components
│   │   ├── button.tsx           # Button component
│   │   ├── dropdown-menu.tsx    # Dropdown menu
│   │   └── RenderStars.tsx      # Star rating component
│   │
│   ├── StarWarItem.tsx          # Individual Star Wars item
│   ├── StarWarList.tsx          # Main movie list with 3D animations
│   └── ToggleMode.tsx           # Theme toggle component
│
├── hooks/                       # Custom React hooks
│   ├── use-3d-cards-animation.tsx    # 3D card animations
│   ├── use-cast-animation.tsx        # Cast animations
│   ├── use-crew-animation.tsx        # Crew animations
│   ├── use-get-cast.tsx             # API for fetching cast
│   ├── use-get-item.tsx             # API for fetching movie
│   ├── use-get-reviews.tsx          # API for fetching reviews
│   ├── use-get-video.tsx            # API for fetching videos
│   ├── use-movie-animations.tsx     # Movie animations
│   ├── use-movie-search.tsx         # Movie search functionality
│   └── use-star-field-animation.tsx # Star field background animation
│
├── lib/                         # Utilities
│   └── utils.ts                 # Helper functions and utilities
│
├── public/                      # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── components.json              # Shadcn/ui configuration
├── eslint.config.mjs           # ESLint configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd test-out-of-the-box-system
```

2. **Install dependencies:**

```bash
pnpm install
# or
npm install
```

3. **Run the development server:**

```bash
pnpm dev
# or
npm run dev
```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 🎨 Design Features

- **Star Wars Theme** - Authentic Star Wars font and styling
- **Space Atmosphere** - Animated starfield background
- **3D Interactions** - Interactive 3D movie cards
- **Smooth Transitions** - GSAP animations throughout
- **Mobile Optimized** - Responsive design for all devices

## 🌐 Deployment

The project is automatically deployed to Vercel on every push to the main branch.

**Production URL:** [https://test-out-of-the-box-system.vercel.app/](https://test-out-of-the-box-system.vercel.app/)

## 📄 License

This project is created for demonstration purposes.

---

**May the Force be with you!** ⭐️
