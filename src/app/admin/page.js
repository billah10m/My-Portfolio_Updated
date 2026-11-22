'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getPortfolioData, 
  savePersonInfo, 
  saveProject, 
  deleteProject, 
  saveExperience, 
  deleteExperience, 
  saveActivity,
  deleteActivity,
  saveTechSkill,
  deleteTechSkill,
  saveStat,
  deleteStat,
  saveResearch,
  deleteResearch,
  saveEducation,
  deleteEducation,
  saveWebsiteSettings,
  getContactMessages, 
  deleteContactMessage,
  uploadImageToSupabase,
  uploadMultipleImages,
  signOutAdmin,
  getAdminSession,
  onAdminAuthStateChange
} from '@/lib/supabase';
import { 
  Lock, 
  ShieldCheck, 
  User, 
  Layers, 
  Briefcase, 
  BookOpen, 
  Mail, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RefreshCw, 
  ArrowLeft, 
  Database,
  Search,
  Eye,
  LogOut,
  X,
  Award,
  Upload,
  Image as ImageIcon,
  Code,
  BarChart2,
  GraduationCap,
  FileText,
  Github,
  Linkedin,
  Twitter,
  Images,
  KeyRound,
  Sparkles,
  AlertCircle,
  Settings,
  LayoutDashboard,
  Globe,
  Sliders,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Portfolio Data State
  const [personInfo, setPersonInfo] = useState({});
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [researchPapers, setResearchPapers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [techSkills, setTechSkills] = useState([]);
  const [stats, setStats] = useState([]);
  const [education, setEducation] = useState([]);
  const [websiteSettings, setWebsiteSettings] = useState({});
  const [messages, setMessages] = useState([]);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('all');

  // Modals / Form States for All Sections
  const [editingProject, setEditingProject] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingStat, setEditingStat] = useState(null);
  const [editingResearch, setEditingResearch] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);

  // Options & Dropdowns
  const PROJECT_CATEGORIES = [
    'Full-Stack Web App',
    'AI & Machine Learning',
    'AI & Embedded IoT',
    'Interactive Canvas & Game',
    'Backend Microservice',
    'Mobile Application',
    'Cloud & Infrastructure'
  ];

  const PROJECT_STATUSES = [
    'LIVE DEMO',
    'ONGOING BUILD',
    'COMPLETED',
    'RESEARCH PROTOTYPE',
    'MAINTENANCE'
  ];

  const EXPERIENCE_CATEGORIES = [
    'Leadership',
    'Software Development',
    'Research',
    'Internship',
    'Volunteering',
    'Full-Time'
  ];

  const CAMPUS_CATEGORIES = [
    'University Events',
    'Workshops & Seminars',
    'National Events',
    'International Events',
    'Volunteering & Community',
    'Clubs & Organizations'
  ];

  const SKILL_CATEGORIES = [
    { id: 'programming', label: 'Programming Languages' },
    { id: 'frontend', label: 'Frontend Development' },
    { id: 'backend', label: 'Backend Development' },
    { id: 'ai_ml', label: 'AI & Machine Learning' },
    { id: 'research', label: 'Research & Methodologies' },
    { id: 'marketing', label: 'Digital Marketing' },
    { id: 'professional', label: 'Professional Skills' },
    { id: 'tools', label: 'Tools & Technologies' }
  ];

  const SKILL_LEVELS = ['Expert', 'Advanced', 'Intermediate'];

  useEffect(() => {
    let mounted = true;

    // Hard safeguard timeout: NEVER allow checkingAuth to stay true longer than 2.5 seconds
    const safeguardTimer = setTimeout(() => {
      if (mounted) {
        setCheckingAuth(false);
      }
    }, 2500);

    getAdminSession()
      .then(({ session, user }) => {
        if (!mounted) return;
        if (session) {
          setCurrentUser(user || { email: 'asifbillah.cse@gmail.com', name: 'Asif Billah' });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((err) => {
        console.warn("Admin session check error:", err);
        if (mounted) setIsAuthenticated(false);
      })
      .finally(() => {
        if (mounted) {
          clearTimeout(safeguardTimer);
          setCheckingAuth(false);
        }
      });

    const unsubscribePromise = onAdminAuthStateChange((event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setCurrentUser(session.user);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safeguardTimer);
      if (unsubscribePromise?.then) {
        unsubscribePromise.then(sub => sub?.unsubscribe?.());
      }
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    const data = await getPortfolioData();
    setPersonInfo(data.personInfo || {});
    setProjects(data.projects || []);
    setExperiences(data.experiences || []);
    setResearchPapers(data.researchPapers || []);
    setActivities(data.activities || []);
    setTechSkills(data.techSkills || []);
    setStats(data.stats || []);
    setEducation(data.education || []);
    setWebsiteSettings(data.websiteSettings || {});
    setIsLiveSupabase(data.isLiveSupabase);

    const msgs = await getContactMessages();
    setMessages(msgs.data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setCurrentUser(null);
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  const showStatus = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 4500);
  };

  // --- SINGLE FILE UPLOADER HANDLER ---
  const handleSingleFileUpload = async (e, onUrlUploaded) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    showStatus('Uploading file to persistent storage...');

    const res = await uploadImageToSupabase(file);
    setUploading(false);

    if (res.url) {
      onUrlUploaded(res.url);
      showStatus(res.isLocal ? 'File loaded locally!' : 'File saved persistently!');
    } else {
      showStatus('File upload failed.');
    }
  };

  // --- MULTIPLE FILES UPLOADER HANDLER ---
  const handleMultipleFilesUpload = async (e, onUrlsUploaded) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    showStatus(`Uploading ${files.length} images...`);

    const uploadedUrls = await uploadMultipleImages(files);
    setUploading(false);

    if (uploadedUrls.length > 0) {
      onUrlsUploaded(uploadedUrls);
      showStatus(`Uploaded ${uploadedUrls.length} images successfully!`);
    } else {
      showStatus('Failed to upload images.');
    }
  };

  // --- SAVE PERSON INFO ---
  const handleSavePersonInfo = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    const res = await savePersonInfo(personInfo);
    setSaving(false);
    if (res.error) showStatus(`Error: ${res.error}`);
    else { showStatus('Profile, Bio & Social Links updated successfully!'); loadData(); }
  };

  // --- SAVE WEBSITE SETTINGS ---
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    await saveWebsiteSettings(websiteSettings);
    setSaving(false);
    showStatus('Website Settings & SEO Configuration saved!');
    loadData();
  };

  // --- PROJECTS CRUD ---
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!editingProject) return;
    setSaving(true);
    const formatted = {
      ...editingProject,
      tech: typeof editingProject.tech === 'string' ? editingProject.tech.split(',').map(s => s.trim()).filter(Boolean) : editingProject.tech,
      gallery: typeof editingProject.gallery === 'string' ? editingProject.gallery.split('\n').map(s => s.trim()).filter(Boolean) : editingProject.gallery,
      githubUrl: editingProject.githubUrl || editingProject.github_url || '',
      liveUrl: editingProject.liveUrl || editingProject.live_url || ''
    };
    const res = await saveProject(formatted);
    setSaving(false);
    if (res.error) showStatus(`Error: ${res.error}`);
    else { showStatus('Project saved successfully!'); setEditingProject(null); loadData(); }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setSaving(true);
    await deleteProject(id);
    setSaving(false);
    showStatus('Project deleted.');
    loadData();
  };

  // --- EXPERIENCE CRUD ---
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    if (!editingExperience) return;
    setSaving(true);
    const formatted = {
      ...editingExperience,
      bullets: typeof editingExperience.bullets === 'string' ? editingExperience.bullets.split('\n').filter(b => b.trim() !== '') : editingExperience.bullets
    };
    const res = await saveExperience(formatted);
    setSaving(false);
    if (res.error) showStatus(`Error: ${res.error}`);
    else { showStatus('Experience entry saved!'); setEditingExperience(null); loadData(); }
  };

  const handleDeleteExperience = async (id) => {
    if (!confirm('Are you sure you want to delete this experience entry?')) return;
    setSaving(true);
    await deleteExperience(id);
    setSaving(false);
    showStatus('Experience entry deleted.');
    loadData();
  };

  const handleDeleteAllExperiences = async () => {
    if (!confirm('Are you sure you want to delete and hide the entire Experience & Timeline section from your website?')) return;
    setSaving(true);
    setExperiences([]);
    try {
      await saveWebsiteSettings({ ...websiteSettings, showExperience: false });
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'experiences', data: [] })
      });
    } catch (e) {
      console.warn("Delete all experiences error:", e);
    }
    setSaving(false);
    showStatus('Experience & Timeline section removed from website.');
    loadData();
  };

  // --- ACTIVITIES & LEADERSHIP CRUD ---
  const handleSaveActivity = async (e) => {
    e.preventDefault();
    if (!editingActivity) return;
    setSaving(true);
    const galleryArr = typeof editingActivity.gallery === 'string'
      ? editingActivity.gallery.split('\n').map(s => s.trim()).filter(Boolean)
      : (editingActivity.gallery || []);

    const formatted = {
      ...editingActivity,
      gallery: galleryArr,
      images: galleryArr.length > 0 ? galleryArr : (editingActivity.images || []),
      img: editingActivity.img || (galleryArr.length > 0 ? galleryArr[0] : '/cpc1.jpg')
    };
    const res = await saveActivity(formatted);
    setSaving(false);
    if (res.error) showStatus(`Error: ${res.error}`);
    else { showStatus('Campus & Leadership activity saved!'); setEditingActivity(null); loadData(); }
  };

  const handleDeleteActivity = async (id) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    setSaving(true);
    await deleteActivity(id);
    setSaving(false);
    showStatus('Activity deleted.');
    loadData();
  };

  // --- TECH SKILLS CRUD ---
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!editingSkill) return;
    setSaving(true);
    const res = await saveTechSkill(editingSkill);
    setSaving(false);
    if (res.error) showStatus(`Error: ${res.error}`);
    else { showStatus('Skill saved!'); setEditingSkill(null); loadData(); }
  };

  const handleDeleteSkill = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    setSaving(true);
    await deleteTechSkill(id);
    setSaving(false);
    showStatus('Skill deleted.');
    loadData();
  };

  // --- STATS CRUD ---
  const handleSaveStat = async (e) => {
    e.preventDefault();
    if (!editingStat) return;
    setSaving(true);
    const res = await saveStat(editingStat);
    setSaving(false);
    if (res.error) showStatus(`Error: ${res.error}`);
    else { showStatus('Stat saved!'); setEditingStat(null); loadData(); }
  };

  const handleDeleteStat = async (id) => {
    if (!confirm('Are you sure you want to delete this stat?')) return;
    setSaving(true);
    await deleteStat(id);
    setSaving(false);
    showStatus('Stat deleted.');
    loadData();
  };

  // --- RESEARCH CRUD ---
  const handleSaveResearch = async (e) => {
    e.preventDefault();
    if (!editingResearch) return;
    setSaving(true);
    const res = await saveResearch(editingResearch);
    setSaving(false);
    if (res.error) showStatus(`Error: ${res.error}`);
    else { showStatus('Research entry saved!'); setEditingResearch(null); loadData(); }
  };

  const handleDeleteResearch = async (id) => {
    if (!confirm('Are you sure you want to delete this research paper?')) return;
    setSaving(true);
    await deleteResearch(id);
    setSaving(false);
    showStatus('Research paper deleted.');
    loadData();
  };

  // --- EDUCATION CRUD ---
  const handleSaveEducation = async (e) => {
    e.preventDefault();
    if (!editingEducation) return;
    setSaving(true);
    const res = await saveEducation(editingEducation);
    setSaving(false);
    if (res.error) showStatus(`Error: ${res.error}`);
    else { showStatus('Education entry saved!'); setEditingEducation(null); loadData(); }
  };

  const handleDeleteEducation = async (id) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    setSaving(true);
    await deleteEducation(id);
    setSaving(false);
    showStatus('Education deleted.');
    loadData();
  };

  // --- MESSAGES INBOX ---
  const handleDeleteMessage = async (id) => {
    await deleteContactMessage(id);
    showStatus('Message removed from inbox.');
    loadData();
  };

  // Filtered lists
  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSkills = techSkills.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = skillCategoryFilter === 'all' || s.category === skillCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const getGalleryArray = (galleryVal) => {
    if (!galleryVal) return [];
    if (Array.isArray(galleryVal)) return galleryVal;
    return galleryVal.split('\n').map(s => s.trim()).filter(Boolean);
  };

  // IF CHECKING AUTH, SHOW LOADER
  if (checkingAuth) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center font-mono text-xs text-sky-400 bg-[#08090D]">
        <div className="flex items-center gap-3 p-6 rounded-2xl border border-sky-500/20 bg-sky-950/20">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Verifying administrator privileges...</span>
        </div>
      </main>
    );
  }

  // IF NOT AUTHENTICATED, PROMPT REDIRECT TO /admin/login
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center p-4 select-none font-sans bg-[#08090D]">
        <div className="w-full max-w-md p-8 rounded-3xl space-y-6 shadow-2xl border border-sky-500/20 bg-[#101727]/80 backdrop-blur-xl text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border border-sky-500/30 bg-sky-500/10 shadow-lg">
            <Lock className="w-8 h-8 text-sky-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">Owner Access Required</h1>
            <p className="text-xs text-zinc-400 font-mono">This dashboard is protected for Asif Billah only.</p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="w-full py-3 px-6 rounded-xl font-bold text-sm font-sans flex items-center justify-center gap-2 shadow-lg transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #00f2fe 100%)', color: '#08090D' }}
            >
              <KeyRound className="w-4 h-4" />
              <span>Go to Admin Login Gateway &rarr;</span>
            </Link>
          </div>
          <div className="pt-4 border-t border-white/10">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-sky-400 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Portfolio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <main className="min-h-screen w-full font-sans p-4 sm:p-6 lg:p-8 select-none bg-[#08090D] text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Navbar */}
        <header className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl bg-[#101727]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-sky-400/30 bg-sky-500/10 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Asif Billah &bull; Admin CMS</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  OWNER VERIFIED
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400">
                {currentUser?.email ? `Session active: ${currentUser.email}` : 'Full Write Authorization'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <span 
              className="text-xs px-3 py-1 rounded-full font-mono font-bold flex items-center gap-1.5 border"
              style={isLiveSupabase ? { background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.3)' } : { background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.25)' }}
            >
              <Database className="w-3.5 h-3.5" />
              {isLiveSupabase ? 'SUPABASE POSTGRESQL' : 'LOCAL DISK PERSISTENCE'}
            </span>

            <button 
              onClick={loadData} 
              className="p-2.5 rounded-xl border border-white/10 text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer transition-all" 
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link 
              href="/" 
              target="_blank"
              className="px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 shadow-md transition-all hover:brightness-110" 
              style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #00f2fe 100%)', color: '#08090D' }}
            >
              <Eye className="w-3.5 h-3.5" /> View Public Site
            </Link>

            <button 
              onClick={handleLogout} 
              className="px-3 py-2 rounded-xl border border-red-500/20 text-zinc-300 hover:text-red-400 bg-red-950/20 hover:bg-red-950/40 cursor-pointer flex items-center gap-1.5 text-xs font-mono transition-all" 
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Status Toast */}
        {statusMsg && (
          <div className="p-3.5 rounded-xl text-xs font-mono flex items-center gap-2.5 shadow-lg border border-sky-400/40 bg-sky-950/50 text-sky-300 animate-fade-in">
            <Check className="w-4 h-4 flex-shrink-0 text-sky-400" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Main Content Layout with Responsive Navigation Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-3">
            <div className="p-3.5 rounded-2xl border border-white/10 bg-[#101727]/90 backdrop-blur-xl space-y-1 shadow-md">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 px-3 py-1 font-bold">
                Management Modules
              </p>
              {[
                { id: 'overview', label: '📊 Dashboard Overview', icon: LayoutDashboard },
                { id: 'profile', label: '👤 Profile & Hero Bio', icon: User },
                { id: 'about', label: '🎓 About & Education', icon: GraduationCap, count: education.length },
                { id: 'skills', label: '⚡ Skills & Tech Arsenal', icon: Layers, count: techSkills.length },
                { id: 'projects', label: '🚀 Projects Showcase', icon: Code, count: projects.length },
                { id: 'research', label: '📚 Research & Papers', icon: BookOpen, count: researchPapers.length },
                { id: 'experience', label: '💼 Work & Leadership', icon: Briefcase, count: experiences.length },
                { id: 'campus', label: '🏫 Activities & Events', icon: Award, count: activities.length },
                { id: 'messages', label: '✉️ Inquiries & Messages', icon: Mail, count: messages.length },
                { id: 'settings', label: '⚙️ Website Settings', icon: Settings },
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all flex items-center justify-between cursor-pointer border ${
                      isActive 
                        ? 'border-sky-400 bg-sky-400 text-slate-950 font-bold shadow-md' 
                        : 'border-transparent text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive ? 'bg-slate-950 text-white' : 'bg-white/10 text-zinc-300'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick System Info Pill */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#101727]/60 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Storage System:</span>
                <span className="text-sky-400 font-bold">/public/uploads/</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Format Support:</span>
                <span className="text-white">JPG, PNG, WebP</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Upload Quota:</span>
                <span className="text-emerald-400">10 MB / File</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-4">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#101727]/90 backdrop-blur-xl shadow-xl min-h-[600px]">
              
              {/* ================= 1. OVERVIEW TAB ================= */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">Portfolio Control Overview</h2>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">Real-time status of all collections and dynamic content</p>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-400 font-bold">
                      All Systems Active
                    </span>
                  </div>

                  {/* Telemetry Stat Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {[
                      { label: 'Projects', count: projects.length, icon: Code, tab: 'projects' },
                      { label: 'Skills', count: techSkills.length, icon: Layers, tab: 'skills' },
                      { label: 'Research Papers', count: researchPapers.length, icon: BookOpen, tab: 'research' },
                      { label: 'Experience Roles', count: experiences.length, icon: Briefcase, tab: 'experience' },
                      { label: 'Activities & Events', count: activities.length, icon: Award, tab: 'campus' },
                      { label: 'Education Entries', count: education.length, icon: GraduationCap, tab: 'about' },
                      { label: 'Hero Stats', count: stats.length, icon: BarChart2, tab: 'overview' },
                      { label: 'Inbox Inquiries', count: messages.length, icon: Mail, tab: 'messages' },
                    ].map((card, i) => (
                      <div 
                        key={i} 
                        onClick={() => setActiveTab(card.tab)}
                        className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-sky-400/40 cursor-pointer transition-all space-y-2 group"
                      >
                        <div className="flex items-center justify-between text-zinc-400">
                          <card.icon className="w-4 h-4 group-hover:text-sky-400 transition-colors" />
                          <span className="text-xs font-mono font-bold text-sky-400">&rarr;</span>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white font-sans">{card.count}</div>
                          <div className="text-xs font-mono text-zinc-400">{card.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Profile Quick Summary Card */}
                  <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-sky-400/40 relative shrink-0 shadow-lg bg-black/40">
                      <img 
                        src={personInfo.avatar || '/cpc1.jpg'} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h3 className="text-lg font-bold text-white">{personInfo.name || 'Asif Billah'}</h3>
                      <p className="text-xs text-sky-400 font-mono font-semibold">{personInfo.title || 'Software Developer & AI Researcher'}</p>
                      <p className="text-xs text-zinc-300 font-sans line-clamp-2">{personInfo.about || personInfo.bio}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold border border-sky-400/40 text-sky-400 hover:bg-sky-400 hover:text-slate-950 transition-all cursor-pointer shrink-0"
                    >
                      Edit Profile &rarr;
                    </button>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">Quick Actions</h3>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => {
                          setActiveTab('projects');
                          setEditingProject({
                            title: '',
                            category: PROJECT_CATEGORIES[0],
                            status: PROJECT_STATUSES[0],
                            description: '',
                            longDesc: '',
                            tech: 'Next.js 14, React 18, Node.js, PostgreSQL, Tailwind CSS',
                            githubUrl: 'https://github.com/asifbillah',
                            liveUrl: 'https://demo.vercel.app',
                            image: '/tech1.jpg',
                            gallery: '/tech1.jpg\n/tech2.JPG',
                            metrics: '95+ Benchmark Score',
                            time: '2024',
                            featured: true
                          });
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-sky-400 hover:text-slate-950 border border-white/10 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> + New Project
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('skills');
                          setEditingSkill({ name: '', category: 'frontend', level: 'Expert', proficiency: 90 });
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-sky-400 hover:text-slate-950 border border-white/10 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> + New Skill
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('campus');
                          setEditingActivity({
                            title: '',
                            category: CAMPUS_CATEGORIES[0],
                            role: 'General Secretary & Lead Organizer',
                            year: '2024',
                            impact: '300+ Attendees • Live Coding',
                            stat: '300+ Attendees',
                            tag: 'Campus Leadership',
                            img: '/cpc1.jpg',
                            gallery: '/cpc1.jpg\n/tech2.JPG',
                            desc: 'Summary of the activity and accomplishments.'
                          });
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-sky-400 hover:text-slate-950 border border-white/10 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> + New Activity
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('research');
                          setEditingResearch({
                            title: '',
                            domain: 'Medical AI & Vision-Language 🧠',
                            mlTech: 'Deep Learning / Transformers',
                            venue: 'IEEE (2024)',
                            year: 2024,
                            abstract: 'Paper abstract and methodology...',
                            metrics: '96.4% AUC',
                            hardware: 'NVIDIA RTX 4090',
                            status: 'Research in Progress',
                            citation: 'Billah, A. et al. (2024).'
                          });
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-sky-400 hover:text-slate-950 border border-white/10 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> + New Research Paper
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= 2. PROFILE & HERO BIO ================= */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSavePersonInfo} className="space-y-6 font-sans">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h2 className="text-base font-bold text-white">Profile, Personal Branding & Media</h2>
                      <p className="text-xs text-zinc-400 font-mono">Controls your name, identity, avatar photo, and CV download file</p>
                    </div>
                    <button 
                      type="submit" 
                      disabled={saving} 
                      className="px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md font-mono transition-all hover:brightness-110 disabled:opacity-50" 
                      style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #00f2fe 100%)', color: '#08090D' }}
                    >
                      <Check className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                    </button>
                  </div>

                  {/* Profile Picture Management Section */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                      Profile Picture Management
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-sky-400/50 bg-black/50 shrink-0 relative shadow-xl">
                        {personInfo.avatar ? (
                          <img src={personInfo.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-500 font-mono text-xs">No Photo</div>
                        )}
                      </div>

                      <div className="space-y-2 text-center sm:text-left flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Upload New Picture */}
                          <label className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-sky-400/40 text-sky-400 bg-sky-950/20 hover:bg-sky-400 hover:text-slate-950 transition-all shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload New Picture</span>
                            <input 
                              type="file" 
                              accept="image/jpeg,image/png,image/webp" 
                              className="hidden" 
                              onChange={e => handleSingleFileUpload(e, url => setPersonInfo({ ...personInfo, avatar: url }))} 
                            />
                          </label>

                          {/* Replace Existing */}
                          <label className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-white/10 text-zinc-300 bg-white/5 hover:bg-white/10 transition-all">
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Replace Picture</span>
                            <input 
                              type="file" 
                              accept="image/jpeg,image/png,image/webp" 
                              className="hidden" 
                              onChange={e => handleSingleFileUpload(e, url => setPersonInfo({ ...personInfo, avatar: url }))} 
                            />
                          </label>

                          {/* Remove Picture */}
                          {personInfo.avatar && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Remove profile picture?')) {
                                  setPersonInfo({ ...personInfo, avatar: '' });
                                }
                              }}
                              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border border-red-500/30 text-red-400 bg-red-950/20 hover:bg-red-950/40 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Picture</span>
                            </button>
                          )}
                        </div>

                        <div className="text-[11px] text-zinc-400 font-mono">
                          Image URL: <input 
                            type="text" 
                            value={personInfo.avatar || ''} 
                            onChange={e => setPersonInfo({ ...personInfo, avatar: e.target.value })} 
                            className="bg-black/40 border border-white/10 px-2.5 py-1 rounded-lg text-white font-mono text-[11px] w-full max-w-md mt-1"
                            placeholder="/cpc1.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CV / Resume Upload Section */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                      CV / Resume Document Management
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input 
                        type="text" 
                        value={personInfo.resumeUrl || ''} 
                        onChange={e => setPersonInfo({ ...personInfo, resumeUrl: e.target.value })} 
                        placeholder="/Asif_Billah_CV.pdf" 
                        className="flex-1 px-3.5 py-2 rounded-xl text-xs outline-none text-white font-mono bg-white/5 border border-white/10" 
                      />
                      <label className="px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-sky-400/40 text-sky-400 bg-sky-950/20 hover:bg-sky-400 hover:text-slate-950 transition-all shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload / Replace CV (PDF)</span>
                        <input 
                          type="file" 
                          accept="application/pdf" 
                          className="hidden" 
                          onChange={e => handleSingleFileUpload(e, url => setPersonInfo({ ...personInfo, resumeUrl: url }))} 
                        />
                      </label>
                      {personInfo.resumeUrl && (
                        <a 
                          href={personInfo.resumeUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:text-white border border-white/10 bg-white/5 shrink-0 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Test
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Identity & Hero Details */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                      Identity & Professional Headline
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <label className="text-xs block mb-1 text-zinc-400 font-sans">Full Name</label>
                        <input 
                          type="text" 
                          value={personInfo.name || ''} 
                          onChange={e => setPersonInfo({ ...personInfo, name: e.target.value })} 
                          className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10 focus:border-sky-400" 
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs block mb-1 text-zinc-400 font-sans">Professional Title / Role</label>
                        <input 
                          type="text" 
                          value={personInfo.title || personInfo.role || ''} 
                          onChange={e => setPersonInfo({ ...personInfo, title: e.target.value, role: e.target.value })} 
                          className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10 focus:border-sky-400" 
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs block mb-1 text-zinc-400 font-sans">Availability Status</label>
                        <input 
                          type="text" 
                          value={personInfo.status || ''} 
                          onChange={e => setPersonInfo({ ...personInfo, status: e.target.value })} 
                          placeholder="Open to AI & Full-Stack Opportunities" 
                          className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10 focus:border-sky-400" 
                        />
                      </div>

                      <div>
                        <label className="text-xs block mb-1 text-zinc-400 font-sans">Campus & City Location</label>
                        <input 
                          type="text" 
                          value={personInfo.location || ''} 
                          onChange={e => setPersonInfo({ ...personInfo, location: e.target.value })} 
                          placeholder="Daffodil Smart City, Ashulia, Dhaka, Bangladesh" 
                          className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10 focus:border-sky-400" 
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs block mb-1 text-zinc-400 font-sans">Hero Tagline</label>
                        <input 
                          type="text" 
                          value={personInfo.tagline || ''} 
                          onChange={e => setPersonInfo({ ...personInfo, tagline: e.target.value })} 
                          placeholder="Building High-Performance Web Systems, AI Solutions & Automated Intelligent Workflows" 
                          className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10 focus:border-sky-400" 
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs block mb-1 text-zinc-400 font-sans">Hero Subtitle / Leadership Headline</label>
                        <input 
                          type="text" 
                          value={personInfo.subtitle || personInfo.headline || ''} 
                          onChange={e => setPersonInfo({ ...personInfo, subtitle: e.target.value, headline: e.target.value })} 
                          placeholder="Bridging Software Engineering & AI Innovation | General Secretary, DIU-CPC" 
                          className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10 focus:border-sky-400" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact & Social Links */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                      Contact & Social Links
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <label className="text-xs block mb-1 text-zinc-400 font-sans">Direct Email</label>
                        <input 
                          type="email" 
                          value={personInfo.email || ''} 
                          onChange={e => setPersonInfo({ ...personInfo, email: e.target.value })} 
                          className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10" 
                        />
                      </div>

                      <div>
                        <label className="text-xs block mb-1 text-zinc-400 font-sans">Direct Phone</label>
                        <input 
                          type="text" 
                          value={personInfo.phone || ''} 
                          onChange={e => setPersonInfo({ ...personInfo, phone: e.target.value })} 
                          className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10" 
                        />
                      </div>

                      <div>
                        <label className="text-xs block mb-1 text-zinc-400 font-sans">GitHub URL</label>
                        <input 
                          type="text" 
                          value={personInfo.github || ''} 
                          onChange={e => setPersonInfo({ ...personInfo, github: e.target.value })} 
                          className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10" 
                        />
                      </div>

                      <div>
                        <label className="text-xs block mb-1 text-zinc-400 font-sans">LinkedIn URL</label>
                        <input 
                          type="text" 
                          value={personInfo.linkedin || ''} 
                          onChange={e => setPersonInfo({ ...personInfo, linkedin: e.target.value })} 
                          className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10" 
                        />
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* ================= 3. ABOUT & EDUCATION ================= */}
              {activeTab === 'about' && (
                <div className="space-y-6 font-sans">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h2 className="text-base font-bold text-white">About Me Content & Academic Education</h2>
                      <p className="text-xs text-zinc-400 font-mono">Edit bio narrative, career goals, leadership info, and university degrees</p>
                    </div>
                    <button 
                      onClick={() => handleSavePersonInfo()} 
                      disabled={saving} 
                      className="px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md font-mono" 
                      style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #00f2fe 100%)', color: '#08090D' }}
                    >
                      <Check className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save Narrative'}</span>
                    </button>
                  </div>

                  {/* About Narrative Textarea */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs block mb-1 text-zinc-400 font-sans">About Section Bold Headline</label>
                      <input 
                        type="text" 
                        value={personInfo.aboutHeadline || ''} 
                        onChange={e => setPersonInfo({ ...personInfo, aboutHeadline: e.target.value })} 
                        className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10" 
                      />
                    </div>

                    <div>
                      <label className="text-xs block mb-1 text-zinc-400 font-sans">Full Personal Introduction & Career Background</label>
                      <textarea 
                        rows={5} 
                        value={personInfo.about || personInfo.bio || ''} 
                        onChange={e => setPersonInfo({ ...personInfo, about: e.target.value, bio: e.target.value })} 
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none text-white font-sans bg-white/5 border border-white/10 leading-relaxed" 
                      />
                    </div>
                  </div>

                  {/* Education Management Table */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">Academic Qualifications ({education.length})</h3>
                        <p className="text-xs text-zinc-400 font-mono">Degrees, universities, CGPA, and coursework</p>
                      </div>
                      <button
                        onClick={() => setEditingEducation({
                          degree: 'BSc (Honors) in Computer Science and Engineering',
                          institution: 'Daffodil International University (DIU)',
                          period: '2021 - Present (58th Batch)',
                          cgpa: '3.85 / 4.00',
                          details: 'Specializing in Intelligent Systems, Deep Learning, and Web Engineering.'
                        })}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-sky-400 text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-sm hover:brightness-110"
                      >
                        <Plus className="w-3.5 h-3.5" /> + Add Degree
                      </button>
                    </div>

                    <div className="space-y-3">
                      {education.map((edu, idx) => (
                        <div key={edu.id || idx} className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-400/30">
                              {edu.period} • CGPA {edu.cgpa}
                            </span>
                            <h4 className="text-sm font-bold text-white font-sans pt-1">{edu.degree}</h4>
                            <p className="text-xs text-zinc-300 font-sans">{edu.institution}</p>
                            {edu.details && <p className="text-xs text-zinc-400 font-sans pt-1">{edu.details}</p>}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button 
                              onClick={() => setEditingEducation(edu)} 
                              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border border-sky-400/30 text-sky-400 hover:bg-sky-400 hover:text-slate-950 transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteEducation(edu.id)} 
                              className="p-1 rounded-lg text-zinc-400 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= 4. SKILLS MANAGEMENT ================= */}
              {activeTab === 'skills' && (
                <div className="space-y-5 font-sans">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-base font-bold text-white">Skills & Arsenal ({techSkills.length})</h2>
                      <p className="text-xs text-zinc-400 font-mono">Organize skills into the 8 requested categories with proficiency levels</p>
                    </div>

                    <button
                      onClick={() => setEditingSkill({ 
                        name: '', 
                        category: 'programming', 
                        level: 'Expert', 
                        proficiency: 90, 
                        icon: 'CodeIcon' 
                      })}
                      className="px-4 py-2 rounded-xl font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
                      style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #00f2fe 100%)', color: '#08090D' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Skill</span>
                    </button>
                  </div>

                  {/* Category Filter Bar */}
                  <div className="flex flex-wrap gap-1.5 pb-2">
                    <button
                      onClick={() => setSkillCategoryFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                        skillCategoryFilter === 'all' 
                          ? 'bg-sky-400 text-slate-950 border-sky-400 font-bold' 
                          : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      All ({techSkills.length})
                    </button>
                    {SKILL_CATEGORIES.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSkillCategoryFilter(c.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                          skillCategoryFilter === c.id 
                            ? 'bg-sky-400 text-slate-950 border-sky-400 font-bold' 
                            : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {c.label} ({techSkills.filter(s => s.category === c.id).length})
                      </button>
                    ))}
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredSkills.map((skill, idx) => (
                      <div key={skill.id || idx} className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white font-sans">{skill.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold">
                              {skill.level} ({skill.proficiency || 90}%)
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              &bull; {SKILL_CATEGORIES.find(c => c.id === skill.category)?.label || skill.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditingSkill(skill)} className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteSkill(skill.id)} className="p-1 rounded text-zinc-400 hover:text-red-400 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= 5. PROJECTS MANAGEMENT ================= */}
              {activeTab === 'projects' && (
                <div className="space-y-5 font-sans">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-base font-bold text-white">Projects Showcase ({projects.length})</h2>
                      <p className="text-xs text-zinc-400 font-mono">Full-stack apps, AI models, multiple gallery screenshots & live URLs</p>
                    </div>

                    <button
                      onClick={() => setEditingProject({ 
                        title: '', 
                        category: PROJECT_CATEGORIES[0], 
                        status: PROJECT_STATUSES[0], 
                        description: '', 
                        longDesc: '',
                        tech: 'Next.js 14, React 18, Node.js, PostgreSQL, Tailwind CSS', 
                        githubUrl: 'https://github.com/asifbillah', 
                        liveUrl: 'https://demo.vercel.app', 
                        image: '/tech1.jpg', 
                        gallery: '/tech1.jpg\n/tech2.JPG', 
                        metrics: '95+ Lighthouse Score',
                        time: '2024',
                        featured: true 
                      })}
                      className="px-4 py-2 rounded-xl font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
                      style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #00f2fe 100%)', color: '#08090D' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Create Project</span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search projects by title or category..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none text-white bg-white/5 border border-white/10 focus:border-sky-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProjects.map((project, idx) => (
                      <div key={project.id || idx} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="w-full h-36 rounded-lg overflow-hidden bg-black/40 border border-white/10 relative">
                            <img src={project.image || '/tech1.jpg'} alt={project.title} className="w-full h-full object-cover" />
                            {project.featured && (
                              <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-500/90 text-black">
                                ★ FEATURED
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-400/30 uppercase inline-block">
                            {project.category}
                          </span>
                          <h3 className="text-sm font-bold text-white font-sans">{project.title}</h3>
                          <p className="text-xs text-zinc-400 font-sans line-clamp-2">{project.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[160px]">
                            {project.metrics || project.time || ''}
                          </span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setEditingProject({
                                ...project,
                                gallery: Array.isArray(project.gallery) ? project.gallery.join('\n') : (project.gallery || '')
                              })} 
                              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border border-sky-400/40 text-sky-400 hover:bg-sky-400 hover:text-slate-950 transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(project.id)} 
                              className="p-1 rounded-lg text-zinc-400 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= 6. RESEARCH MANAGEMENT ================= */}
              {activeTab === 'research' && (
                <div className="space-y-5 font-sans">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-base font-bold text-white">Research & Medical AI ({researchPapers.length})</h2>
                      <p className="text-xs text-zinc-400 font-mono">Manage research papers, vision-language findings, abstracts, & citations</p>
                    </div>

                    <button
                      onClick={() => setEditingResearch({ 
                        title: '', 
                        domain: 'Medical AI & Vision-Language 🧠', 
                        mlTech: 'Deep Learning / Transformers', 
                        venue: 'IEEE (2024)', 
                        year: '2024', 
                        hardware: 'NVIDIA RTX 4090', 
                        metrics: '96.4% AUC ROC', 
                        abstract: 'Paper abstract and findings...', 
                        doi: '10.1109/BIBM.2024.10842', 
                        citation: 'Billah, A. et al. (2024).' 
                      })}
                      className="px-4 py-2 rounded-xl font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
                      style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #00f2fe 100%)', color: '#08090D' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Paper</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {researchPapers.map((paper, idx) => (
                      <div key={paper.id || idx} className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-400/30">
                            {paper.venue || 'IEEE'} • {paper.year}
                          </span>
                          <h3 className="text-sm font-bold text-white font-sans pt-1">{paper.title}</h3>
                          <p className="text-xs text-zinc-400 font-sans line-clamp-2">{paper.abstract}</p>
                          {paper.metrics && <p className="text-[11px] font-mono text-sky-400 pt-0.5">⚡ {paper.metrics}</p>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button 
                            onClick={() => setEditingResearch(paper)} 
                            className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border border-sky-400/40 text-sky-400 hover:bg-sky-400 hover:text-slate-950 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteResearch(paper.id)} 
                            className="p-1 rounded-lg text-zinc-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= 7. WORK EXPERIENCE & LEADERSHIP ================= */}
              {activeTab === 'experience' && (
                <div className="space-y-5 font-sans">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-base font-bold text-white">Experience & Leadership Timeline ({experiences.length})</h2>
                      <p className="text-xs text-zinc-400 font-mono">DIU-CPC General Secretary, software engineering, and technical operations</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {experiences.length > 0 && (
                        <button
                          type="button"
                          onClick={handleDeleteAllExperiences}
                          className="px-3 py-2 rounded-xl font-bold text-xs font-mono text-red-400 border border-red-500/30 hover:bg-red-500/10 cursor-pointer transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Remove Section
                        </button>
                      )}
                      <button
                        onClick={() => setEditingExperience({ 
                          role: '', 
                          organization: '', 
                          period: '2023 - Present', 
                          category: EXPERIENCE_CATEGORIES[0], 
                          logo: '/cpc1.jpg', 
                          bullets: 'Organized national competitions...\nDelivered technical solutions...' 
                        })}
                        className="px-4 py-2 rounded-xl font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
                        style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #00f2fe 100%)', color: '#08090D' }}
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add Experience</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {experiences.length === 0 ? (
                      <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center space-y-2">
                        <Briefcase className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-zinc-200">No Experience or Timeline entries</p>
                        <p className="text-xs text-zinc-400">The Experience &amp; Timeline section is currently completely hidden from your public website. Click &quot;+ Add Experience&quot; above if you ever want to re-enable it.</p>
                      </div>
                    ) : (
                      experiences.map((exp, idx) => (
                        <div key={exp.id || idx} className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono text-sky-400 font-bold bg-sky-500/10 border border-sky-400/30">
                              {exp.category} • {exp.period}
                            </span>
                            <h3 className="text-sm font-bold text-white font-sans pt-1">{exp.role}</h3>
                            <p className="text-xs text-zinc-400 font-sans">{exp.organization}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button 
                              onClick={() => setEditingExperience(exp)} 
                              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border border-sky-400/40 text-sky-400 hover:bg-sky-400 hover:text-slate-950 transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteExperience(exp.id)} 
                              className="p-1 rounded-lg text-zinc-400 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ================= 8. ACTIVITIES & EVENTS ================= */}
              {activeTab === 'campus' && (
                <div className="space-y-5 font-sans">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-base font-bold text-white">Activities, Workshops & Events ({activities.length})</h2>
                      <p className="text-xs text-zinc-400 font-mono">Upload multiple event photos, edit roles, dates, locations, & telemetry</p>
                    </div>

                    <button
                      onClick={() => setEditingActivity({ 
                        title: '', 
                        category: CAMPUS_CATEGORIES[0], 
                        role: 'General Secretary & Lead Organizer', 
                        year: '2023 - Present', 
                        impact: '500+ Participants',
                        stat: '500+ Students',
                        tag: 'Campus Leadership',
                        img: '/cpc2.jpg', 
                        gallery: '/cpc2.jpg\n/cpc1.jpg',
                        desc: 'Summary of event operations and achievements.' 
                      })}
                      className="px-4 py-2 rounded-xl font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
                      style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #00f2fe 100%)', color: '#08090D' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Event / Activity</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activities.map((act, idx) => {
                      const photoCount = getGalleryArray(act.gallery || act.images).length || (act.img ? 1 : 0);

                      return (
                        <div key={act.id || idx} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-black/40 border border-white/10 shadow-inner">
                              <img src={act.img || '/cpc1.jpg'} alt={act.title} className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 flex items-center gap-1">
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase bg-black/70 text-sky-400 border border-sky-400/30 backdrop-blur-md">
                                  {act.category}
                                </span>
                              </div>
                              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-black/80 text-white border border-white/10 shadow flex items-center gap-1">
                                  <Images className="w-3 h-3 text-sky-400" />
                                  <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                                </span>
                              </div>
                            </div>

                            <div className="pt-1">
                              <h3 className="text-sm font-bold text-white font-sans line-clamp-1">{act.title}</h3>
                              <p className="text-xs font-semibold text-sky-400 font-sans pt-0.5">{act.role}</p>
                              <p className="text-[11px] text-zinc-400 font-mono">{act.year || '2023 - Present'}</p>
                            </div>

                            {act.impact && (
                              <div className="text-[11px] px-2.5 py-1 rounded-lg font-mono font-semibold truncate bg-sky-500/10 text-sky-300 border border-sky-400/20">
                                ⚡ {act.impact}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[140px]">{act.tag || act.stat || ''}</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setEditingActivity({
                                  ...act,
                                  gallery: Array.isArray(act.gallery || act.images) 
                                    ? (act.gallery || act.images).join('\n') 
                                    : (act.gallery || act.images || act.img || '')
                                })} 
                                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold border border-sky-400/40 text-sky-400 hover:bg-sky-400 hover:text-slate-950 transition-all cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteActivity(act.id)} 
                                className="p-1 rounded-lg text-zinc-400 hover:text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= 9. INBOX & MESSAGES ================= */}
              {activeTab === 'messages' && (
                <div className="space-y-4 font-sans">
                  <div className="pb-3 border-b border-white/10">
                    <h2 className="text-base font-bold text-white">Visitor Contact Submissions ({messages.length})</h2>
                    <p className="text-xs text-zinc-400 font-mono">Inquiries and messages sent via the public contact form</p>
                  </div>

                  {messages.length === 0 ? (
                    <div className="p-8 text-center text-xs font-mono text-zinc-400 rounded-xl border border-white/10 bg-white/5">
                      No contact messages received yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg, idx) => (
                        <div key={msg.id || idx} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <div>
                              <span className="text-sm font-bold text-white font-sans">{msg.name}</span>
                              <a href={`mailto:${msg.email}`} className="text-xs font-mono text-sky-400 ml-2 underline">({msg.email})</a>
                              {msg.subject && (
                                <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full font-mono bg-sky-500/10 text-sky-300 border border-sky-400/20">
                                  {msg.subject}
                                </span>
                              )}
                            </div>
                            <button 
                              onClick={() => handleDeleteMessage(msg.id)} 
                              className="p-1 rounded-lg text-zinc-400 hover:text-red-400 cursor-pointer"
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          <div className="text-[10px] font-mono text-zinc-500">
                            Received: {msg.created_at ? new Date(msg.created_at).toLocaleString() : 'Recent'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================= 10. WEBSITE SETTINGS ================= */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-5 font-sans">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h2 className="text-base font-bold text-white">Website & Global SEO Settings</h2>
                      <p className="text-xs text-zinc-400 font-mono">Manage site metadata, favicon, logo, footer copyright, and social cards</p>
                    </div>
                    <button 
                      type="submit" 
                      disabled={saving} 
                      className="px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md font-mono" 
                      style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #00f2fe 100%)', color: '#08090D' }}
                    >
                      <Check className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <label className="text-xs block mb-1 text-zinc-400 font-sans">Website Title</label>
                      <input 
                        type="text" 
                        value={websiteSettings.title || ''} 
                        onChange={e => setWebsiteSettings({ ...websiteSettings, title: e.target.value })} 
                        placeholder="Asif Billah | Software Developer & AI Researcher" 
                        className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10" 
                      />
                    </div>

                    <div>
                      <label className="text-xs block mb-1 text-zinc-400 font-sans">Logo Brand Monogram</label>
                      <input 
                        type="text" 
                        value={websiteSettings.logo || ''} 
                        onChange={e => setWebsiteSettings({ ...websiteSettings, logo: e.target.value })} 
                        placeholder="AB" 
                        className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10" 
                      />
                    </div>

                    <div>
                      <label className="text-xs block mb-1 text-zinc-400 font-sans">SEO Meta Title</label>
                      <input 
                        type="text" 
                        value={websiteSettings.seoTitle || ''} 
                        onChange={e => setWebsiteSettings({ ...websiteSettings, seoTitle: e.target.value })} 
                        className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10" 
                      />
                    </div>

                    <div>
                      <label className="text-xs block mb-1 text-zinc-400 font-sans">Favicon Path</label>
                      <input 
                        type="text" 
                        value={websiteSettings.favicon || ''} 
                        onChange={e => setWebsiteSettings({ ...websiteSettings, favicon: e.target.value })} 
                        placeholder="/favicon.svg" 
                        className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-mono bg-white/5 border border-white/10" 
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs block mb-1 text-zinc-400 font-sans">SEO Meta Description</label>
                      <textarea 
                        rows={2} 
                        value={websiteSettings.seoDescription || ''} 
                        onChange={e => setWebsiteSettings({ ...websiteSettings, seoDescription: e.target.value })} 
                        className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10 text-xs" 
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs block mb-1 text-zinc-400 font-sans">Footer Text</label>
                      <input 
                        type="text" 
                        value={websiteSettings.footerText || ''} 
                        onChange={e => setWebsiteSettings({ ...websiteSettings, footerText: e.target.value })} 
                        placeholder="Crafted by Asif Billah. General Secretary, DIU-CPC • Daffodil International University." 
                        className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-sans bg-white/5 border border-white/10" 
                      />
                    </div>

                    <div className="sm:col-span-2 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Display Experience &amp; Timeline Section</span>
                        <span className="text-[11px] text-zinc-400 block font-sans">Turn on or off whether the Experience timeline is visible on the public website.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={websiteSettings.showExperience !== false} 
                          onChange={e => setWebsiteSettings({ ...websiteSettings, showExperience: e.target.checked })} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                      </label>
                    </div>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* ================= MODAL 1: PROJECTS WITH MULTI-IMAGE GALLERY ================= */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl relative border border-white/10 bg-[#101727] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">{editingProject.id ? '✏️ Edit Project' : '🚀 Create New Project'}</h3>
              <button onClick={() => setEditingProject(null)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-zinc-400">Project Title</label>
                  <input type="text" value={editingProject.title || ''} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} placeholder="e.g. Campus Gig" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Category</label>
                  <select 
                    value={editingProject.category || PROJECT_CATEGORIES[0]} 
                    onChange={e => setEditingProject({ ...editingProject, category: e.target.value })} 
                    className="w-full px-3 py-2 rounded-xl outline-none text-white cursor-pointer bg-white/5 border border-white/10"
                  >
                    {PROJECT_CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#101727' }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Status</label>
                  <select 
                    value={editingProject.status || PROJECT_STATUSES[0]} 
                    onChange={e => setEditingProject({ ...editingProject, status: e.target.value })} 
                    className="w-full px-3 py-2 rounded-xl outline-none text-white cursor-pointer bg-white/5 border border-white/10"
                  >
                    {PROJECT_STATUSES.map(s => <option key={s} value={s} style={{ background: '#101727' }}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Timeline / Date</label>
                  <input type="text" value={editingProject.time || ''} onChange={e => setEditingProject({ ...editingProject, time: e.target.value })} placeholder="2024" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-zinc-400">Tech Stack (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={Array.isArray(editingProject.tech) ? editingProject.tech.join(', ') : (editingProject.tech || '')} 
                    onChange={e => setEditingProject({ ...editingProject, tech: e.target.value })} 
                    placeholder="Next.js 14, React 18, Node.js, PyTorch, PostgreSQL" 
                    className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" 
                  />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">GitHub Repo URL</label>
                  <input type="text" value={editingProject.githubUrl || ''} onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })} placeholder="https://github.com/..." className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-mono text-[11px] bg-white/5 border border-white/10" />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Live Demo URL</label>
                  <input type="text" value={editingProject.liveUrl || ''} onChange={e => setEditingProject({ ...editingProject, liveUrl: e.target.value })} placeholder="https://..." className="w-full px-3.5 py-2 rounded-xl outline-none text-white font-mono text-[11px] bg-white/5 border border-white/10" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-zinc-400">Main Cover Image</label>
                <div className="flex items-center gap-2">
                  <input type="text" value={editingProject.image || ''} onChange={e => setEditingProject({ ...editingProject, image: e.target.value })} placeholder="/tech1.jpg" className="flex-1 px-3.5 py-2 rounded-xl outline-none text-white font-mono text-[11px] bg-white/5 border border-white/10" />
                  <label className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-sky-400/40 text-sky-400 bg-sky-950/20 hover:bg-sky-400 hover:text-slate-950 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Cover</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleSingleFileUpload(e, url => setEditingProject({ ...editingProject, image: url }))} />
                  </label>
                </div>
              </div>

              {/* Multi-Image Gallery */}
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Images className="w-4 h-4 text-sky-400" />
                    <label className="font-bold text-white text-xs">Project Gallery Screenshots ({getGalleryArray(editingProject.gallery).length})</label>
                  </div>

                  <label className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-sky-400 bg-sky-400 text-slate-950 shadow-sm hover:brightness-110">
                    <Upload className="w-3.5 h-3.5" />
                    <span>+ Upload Multiple Images</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={e => handleMultipleFilesUpload(e, urls => {
                        const current = getGalleryArray(editingProject.gallery);
                        const updated = [...current, ...urls];
                        setEditingProject({ ...editingProject, gallery: updated.join('\n') });
                      })} 
                    />
                  </label>
                </div>

                {/* Thumbnails Grid Preview */}
                {getGalleryArray(editingProject.gallery).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {getGalleryArray(editingProject.gallery).map((url, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/60 shadow-inner">
                        <img src={url} alt={`Gallery item ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const current = getGalleryArray(editingProject.gallery);
                            const updated = current.filter((_, idx) => idx !== i);
                            setEditingProject({ ...editingProject, gallery: updated.join('\n') });
                          }}
                          className="absolute top-1 right-1 p-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-md cursor-pointer transition-transform group-hover:scale-105"
                          title="Remove picture"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block mb-1 text-[11px] text-zinc-400 font-mono">Gallery Image URLs (One URL per line)</label>
                  <textarea rows={2} value={typeof editingProject.gallery === 'string' ? editingProject.gallery : (getGalleryArray(editingProject.gallery).join('\n'))} onChange={e => setEditingProject({ ...editingProject, gallery: e.target.value })} className="w-full px-3 py-2 rounded-xl outline-none text-white font-mono text-[11px] bg-black/40 border border-white/10" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-zinc-400">Short Summary</label>
                <textarea rows={2} value={editingProject.description || ''} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} placeholder="Short summary..." className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
              </div>

              <div>
                <label className="block mb-1 text-zinc-400">Long Architecture & Detailed Spec</label>
                <textarea rows={3} value={editingProject.longDesc || ''} onChange={e => setEditingProject({ ...editingProject, longDesc: e.target.value })} placeholder="Full architecture breakdown..." className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs cursor-pointer text-white">
                  <input type="checkbox" checked={Boolean(editingProject.featured)} onChange={e => setEditingProject({ ...editingProject, featured: e.target.checked })} className="rounded" />
                  <span>★ Featured Flagship Work</span>
                </label>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 rounded-xl font-bold cursor-pointer text-zinc-400">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md font-mono bg-sky-400 text-slate-950 hover:brightness-110"><Check className="w-4 h-4" /><span>Save Project</span></button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: WORK EXPERIENCE ================= */}
      {editingExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full max-w-xl rounded-2xl p-6 space-y-4 shadow-2xl relative border border-white/10 bg-[#101727] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">{editingExperience.id ? '✏️ Edit Experience Role' : '💼 Add Experience Role'}</h3>
              <button onClick={() => setEditingExperience(null)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-3 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-zinc-400">Role Title</label>
                  <input type="text" value={editingExperience.role || ''} onChange={e => setEditingExperience({ ...editingExperience, role: e.target.value })} placeholder="General Secretary" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Organization</label>
                  <input type="text" value={editingExperience.organization || ''} onChange={e => setEditingExperience({ ...editingExperience, organization: e.target.value })} placeholder="DIU Computer & Programming Club" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Category</label>
                  <select 
                    value={editingExperience.category || EXPERIENCE_CATEGORIES[0]} 
                    onChange={e => setEditingExperience({ ...editingExperience, category: e.target.value })} 
                    className="w-full px-3 py-2 rounded-xl outline-none text-white cursor-pointer bg-white/5 border border-white/10"
                  >
                    {EXPERIENCE_CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#101727' }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Timeline Period</label>
                  <input type="text" value={editingExperience.period || ''} onChange={e => setEditingExperience({ ...editingExperience, period: e.target.value })} placeholder="2023 - Present" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-zinc-400">Organization Logo (URL or Upload)</label>
                <div className="flex items-center gap-2">
                  <input type="text" value={editingExperience.logo || ''} onChange={e => setEditingExperience({ ...editingExperience, logo: e.target.value })} placeholder="/cpc1.jpg" className="flex-1 px-3.5 py-2 rounded-xl outline-none text-white font-mono text-[11px] bg-white/5 border border-white/10" />
                  <label className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-sky-400/40 text-sky-400 bg-sky-950/20 hover:bg-sky-400 hover:text-slate-950 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleSingleFileUpload(e, url => setEditingExperience({ ...editingExperience, logo: url }))} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-zinc-400">Key Achievements (One bullet per line)</label>
                <textarea rows={4} value={Array.isArray(editingExperience.bullets) ? editingExperience.bullets.join('\n') : (editingExperience.bullets || '')} onChange={e => setEditingExperience({ ...editingExperience, bullets: e.target.value })} placeholder="Spearheaded club events...\nOrganized hackathons..." className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setEditingExperience(null)} className="px-4 py-2 rounded-xl font-bold cursor-pointer text-zinc-400">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md font-mono bg-sky-400 text-slate-950 hover:brightness-110"><Check className="w-4 h-4" /><span>Save Role</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: CAMPUS ACTIVITY WITH MULTI-IMAGE ALBUM ================= */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl relative border border-white/10 bg-[#101727] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">{editingActivity.id ? '✏️ Edit Event / Activity' : '🏫 Add Event / Activity'}</h3>
              <button onClick={() => setEditingActivity(null)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-3.5 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-zinc-400">Activity / Event Name</label>
                  <input type="text" value={editingActivity.title || ''} onChange={e => setEditingActivity({ ...editingActivity, title: e.target.value })} placeholder="DIU CPC Take-Off Programming Contest" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Category</label>
                  <select 
                    value={editingActivity.category || CAMPUS_CATEGORIES[0]} 
                    onChange={e => setEditingActivity({ ...editingActivity, category: e.target.value })} 
                    className="w-full px-3 py-2 rounded-xl outline-none text-white cursor-pointer bg-white/5 border border-white/10"
                  >
                    {CAMPUS_CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#101727' }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Role / Position</label>
                  <input type="text" value={editingActivity.role || ''} onChange={e => setEditingActivity({ ...editingActivity, role: e.target.value })} placeholder="General Secretary & Lead Organizer" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Date / Year Range</label>
                  <input type="text" value={editingActivity.year || ''} onChange={e => setEditingActivity({ ...editingActivity, year: e.target.value })} placeholder="2023 - 2024" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Key Impact Metric</label>
                  <input type="text" value={editingActivity.impact || ''} onChange={e => setEditingActivity({ ...editingActivity, impact: e.target.value })} placeholder="500+ Freshmen Competitors • 8 Problem Arena Sets" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Location & Link</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={editingActivity.location || ''} onChange={e => setEditingActivity({ ...editingActivity, location: e.target.value })} placeholder="Daffodil Smart City" className="w-full px-3 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
                    <input type="text" value={editingActivity.link || ''} onChange={e => setEditingActivity({ ...editingActivity, link: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-zinc-400">Cover Image</label>
                <div className="flex items-center gap-2">
                  <input type="text" value={editingActivity.img || ''} onChange={e => setEditingActivity({ ...editingActivity, img: e.target.value })} placeholder="/cpc2.jpg" className="flex-1 px-3.5 py-2 rounded-xl outline-none text-white font-mono text-[11px] bg-white/5 border border-white/10" />
                  <label className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-sky-400/40 text-sky-400 bg-sky-950/20 hover:bg-sky-400 hover:text-slate-950 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Cover</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleSingleFileUpload(e, url => setEditingActivity({ ...editingActivity, img: url }))} />
                  </label>
                </div>
              </div>

              {/* Multi-Image Album Manager */}
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Images className="w-4 h-4 text-sky-400" />
                    <label className="font-bold text-white text-xs">Event Photographs ({getGalleryArray(editingActivity.gallery || editingActivity.images).length})</label>
                  </div>

                  <label className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-sky-400 bg-sky-400 text-slate-950 shadow-sm hover:brightness-110">
                    <Upload className="w-3.5 h-3.5" />
                    <span>+ Upload Multiple Photos</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={e => handleMultipleFilesUpload(e, urls => {
                        const current = getGalleryArray(editingActivity.gallery || editingActivity.images);
                        const updated = [...current, ...urls];
                        setEditingActivity({ 
                          ...editingActivity, 
                          gallery: updated.join('\n'),
                          images: updated,
                          img: editingActivity.img || updated[0] || ''
                        });
                      })} 
                    />
                  </label>
                </div>

                {/* Thumbnails Grid Preview with Individual Delete */}
                {getGalleryArray(editingActivity.gallery || editingActivity.images).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {getGalleryArray(editingActivity.gallery || editingActivity.images).map((url, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/60 shadow-inner">
                        <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const current = getGalleryArray(editingActivity.gallery || editingActivity.images);
                            const updated = current.filter((_, idx) => idx !== i);
                            setEditingActivity({ 
                              ...editingActivity, 
                              gallery: updated.join('\n'),
                              images: updated 
                            });
                          }}
                          className="absolute top-1 right-1 p-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-md cursor-pointer transition-transform group-hover:scale-105"
                          title="Remove this photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block mb-1 text-[11px] text-zinc-400 font-mono">Photo URLs (One per line)</label>
                  <textarea rows={2} value={typeof editingActivity.gallery === 'string' ? editingActivity.gallery : (getGalleryArray(editingActivity.gallery || editingActivity.images).join('\n'))} onChange={e => setEditingActivity({ ...editingActivity, gallery: e.target.value })} className="w-full px-3 py-2 rounded-xl outline-none text-white font-mono text-[11px] bg-black/40 border border-white/10" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-zinc-400">Detailed Description & Responsibilities</label>
                <textarea rows={3} value={editingActivity.desc || editingActivity.description || ''} onChange={e => setEditingActivity({ ...editingActivity, desc: e.target.value, description: e.target.value })} placeholder="Detailed summary of the activity..." className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setEditingActivity(null)} className="px-4 py-2 rounded-xl font-bold cursor-pointer text-zinc-400">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md font-mono bg-sky-400 text-slate-950 hover:brightness-110"><Check className="w-4 h-4" /><span>Save Activity</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: RESEARCH PAPERS ================= */}
      {editingResearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full max-w-xl rounded-2xl p-6 space-y-4 shadow-2xl relative border border-white/10 bg-[#101727] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">{editingResearch.id ? '✏️ Edit Paper' : '📚 Add Research Paper'}</h3>
              <button onClick={() => setEditingResearch(null)} className="p-1 text-zinc-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveResearch} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block mb-1 text-zinc-400">Paper Title</label>
                <input type="text" value={editingResearch.title || ''} onChange={e => setEditingResearch({ ...editingResearch, title: e.target.value })} placeholder="Explainable Multi-Label Brain CT Findings Detection..." className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-zinc-400">Domain Tag</label>
                  <input type="text" value={editingResearch.domain || ''} onChange={e => setEditingResearch({ ...editingResearch, domain: e.target.value })} placeholder="Medical AI & Vision-Language 🧠" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">ML Tech Tag</label>
                  <input type="text" value={editingResearch.mlTech || ''} onChange={e => setEditingResearch({ ...editingResearch, mlTech: e.target.value })} placeholder="Vision-Language / Transformers" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Venue / Journal</label>
                  <input type="text" value={editingResearch.venue || ''} onChange={e => setEditingResearch({ ...editingResearch, venue: e.target.value })} placeholder="IEEE BIBM (2024 / Under Review)" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">Publication Year</label>
                  <input type="text" value={editingResearch.year || ''} onChange={e => setEditingResearch({ ...editingResearch, year: e.target.value })} placeholder="2024" className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-zinc-400">Supporting Architecture Image (Upload or URL)</label>
                <div className="flex items-center gap-2">
                  <input type="text" value={editingResearch.img || ''} onChange={e => setEditingResearch({ ...editingResearch, img: e.target.value })} placeholder="/neuro.png" className="flex-1 px-3.5 py-2 rounded-xl outline-none text-white font-mono text-[11px] bg-white/5 border border-white/10" />
                  <label className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-sky-400/40 text-sky-400 bg-sky-950/20 hover:bg-sky-400 hover:text-slate-950 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleSingleFileUpload(e, url => setEditingResearch({ ...editingResearch, img: url }))} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-zinc-400">Abstract Summary</label>
                <textarea rows={3} value={editingResearch.abstract || ''} onChange={e => setEditingResearch({ ...editingResearch, abstract: e.target.value })} placeholder="Paper abstract and findings..." className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
              </div>
              <div>
                <label className="block mb-1 text-zinc-400">Citation String</label>
                <input type="text" value={editingResearch.citation || ''} onChange={e => setEditingResearch({ ...editingResearch, citation: e.target.value })} placeholder="Billah, A. et al. (2024)..." className="w-full px-3.5 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setEditingResearch(null)} className="px-4 py-2 rounded-xl font-bold cursor-pointer text-zinc-400">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md font-mono bg-sky-400 text-slate-950 hover:brightness-110"><Check className="w-4 h-4" /><span>Save Paper</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: TECH SKILLS ================= */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl relative border border-white/10 bg-[#101727]">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">{editingSkill.id ? 'Edit Skill' : 'Add Tech Skill'}</h3>
              <button onClick={() => setEditingSkill(null)} className="text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveSkill} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block mb-1 text-zinc-400">Skill Name</label>
                <input type="text" value={editingSkill.name || ''} onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })} placeholder="e.g. Next.js 14" className="w-full px-3 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
              </div>
              <div>
                <label className="block mb-1 text-zinc-400">Category</label>
                <select 
                  value={editingSkill.category || SKILL_CATEGORIES[0].id} 
                  onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value })} 
                  className="w-full px-3 py-2 rounded-xl outline-none text-white cursor-pointer bg-white/5 border border-white/10"
                >
                  {SKILL_CATEGORIES.map(c => <option key={c.id} value={c.id} style={{ background: '#101727' }}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-zinc-400">Proficiency Level</label>
                <select 
                  value={editingSkill.level || SKILL_LEVELS[0]} 
                  onChange={e => setEditingSkill({ ...editingSkill, level: e.target.value })} 
                  className="w-full px-3 py-2 rounded-xl outline-none text-white cursor-pointer bg-white/5 border border-white/10"
                >
                  {SKILL_LEVELS.map(l => <option key={l} value={l} style={{ background: '#101727' }}>{l}</option>)}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-400">Proficiency Percentage ({editingSkill.proficiency || 90}%)</label>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={editingSkill.proficiency || 90} 
                  onChange={e => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value, 10) })} 
                  className="w-full cursor-pointer accent-sky-400"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button type="button" onClick={() => setEditingSkill(null)} className="px-3 py-1.5 rounded-lg text-zinc-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg font-bold cursor-pointer font-mono bg-sky-400 text-slate-950 hover:brightness-110">Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 6: EDUCATION ================= */}
      {editingEducation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl relative border border-white/10 bg-[#101727]">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">{editingEducation.id ? 'Edit Education' : 'Add Education'}</h3>
              <button onClick={() => setEditingEducation(null)} className="text-zinc-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveEducation} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block mb-1 text-zinc-400">Degree Title</label>
                <input type="text" value={editingEducation.degree || ''} onChange={e => setEditingEducation({ ...editingEducation, degree: e.target.value })} placeholder="BSc (Honors) in Computer Science and Engineering" className="w-full px-3 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
              </div>
              <div>
                <label className="block mb-1 text-zinc-400">Institution / University</label>
                <input type="text" value={editingEducation.institution || ''} onChange={e => setEditingEducation({ ...editingEducation, institution: e.target.value })} placeholder="Daffodil International University (DIU)" className="w-full px-3 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-zinc-400">Period</label>
                  <input type="text" value={editingEducation.period || ''} onChange={e => setEditingEducation({ ...editingEducation, period: e.target.value })} placeholder="2021 - Present" className="w-full px-3 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
                </div>
                <div>
                  <label className="block mb-1 text-zinc-400">CGPA</label>
                  <input type="text" value={editingEducation.cgpa || ''} onChange={e => setEditingEducation({ ...editingEducation, cgpa: e.target.value })} placeholder="3.85 / 4.00" className="w-full px-3 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-zinc-400">Coursework / Details</label>
                <textarea rows={2} value={editingEducation.details || ''} onChange={e => setEditingEducation({ ...editingEducation, details: e.target.value })} placeholder="Specialized coursework..." className="w-full px-3 py-2 rounded-xl outline-none text-white bg-white/5 border border-white/10" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button type="button" onClick={() => setEditingEducation(null)} className="px-3 py-1.5 rounded-lg text-zinc-400 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg font-bold cursor-pointer font-mono bg-sky-400 text-slate-950 hover:brightness-110">Save Education</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
