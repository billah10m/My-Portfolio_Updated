-- ====================================================================
-- SUPABASE MIGRATION SCRIPT FOR ASIF BILLAH'S PORTFOLIO CMS
-- Software Developer & AI Researcher • General Secretary, DIU-CPC
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ====================================================================

-- 1. PERSON INFO TABLE
CREATE TABLE IF NOT EXISTS person_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  subtitle TEXT,
  headline TEXT,
  about_headline TEXT,
  tagline TEXT,
  bio TEXT,
  about TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  status TEXT,
  avatar_url TEXT,
  avatar TEXT,
  resume_url TEXT,
  resumeurl TEXT,
  cv_file_name TEXT,
  skills TEXT[] DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  period TEXT NOT NULL,
  cgpa TEXT,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TECH SKILLS TABLE (Organized into 8 Categories)
CREATE TABLE IF NOT EXISTS tech_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- programming, frontend, backend, ai_ml, research, marketing, professional, tools
  level TEXT DEFAULT 'Expert', -- Expert, Advanced, Intermediate
  proficiency INT DEFAULT 90,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'LIVE DEMO',
  description TEXT NOT NULL,
  longdesc TEXT,
  tech TEXT[] DEFAULT '{}',
  metrics TEXT,
  time TEXT DEFAULT '2024',
  githuburl TEXT,
  liveurl TEXT,
  image TEXT,
  gallery TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RESEARCH PAPERS TABLE
CREATE TABLE IF NOT EXISTS research_papers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT,
  mltech TEXT,
  venue TEXT,
  year TEXT,
  abstract TEXT,
  hardware TEXT,
  metrics TEXT,
  doi TEXT,
  citation TEXT,
  status TEXT DEFAULT 'Research in Progress',
  pdfurl TEXT,
  img TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  category TEXT DEFAULT 'Leadership',
  period TEXT NOT NULL,
  startyear TEXT DEFAULT '2023',
  endyear TEXT DEFAULT 'Present',
  logo TEXT,
  description TEXT,
  bullets TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ACTIVITIES & CAMPUS LEADERSHIP TABLE
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- University Events, Workshops & Seminars, National Events, International Events, Volunteering
  role TEXT NOT NULL,
  year TEXT NOT NULL,
  impact TEXT,
  stat TEXT,
  tag TEXT,
  location TEXT,
  link TEXT,
  img TEXT,
  gallery TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  desc TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. HERO STATS TABLE
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. INBOX & CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  category TEXT,
  contact_method TEXT,
  interests TEXT[] DEFAULT '{}',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. WEBSITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  subtitle TEXT,
  logo TEXT,
  favicon TEXT,
  footer_text TEXT,
  seo_title TEXT,
  seo_description TEXT,
  social_preview_image TEXT,
  cv_download_file TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- SEED INITIAL DATA FOR ASIF BILLAH
-- ====================================================================

-- 1. Insert Person Info
INSERT INTO person_info (
  name, title, role, subtitle, headline, tagline, about, bio, email, phone, location, github, linkedin, twitter, status, resume_url, avatar_url
) VALUES (
  'Asif Billah',
  'Software Developer & AI Researcher',
  'Software Developer & AI Researcher',
  'Bridging Software Engineering & AI Innovation | General Secretary, DIU-CPC',
  'Bridging Software Engineering, Deep Learning Research & Collegiate Leadership',
  'Building High-Performance Web Systems, AI Solutions & Automated Intelligent Workflows',
  'I am an enthusiastic Computer Science and Engineering undergraduate at Daffodil International University with a strong commitment to architecting scalable software systems and advancing Artificial Intelligence and Machine Learning solutions. Serving as the General Secretary of DIU Computer & Programming Club (DIU-CPC), I spearhead national tech events, competitive programming bootcamps, and technical workshops, while actively pursuing medical AI research.',
  'I am an enthusiastic Computer Science and Engineering undergraduate at Daffodil International University with a strong commitment to architecting scalable software systems and advancing Artificial Intelligence and Machine Learning solutions. Serving as the General Secretary of DIU Computer & Programming Club (DIU-CPC), I spearhead national tech events, competitive programming bootcamps, and technical workshops, while actively pursuing medical AI research.',
  'asifbillah.cse@gmail.com',
  '+880 1700-000000',
  'Daffodil Smart City, Ashulia, Dhaka, Bangladesh',
  'https://github.com/asifbillah',
  'https://linkedin.com/in/asifbillah',
  'https://twitter.com/asifbillah',
  'Open to AI & Full-Stack Opportunities',
  '/Asif_Billah_CV.pdf',
  '/cpc1.jpg'
) ON CONFLICT DO NOTHING;

-- 2. Insert Education
INSERT INTO education (degree, institution, period, cgpa, details) VALUES
  ('BSc (Honors) in Computer Science and Engineering', 'Daffodil International University (DIU)', '2021 - Present (58th Batch)', '3.85 / 4.00', 'Specializing in Intelligent Systems, Machine Learning, Deep Learning, Web Engineering, and Data Structures.')
ON CONFLICT DO NOTHING;

-- 3. Insert Stats
INSERT INTO stats (label, value, description) VALUES
  ('Academic CGPA', '3.85', 'BSc (Hons) in CSE • Daffodil International University'),
  ('Leadership', 'General Secretary', 'DIU Computer & Programming Club (DIU-CPC)'),
  ('Core Projects', '03+', 'Campus Gig, Orivo & Medical AI Vision-Language'),
  ('Workshops & Events', '15+', 'National Contests, Hackathons & Tech Seminars')
ON CONFLICT DO NOTHING;

-- 4. Insert Initial Projects
INSERT INTO projects (id, title, category, status, description, longdesc, tech, metrics, time, githuburl, liveurl, image, gallery, featured) VALUES
  ('proj-1', 'Campus Gig — Collegiate Microjobs & Freelance Ecosystem', 'Full-Stack Web App', 'LIVE DEMO', 'A specialized university marketplace connecting students with campus tasks, technical microjobs, skill exchanges, and instant digital payments.', 'Campus Gig is a comprehensive collegiate task and micro-economy platform designed to empower university students. It features student identity verification, gig escrow mechanisms, automated transaction records, real-time messaging, and multi-filter discovery for on-campus opportunities.', ARRAY['Next.js 14', 'React 18', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'WebSockets'], '500+ Student Users • 99.8% Escrow Reliability', '2024', 'https://github.com/asifbillah/campus-gig', 'https://campusgig-demo.vercel.app', '/tech1.jpg', ARRAY['/tech1.jpg', '/tech2.JPG', '/cpc1.jpg'], TRUE),
  ('proj-2', 'Orivo — Enterprise E-Commerce & Marketing Automation Platform', 'Full-Stack Web App', 'LIVE DEMO', 'Next-generation digital commerce platform integrating intelligent marketing analytics, automated customer notifications, and streamlined product catalogs.', 'High-concurrency e-commerce architecture designed with sub-second page delivery, serverless payment checkouts, dynamic inventory tracking, and targeted marketing automation workflows for modern growing retail businesses.', ARRAY['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Redis', 'PostgreSQL', 'BullMQ'], '10k+ Monthly Visits • 99.9% Uptime', '2024', 'https://github.com/asifbillah/orivo-commerce', 'https://orivo-demo.vercel.app', '/orivo.jpeg', ARRAY['/orivo.jpeg', '/tech2.JPG'], TRUE),
  ('proj-3', 'Explainable Multi-Label Brain CT Findings Detection & Report Generation', 'AI & Machine Learning', 'RESEARCH PROTOTYPE', 'Deep learning vision-language framework for automated cranial CT finding classification, Grad-CAM interpretability, and coherent clinical diagnostic report drafting.', 'Developed a dual-stage vision-language pipeline that takes multi-slice non-contrast cranial CT volumes, classifies acute multi-label pathologies (intracranial hemorrhage, fractures, midline shift), generates visual attribution heatmaps, and synthesizes structured medical diagnostic reports to assist radiologists during emergency triage.', ARRAY['Python', 'PyTorch', 'Vision-Language Models', 'Transformers', 'Grad-CAM', 'FastAPI', 'OpenCV'], '96.4% AUC ROC • 0.88 BLEU-4 Clinical Report Score', '2024', 'https://github.com/asifbillah/brain-ct-vision-language', 'https://brain-ct-ai-demo.vercel.app', '/neuro.png', ARRAY['/neuro.png', '/lecture-ai.jpeg'], TRUE)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Research Paper
INSERT INTO research_papers (id, title, domain, mltech, venue, year, hardware, metrics, abstract, doi, citation, status, img, pdfurl) VALUES
  ('paper-1', 'Explainable Multi-Label Brain CT Findings Detection and Report Generation Using Vision-Language Learning', 'Medical AI & Vision-Language 🧠', 'Vision-Language Models / Transformer-CNN Hybrid', 'IEEE International Conference on Bioinformatics and Biomedicine (BIBM 2024 / Under Review)', '2024', 'NVIDIA RTX 4090 / PyTorch CUDA', '96.4% AUC • Grad-CAM Heatmaps • 0.88 BLEU-4', 'We propose an end-to-end explainable vision-language diagnostic framework for multi-label cranial CT scans. Combining 3D slice attention networks with a cross-modal transformer decoder, the model detects acute hemorrhages, ischemic changes, and skull fractures while generating human-readable radiology findings alongside visual Grad-CAM attribution heatmaps.', '10.1109/BIBM.2024.10842', 'Billah, A. et al. (2024). Explainable Multi-Label Brain CT Findings Detection and Report Generation Using Vision-Language Learning. IEEE BIBM.', 'Research in Progress / Manuscript Under Review', '/neuro.png', '/Asif_Billah_CV.pdf')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Experiences
INSERT INTO experiences (id, role, organization, category, period, startyear, endyear, logo, description, bullets) VALUES
  ('exp-1', 'General Secretary', 'DIU Computer & Programming Club (DIU-CPC)', 'Leadership', '2023 - Present', '2023', 'Present', '/cpc1.jpg', 'Directing executive operations, technical committees, national programming competitions, and university-wide tech workshops for over 2,000+ registered members.', ARRAY['Spearheaded the organization of DIU CPC Take-Off Programming Contests, engaging 500+ freshmen programmers.', 'Supervised 15+ technical bootcamps covering Full-Stack Web Development, Artificial Intelligence, and Competitive Programming.', 'Coordinated national-scale logistics and arena infrastructure for collegiate programming contests.']),
  ('exp-2', 'Software Development Engineer & Full-Stack Developer', 'Tech Innovation & Microservices Lab', 'Software Development', '2023 - Present', '2023', 'Present', '/tech1.jpg', 'Architecting web applications, database schemas, and API microservices with high performance and modular architecture.', ARRAY['Engineered scalable frontend applications in Next.js 14 and React with responsive glassmorphic aesthetics.', 'Implemented secure session and JWT authentication with role-based access control and atomic database operations.', 'Optimized page load speed and asset delivery to consistently achieve 95+ Lighthouse benchmark performance.']),
  ('exp-3', 'Medical AI & Deep Learning Student Researcher', 'Intelligent Systems & Medical Vision Lab, DIU', 'Research', '2023 - Present', '2023', 'Present', '/cpc2.jpg', 'Investigating vision-language foundation models for medical imaging diagnostics and clinical narrative synthesis.', ARRAY['Trained deep CNN and Transformer architectures on multi-label 3D cranial CT scans.', 'Developed explainable Grad-CAM heatmap visualization pipelines to validate AI attention against clinical ground truth.', 'Authored research manuscripts and prepared experimental benchmark documentation.']),
  ('exp-4', 'Technical Operations Co-Lead', 'ICPC Asia Dhaka Regional & National Arenas', 'Volunteering', '2023 - 2024', '2023', '2024', '/icpc1.jpg', 'Managing scoring network infrastructure and contest arena coordination for 300+ university teams.', ARRAY['Maintained zero-downtime LAN and PC arena connectivity for national contestants.', 'Coordinated volunteer teams for contestant check-in, score verification, and live ceremony staging.'])
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Activities
INSERT INTO activities (id, title, category, role, year, impact, stat, tag, location, link, img, gallery, desc) VALUES
  ('act-1', 'DIU CPC Take-Off Programming Contest', 'University Events', 'General Secretary & Lead Organizer', '2023 - 2024', '500+ Freshmen Competitors • 8 Problem Arena Sets', '500+ Competitors', 'Competitive Programming', 'Daffodil Smart City, Ashulia, Dhaka', 'https://facebook.com/diucpc', '/cpc2.jpg', ARRAY['/cpc2.jpg', '/cpc1.jpg', '/tech2.JPG'], 'Organized and supervised the flagship freshmen programming tournament at Daffodil International University, handling live scoring arenas and contest problem testing.'),
  ('act-2', 'DIU Tech Carnival & Hands-On AI Workshop', 'Workshops & Seminars', 'Executive Director & Workshop Lead', '2024', '350+ Student Participants • Hands-on Project Labs', '350+ Students', 'Tech Workshop', 'DIU Main Auditorium, Dhaka', 'https://facebook.com/diucpc', '/tech2.JPG', ARRAY['/tech2.JPG', '/cpc1.jpg', '/cpc2.jpg'], 'Directed technical sessions and interactive workshops introducing undergraduates to modern AI, full-stack web engineering, and open-source development.'),
  ('act-3', 'ICPC Asia Dhaka Regional Contest Operations', 'National Events', 'Operations & Technical Lead', '2024', '300+ University Teams • Zero-Downtime Arena', '300+ Teams', 'National Arena', 'Daffodil Smart City, Ashulia, Dhaka', 'https://icpc.global', '/icpc1.jpg', ARRAY['/icpc1.jpg', '/cpc2.jpg', '/tech1.jpg'], 'Coordinated arena networking, volunteer logistics, and contestant platform setup for over 300 university teams competing across Bangladesh.'),
  ('act-4', 'National Smart Bangladesh Hackathon', 'National Events', 'Team Lead & Solutions Architect', '2023', 'Top Finalist Team • Smart Campus Innovation', 'Top Finalist', 'Hackathon', 'Dhaka, Bangladesh', 'https://smartbangladesh.gov.bd', '/cpc1.jpg', ARRAY['/cpc1.jpg', '/tech2.JPG'], 'Engineered an AI-powered smart community resource allocation portal, presenting to academic and industry judges.'),
  ('act-5', 'DIU Blood Donors Club & Community Outreach', 'Volunteering & Community', 'Volunteer & Tech Supporter', '2022 - Present', '400+ Units Donated • On-Campus Drives', '400+ Units', 'Social Welfare', 'DIU Medical Center, Ashulia', 'https://facebook.com/diubdc', '/cpc1.jpg', ARRAY['/cpc1.jpg', '/tech1.jpg'], 'Supported campus blood donation camp logistics and helped coordinate student volunteer donor management databases.')
ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE person_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DROP POLICY IF EXISTS "Public read person_info" ON person_info;
CREATE POLICY "Public read person_info" ON person_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read education" ON education;
CREATE POLICY "Public read education" ON education FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read tech_skills" ON tech_skills;
CREATE POLICY "Public read tech_skills" ON tech_skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read projects" ON projects;
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read research_papers" ON research_papers;
CREATE POLICY "Public read research_papers" ON research_papers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read experiences" ON experiences;
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read activities" ON activities;
CREATE POLICY "Public read activities" ON activities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read stats" ON stats;
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read website_settings" ON website_settings;
CREATE POLICY "Public read website_settings" ON website_settings FOR SELECT USING (true);

-- Contact Messages: Anyone can insert, only authenticated admin can read/delete
DROP POLICY IF EXISTS "Public insert messages" ON messages;
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select messages" ON messages;
CREATE POLICY "Admin select messages" ON messages FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin delete messages" ON messages;
CREATE POLICY "Admin delete messages" ON messages FOR DELETE TO authenticated USING (true);

-- Authenticated Owner Write Policies (INSERT, UPDATE, DELETE)
CREATE POLICY "Admin write person_info" ON person_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write education" ON education FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write tech_skills" ON tech_skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write research_papers" ON research_papers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write experiences" ON experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write activities" ON activities FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write stats" ON stats FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write website_settings" ON website_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
