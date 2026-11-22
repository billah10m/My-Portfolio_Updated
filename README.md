# 🚀 Asif Billah — Personal Portfolio & Owner-Only Admin CMS

> **Live Architecture**: Next.js 14 (App Router) • React 18 • Three.js • React Three Fiber • Tailwind CSS • Framer Motion • GSAP • Lenis • Supabase PostgreSQL / Local Disk Persistence • Multer/FormData Image Pipeline

A futuristic, high-performance personal portfolio website and full-featured administrative Content Management System (CMS) engineered for **Asif Billah** — Computer Science & Engineering Undergraduate at **Daffodil International University (DIU)** and **General Secretary of DIU Computer & Programming Club (DIU-CPC)**.

Designed with award-winning aesthetics inspired by [ratul-dev.vercel.app](https://ratul-dev.vercel.app/), featuring 3D particle physics, glassmorphic optics, interactive project decks, and an owner-only private admin dashboard allowing 100% control over every section, text string, and image.

---

## 🌟 Key Architectural Features

### 1. Visual Experience & 3D Web Design
- **3D Interactive Hero Canvas**: Ambient particle network powered by Three.js and `@react-three/fiber` responding to mouse coordinates and scroll velocity.
- **Glassmorphic Cyber Aesthetic**: Deep obsidian palette (`#08090D`, `#101727`), hairline luminous cyan/sky borders, backdrop blur filters (`16px–24px`), and dynamic radial spotlights.
- **Interactive Micro-Interactions**:
  - `Magnetic.jsx`: Physics-based cursor attraction on CTA buttons and icons.
  - `SmoothCursor.jsx`: Trailing fluid spring cursor.
  - `WordRotate.jsx` & `StrokeText.jsx`: Dual-axis animated headline typography.
  - `ScrollStack.jsx` & `DepthCarousel.jsx`: 3D stacked card perspectives for projects and activities.
  - `ThemeToggle.jsx`: Instant dark/light theme switching with smooth token interpolation.

### 2. Complete Public Sections
- **Home**: Futuristic hero with 3D canvas, animated title, role status pill, "Explore Projects" CTA, "Download Resume" (`/Asif_Billah_CV.pdf`), and verified social links.
- **About**: Background narrative, DIU academic journey, engineering roots, core capability pills, and live stats (CGPA 3.85, General Secretary leadership, 15+ events).
- **Skills (Tech Arsenal)**: Organized into all 8 demanded categories:
  1. *Programming Languages* (Python, C/C++, JavaScript, TypeScript, SQL)
  2. *Frontend Development* (Next.js 14, React 18, Tailwind CSS, Three.js)
  3. *Backend Development* (Node.js, Express, FastAPI, PostgreSQL, Redis, MongoDB)
  4. *AI and Machine Learning* (PyTorch, Vision-Language Models, CNNs, Transformers, OpenCV)
  5. *Research & Methodologies* (Medical Imaging, Grad-CAM, LaTeX)
  6. *Digital Marketing* (SEO Architecture, Conversion Rate Optimization, Analytics)
  7. *Professional Skills* (Club Governance, Event Operations, Public Speaking)
  8. *Tools & Technologies* (Git, Docker, Supabase, Linux, Postman)
- **Projects Showcase**: Flagship interactive cards with multi-photo inspection modals, tech stack badges, live demo and GitHub links, metrics chips:
  - **Campus Gig**: University microjobs & task marketplace for collegiate freelancers.
  - **Orivo**: Enterprise e-commerce and automated marketing engine.
  - **Explainable Multi-Label Brain CT Findings Detection**: Vision-Language AI model.
- **Research**: Dedicated medical AI & deep learning research section featuring BibTeX citation generator, Grad-CAM interpretability details, abstract viewer, and publication status.
- **Experience Timeline**: Detailed history including General Secretary of DIU-CPC, Software Development Engineer, and ICPC Asia Dhaka Regional Contest operations.
- **Activities & Events**: Rich photo galleries for DIU Take-Off Programming Contests, AI workshops, hackathons, and blood donation drives with multiple photographs per event.
- **Contact**: Validated 7-field inquiry transmission form with instant AJAX feedback and direct coordinates at Daffodil Smart City, Ashulia.

---

## 🛡️ Admin Dashboard — Owner-Only CMS

### Routes:
- **Public Dashboard**: `/admin` (Guarded; redirects unauthenticated visitors)
- **Login Gateway**: `/admin/login` (Encrypted credential authentication)

### Security & Authentication:
- **Server-Side Authorization**: Protected APIs and routes verified via HttpOnly session cookies (`admin_session`) and optional Supabase Auth.
- **Zero Public Registration**: Only the verified owner can log in and execute writes.
- **Dual-Tier Persistence**:
  - **Cloud Mode**: Full Supabase PostgreSQL tables + Supabase Storage bucket with Row Level Security (RLS).
  - **Self-Hosted Disk Mode**: Writes directly to server-side JSON store (`/src/data/portfolio.json`) and `/public/uploads/`, persisting across server restarts and browser refreshes with zero external database lock-in.

### CMS Modules & CRUD Capabilities:
1. **📊 Overview Telemetry**: Real-time counter metrics for Projects, Skills, Research, Experience, Activities, Education, Stats, and unread Messages, plus quick-action shortcuts.
2. **👤 Profile Management**:
   - Edit Full Name, Title, Subtitle, Tagline, Introduction, Location, Email, Phone, Social URLs.
   - **Profile Picture**: Upload from computer, Replace picture, or Remove picture with instant preview.
   - **CV File**: Upload new PDF resume or replace existing `/Asif_Billah_CV.pdf` directly.
3. **🎓 About & Education**:
   - Edit personal narrative and about headline.
   - Add, edit, or delete degrees, institutions, CGPA, graduation periods, and coursework.
4. **⚡ Skills Management**:
   - Filter and manage skills across all 8 categories.
   - Adjust proficiency sliders (0–100%), skill level badges (Expert/Advanced/Intermediate), and custom icons.
5. **🚀 Projects Management**:
   - Create, edit, and delete projects.
   - Upload cover thumbnail from computer.
   - **Multi-Image Gallery**: Upload multiple project screenshots from computer, preview thumbnails in grid, and delete individual images without affecting others.
   - Toggle featured status, update GitHub URL, live demo URL, and metrics tags.
6. **📚 Research Management**:
   - Add, edit, and delete research papers.
   - Upload architecture diagrams and Grad-CAM visual findings.
   - Update abstracts, venues, publication years, DOI links, and auto-generated BibTeX citations.
7. **💼 Experience Management**:
   - Add and edit timeline entries, upload organization logos, edit bullet achievements, and dates.
8. **🏫 Activities & Leadership Management**:
   - Add workshops, programming contests, and university initiatives.
   - **Multi-Photo Event Albums**: Upload multiple high-resolution event photographs from computer, view photo count badge, and remove individual photos.
9. **✉️ Contact & Inquiries Inbox**:
   - View visitor messages submitted through the contact form.
   - Read inquiries, view sender contact details, and delete messages.
10. **⚙️ Website Settings & SEO**:
    - Update website title, monogram logo (`AB`), favicon path, footer copyright text, SEO meta title, and description.

---

## 📸 Image Management System

- **Persistent Disk Uploads**: Real multipart form processing via `/api/upload`.
- **Allowed Formats**: JPG, JPEG, PNG, WebP, SVG, PDF.
- **Safety**: Sanitized filenames with timestamp deduplication; 10MB quota validation.
- **Cloud Mirroring**: When Supabase Storage is configured, uploaded files automatically mirror to the `portfolio-images` bucket.
- **Instant Client Refresh**: All image updates appear immediately on the public website.

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### Environment Variables:
```env
# 1. ADMIN DASHBOARD CREDENTIALS
ADMIN_EMAIL=asifbillah.cse@gmail.com
ADMIN_PASSWORD=admin123
ADMIN_SECRET_KEY=admin123

# 2. OPTIONAL: SUPABASE CREDENTIALS (Cloud PostgreSQL & Storage)
# Leave blank to use built-in persistent local disk mode
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# 3. SITE URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🗄️ Supabase Database Schema Setup

To use Supabase:
1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `supabase-schema.sql` and click **Run**.
4. In Supabase Storage, create a public bucket named `portfolio-images`.
5. Copy your Project URL and Anon Key into `.env.local`.

---

## 💻 Installation & Local Development

```bash
# 1. Navigate to the project directory
cd portfolio

# 2. Install dependencies (Node 18+ or 20+ recommended)
npm install --legacy-peer-deps

# 3. Start development server
npm run dev

# 4. Open in browser:
# Public Portfolio:  http://localhost:3000
# Admin Login:       http://localhost:3000/admin/login
# Admin Dashboard:   http://localhost:3000/admin
```

### Production Build:
```bash
npm run build
npm start
```

---

## 🔑 Default Owner Credentials

- **Admin Login Route**: `http://localhost:3000/admin/login`
- **Identifier / Email**: `asifbillah.cse@gmail.com` (or `asif` / `admin`)
- **Password**: `admin123`

*(Password can be customized in `.env.local` via `ADMIN_PASSWORD` or directly in Supabase Auth).*

---

## 📦 Deployment Instructions

### Deploy to Vercel:
1. Push repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set environment variables in Vercel project settings (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, Supabase credentials).
4. Click **Deploy**.

---

&copy; 2026 Asif Billah. General Secretary, DIU Computer & Programming Club (DIU-CPC) • Daffodil International University.
