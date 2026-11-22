import * as fallbackData from '../data/portfolio';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('your-supabase-project')
);

let supabaseInstance = null;

export async function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  if (supabaseInstance) return supabaseInstance;

  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    return supabaseInstance;
  } catch (error) {
    console.warn("Failed to initialize Supabase client:", error);
    return null;
  }
}

// LocalStorage helpers
function getLocalCache(key, defaultValue) {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(`portfolio_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalCache(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`portfolio_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn("LocalStorage write error:", e);
  }
}

// Helper to push section changes to server-side JSON file
async function syncServerDisk(section, data) {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, data })
    });
  } catch (err) {
    console.warn(`Server disk sync notice for ${section}:`, err);
  }
}

// ====================================================================
// DATA NORMALIZERS (DB -> Frontend)
// ====================================================================

function normalizePersonInfo(p) {
  if (!p) return fallbackData.personInfo;
  return {
    ...fallbackData.personInfo,
    ...p,
    name: p.name || fallbackData.personInfo.name,
    title: p.title || p.role || fallbackData.personInfo.title,
    role: p.role || p.title || fallbackData.personInfo.title,
    about: p.about || p.bio || fallbackData.personInfo.about,
    bio: p.bio || p.about || fallbackData.personInfo.bio,
    aboutHeadline: p.aboutHeadline || p.aboutheadline || fallbackData.personInfo.aboutHeadline,
    headline: p.headline || p.aboutHeadline || fallbackData.personInfo.headline,
    tagline: p.tagline || fallbackData.personInfo.tagline,
    status: p.status || p.availability || fallbackData.personInfo.status,
    skills: Array.isArray(p.skills) ? p.skills : (typeof p.skills === 'string' ? p.skills.split(',').map(s => s.trim()).filter(Boolean) : fallbackData.personInfo.skills),
    avatar: p.avatar || p.avatar_url || fallbackData.personInfo.avatar,
    resumeUrl: p.resumeurl || p.resumeUrl || p.resume_url || fallbackData.personInfo.resumeUrl,
    github: p.github || p.github_url || fallbackData.personInfo.github,
    linkedin: p.linkedin || p.linkedin_url || fallbackData.personInfo.linkedin,
    twitter: p.twitter || p.twitter_url || fallbackData.personInfo.twitter,
    location: p.location || fallbackData.personInfo.location,
    email: p.email || fallbackData.personInfo.email,
    phone: p.phone || fallbackData.personInfo.phone
  };
}

function normalizeProject(p) {
  if (!p) return p;
  const techArr = Array.isArray(p.tech) 
    ? p.tech 
    : typeof p.tech === 'string' 
    ? p.tech.split(',').map(s => s.trim()).filter(Boolean) 
    : [];
  
  const galleryArr = Array.isArray(p.gallery) 
    ? p.gallery 
    : typeof p.gallery === 'string' 
    ? p.gallery.split('\n').map(s => s.trim()).filter(Boolean) 
    : (p.image ? [p.image] : []);

  return {
    ...p,
    tech: techArr,
    gallery: galleryArr.length > 0 ? galleryArr : (p.image ? [p.image] : []),
    description: p.description || p.longdesc || p.longDesc || '',
    longDesc: p.longdesc || p.longDesc || p.description || '',
    longdesc: p.longdesc || p.longDesc || p.description || '',
    githubUrl: p.githuburl || p.githubUrl || p.github_url || '',
    githuburl: p.githuburl || p.githubUrl || p.github_url || '',
    liveUrl: p.liveurl || p.liveUrl || p.live_url || '',
    liveurl: p.liveurl || p.liveUrl || p.live_url || '',
    metrics: p.metrics || '',
    category: p.category || 'Full-Stack Web App',
    featured: Boolean(p.featured)
  };
}

function normalizeExperience(exp) {
  if (!exp) return exp;
  const bulletsArr = Array.isArray(exp.bullets)
    ? exp.bullets
    : typeof exp.bullets === 'string'
    ? exp.bullets.split('\n').map(s => s.trim()).filter(Boolean)
    : [];

  return {
    ...exp,
    bullets: bulletsArr,
    role: exp.role || '',
    organization: exp.organization || exp.company || '',
    period: exp.period || '2023 - Present',
    category: exp.category || 'Leadership',
    logo: exp.logo || '/cpc1.jpg'
  };
}

function normalizeActivity(act) {
  if (!act) return act;
  const galleryArr = Array.isArray(act.gallery)
    ? act.gallery
    : typeof act.gallery === 'string'
    ? act.gallery.split('\n').map(s => s.trim()).filter(Boolean)
    : (act.img ? [act.img] : []);

  return {
    ...act,
    gallery: galleryArr,
    images: galleryArr,
    img: act.img || (galleryArr.length > 0 ? galleryArr[0] : '/cpc1.jpg'),
    desc: act.desc || act.description || '',
    description: act.desc || act.description || '',
    tag: act.tag || 'Campus Leadership'
  };
}

function normalizeResearch(r) {
  if (!r) return r;
  return {
    ...r,
    mlTech: r.mltech || r.mlTech || '',
    mltech: r.mltech || r.mlTech || '',
    pdfUrl: r.pdfurl || r.pdfUrl || '/Asif_Billah_CV.pdf',
    pdfurl: r.pdfurl || r.pdfUrl || '/Asif_Billah_CV.pdf',
    venue: r.venue || r.journal || '',
    status: r.status || 'Research in Progress',
    metrics: r.metrics || ''
  };
}

// ====================================================================
// MAIN PORTFOLIO DATA FETCHER
// ====================================================================

export async function getPortfolioData() {
  const supabase = await getSupabaseClient();

  if (!supabase) {
    if (typeof window !== 'undefined') {
      try {
        const apiRes = await fetch('/api/portfolio');
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          return {
            personInfo: normalizePersonInfo(apiData.personInfo || getLocalCache('personInfo', fallbackData.personInfo)),
            stats: Array.isArray(apiData.stats) ? apiData.stats : getLocalCache('stats', fallbackData.stats),
            techCategories: apiData.techCategories || fallbackData.techCategories,
            techSkills: Array.isArray(apiData.techSkills) ? apiData.techSkills : getLocalCache('techSkills', fallbackData.techSkills),
            projects: Array.isArray(apiData.projects) ? apiData.projects.map(normalizeProject) : getLocalCache('projects', fallbackData.projects).map(normalizeProject),
            researchPapers: Array.isArray(apiData.researchPapers) ? apiData.researchPapers.map(normalizeResearch) : getLocalCache('researchPapers', fallbackData.researchPapers).map(normalizeResearch),
            experiences: Array.isArray(apiData.experiences) ? apiData.experiences.map(normalizeExperience) : [],
            activities: Array.isArray(apiData.activities) ? apiData.activities.map(normalizeActivity) : getLocalCache('activities', fallbackData.activities).map(normalizeActivity),
            education: Array.isArray(apiData.education) ? apiData.education : getLocalCache('education', fallbackData.education),
            websiteSettings: apiData.websiteSettings || getLocalCache('websiteSettings', fallbackData.websiteSettings),
            isLiveSupabase: false
          };
        }
      } catch (err) {
        console.warn("Client fetch /api/portfolio error, falling back:", err);
      }
    }

    return {
      personInfo: normalizePersonInfo(getLocalCache('personInfo', fallbackData.personInfo)),
      stats: getLocalCache('stats', fallbackData.stats),
      techCategories: fallbackData.techCategories,
      techSkills: getLocalCache('techSkills', fallbackData.techSkills),
      projects: getLocalCache('projects', fallbackData.projects).map(normalizeProject),
      researchPapers: getLocalCache('researchPapers', fallbackData.researchPapers).map(normalizeResearch),
      experiences: getLocalCache('experiences', []),
      activities: getLocalCache('activities', fallbackData.activities).map(normalizeActivity),
      education: getLocalCache('education', fallbackData.education),
      websiteSettings: getLocalCache('websiteSettings', fallbackData.websiteSettings),
      isLiveSupabase: false
    };
  }

  try {
    const [
      { data: personInfoData },
      { data: projectsData },
      { data: skillsData },
      { data: researchData },
      { data: experiencesData },
      { data: activitiesData },
      { data: statsData },
      { data: educationData }
    ] = await Promise.all([
      supabase.from('person_info').select('*').limit(1).maybeSingle(),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('tech_skills').select('*'),
      supabase.from('research_papers').select('*'),
      supabase.from('experiences').select('*').order('created_at', { ascending: false }),
      supabase.from('activities').select('*').order('created_at', { ascending: false }),
      supabase.from('stats').select('*'),
      supabase.from('education').select('*')
    ]);

    return {
      personInfo: normalizePersonInfo(personInfoData),
      stats: (statsData && statsData.length > 0) ? statsData : fallbackData.stats,
      techCategories: fallbackData.techCategories,
      techSkills: (skillsData && skillsData.length > 0) ? skillsData : fallbackData.techSkills,
      projects: (projectsData && projectsData.length > 0) ? projectsData.map(normalizeProject) : fallbackData.projects.map(normalizeProject),
      researchPapers: (researchData && researchData.length > 0) ? researchData.map(normalizeResearch) : fallbackData.researchPapers.map(normalizeResearch),
      experiences: (experiencesData && experiencesData.length > 0) ? experiencesData.map(normalizeExperience) : fallbackData.experiences.map(normalizeExperience),
      activities: (activitiesData && activitiesData.length > 0) ? activitiesData.map(normalizeActivity) : fallbackData.activities.map(normalizeActivity),
      education: (educationData && educationData.length > 0) ? educationData : fallbackData.education,
      websiteSettings: getLocalCache('websiteSettings', fallbackData.websiteSettings),
      isLiveSupabase: true
    };
  } catch (error) {
    console.warn("Supabase fetch failed, utilizing local fallback:", error);
    return {
      personInfo: normalizePersonInfo(getLocalCache('personInfo', fallbackData.personInfo)),
      stats: getLocalCache('stats', fallbackData.stats),
      techCategories: fallbackData.techCategories,
      techSkills: getLocalCache('techSkills', fallbackData.techSkills),
      projects: getLocalCache('projects', fallbackData.projects).map(normalizeProject),
      researchPapers: getLocalCache('researchPapers', fallbackData.researchPapers).map(normalizeResearch),
      experiences: getLocalCache('experiences', fallbackData.experiences).map(normalizeExperience),
      activities: getLocalCache('activities', fallbackData.activities).map(normalizeActivity),
      education: getLocalCache('education', fallbackData.education),
      websiteSettings: getLocalCache('websiteSettings', fallbackData.websiteSettings),
      isLiveSupabase: false
    };
  }
}

// ====================================================================
// CRUD HELPERS (SUPABASE + LOCAL STORAGE + DISK SYNC)
// ====================================================================

function upsertLocalItem(key, fallbackList, itemData) {
  const currentList = getLocalCache(key, fallbackList);
  let updated;
  if (itemData.id) {
    const exists = currentList.some(i => i.id === itemData.id);
    if (exists) {
      updated = currentList.map(i => i.id === itemData.id ? { ...i, ...itemData } : i);
    } else {
      updated = [{ ...itemData }, ...currentList];
    }
  } else {
    const newItem = { id: `item-${Date.now()}`, ...itemData };
    updated = [newItem, ...currentList];
  }
  setLocalCache(key, updated);
  syncServerDisk(key, updated);
  return { data: itemData, success: true };
}

function deleteLocalItem(key, fallbackList, id) {
  const currentList = getLocalCache(key, fallbackList);
  const updated = currentList.filter(i => i.id !== id);
  setLocalCache(key, updated);
  syncServerDisk(key, updated);
  return { success: true };
}

/** Save Person Info */
export async function savePersonInfo(infoData) {
  const supabase = await getSupabaseClient();
  const payload = {
    ...infoData,
    name: infoData.name || 'Asif Billah',
    title: infoData.title || infoData.role || 'Software Developer & AI Researcher',
    role: infoData.role || infoData.title || 'Software Developer & AI Researcher',
    tagline: infoData.tagline || '',
    aboutHeadline: infoData.aboutHeadline || infoData.aboutheadline || '',
    headline: infoData.headline || infoData.aboutHeadline || '',
    status: infoData.status || infoData.availability || 'Open to AI & Full-Stack Opportunities',
    about: infoData.about || infoData.bio || '',
    bio: infoData.bio || infoData.about || '',
    email: infoData.email || 'asifbillah.cse@gmail.com',
    location: infoData.location || 'Daffodil Smart City, Ashulia, Dhaka, Bangladesh',
    skills: Array.isArray(infoData.skills) ? infoData.skills : (typeof infoData.skills === 'string' ? infoData.skills.split(',').map(s => s.trim()).filter(Boolean) : []),
    avatar: infoData.avatar || infoData.avatar_url || '/cpc1.jpg',
    resumeurl: infoData.resumeUrl || infoData.resumeurl || infoData.resume_url || '/Asif_Billah_CV.pdf',
    github: infoData.github || infoData.github_url || 'https://github.com/asifbillah',
    linkedin: infoData.linkedin || infoData.linkedin_url || 'https://linkedin.com/in/asifbillah',
    twitter: infoData.twitter || infoData.twitter_url || 'https://twitter.com/asifbillah',
    updated_at: new Date()
  };

  setLocalCache('personInfo', payload);
  syncServerDisk('personInfo', payload);

  if (!supabase) {
    return { data: payload, success: true };
  }

  try {
    const { data: existing } = await supabase.from('person_info').select('id').limit(1).maybeSingle();
    if (existing?.id) {
      const { data, error } = await supabase.from('person_info').update(payload).eq('id', existing.id).select();
      if (error) throw error;
      return { data, success: true };
    } else {
      const { data, error } = await supabase.from('person_info').insert([payload]).select();
      if (error) throw error;
      return { data, success: true };
    }
  } catch (err) {
    console.error("savePersonInfo Supabase error:", err);
    return { data: payload, error: err.message, success: true };
  }
}

/** Save Project */
export async function saveProject(projectData) {
  const supabase = await getSupabaseClient();
  const payload = {
    title: projectData.title || '',
    category: projectData.category || 'Full-Stack Web App',
    status: projectData.status || 'LIVE DEMO',
    description: projectData.description || '',
    longdesc: projectData.longDesc || projectData.longdesc || projectData.description || '',
    tech: Array.isArray(projectData.tech) ? projectData.tech.join(', ') : (projectData.tech || ''),
    githuburl: projectData.githubUrl || projectData.githuburl || projectData.github_url || '',
    liveurl: projectData.liveUrl || projectData.liveurl || projectData.live_url || '',
    image: projectData.image || '',
    gallery: Array.isArray(projectData.gallery) ? projectData.gallery.join('\n') : (projectData.gallery || projectData.image || ''),
    metrics: projectData.metrics || '',
    time: projectData.time || '2024',
    featured: Boolean(projectData.featured)
  };

  const formattedForLocal = {
    ...projectData,
    ...payload,
    tech: Array.isArray(projectData.tech) ? projectData.tech : payload.tech.split(',').map(s => s.trim()),
    gallery: Array.isArray(projectData.gallery) ? projectData.gallery : payload.gallery.split('\n').map(s => s.trim()).filter(Boolean)
  };

  const localRes = upsertLocalItem('projects', fallbackData.projects, formattedForLocal);

  if (!supabase) {
    return localRes;
  }

  try {
    if (projectData.id && typeof projectData.id === 'string' && projectData.id.length > 20) {
      const { data, error } = await supabase.from('projects').update(payload).eq('id', projectData.id).select();
      if (error) throw error;
      return { data, success: true };
    } else {
      const { data, error } = await supabase.from('projects').insert([payload]).select();
      if (error) throw error;
      return { data, success: true };
    }
  } catch (err) {
    console.error("saveProject Supabase error:", err);
    return { data: payload, error: err.message, success: true };
  }
}

/** Delete Project */
export async function deleteProject(id) {
  deleteLocalItem('projects', fallbackData.projects, id);
  const supabase = await getSupabaseClient();
  if (!supabase) return { success: true };

  try {
    const { data, error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return { data, success: true };
  } catch (err) {
    console.error("deleteProject Supabase error:", err);
    return { error: err.message };
  }
}

/** Save Experience */
export async function saveExperience(expData) {
  const supabase = await getSupabaseClient();
  const payload = {
    role: expData.role || '',
    organization: expData.organization || expData.company || '',
    category: expData.category || 'Leadership',
    period: expData.period || '2023 - Present',
    startyear: expData.startYear || expData.startyear || '2023',
    endyear: expData.endYear || expData.endyear || 'Present',
    logo: expData.logo || '/cpc1.jpg',
    description: expData.description || '',
    bullets: Array.isArray(expData.bullets) ? expData.bullets.join('\n') : (expData.bullets || '')
  };

  const formattedForLocal = {
    ...expData,
    ...payload,
    bullets: Array.isArray(expData.bullets) ? expData.bullets : payload.bullets.split('\n').filter(Boolean)
  };

  const localRes = upsertLocalItem('experiences', fallbackData.experiences, formattedForLocal);

  if (!supabase) {
    return localRes;
  }

  try {
    if (expData.id && typeof expData.id === 'string' && expData.id.length > 20) {
      const { data, error } = await supabase.from('experiences').update(payload).eq('id', expData.id).select();
      if (error) throw error;
      return { data, success: true };
    } else {
      const { data, error } = await supabase.from('experiences').insert([payload]).select();
      if (error) throw error;
      return { data, success: true };
    }
  } catch (err) {
    console.error("saveExperience error:", err);
    return { data: payload, error: err.message, success: true };
  }
}

/** Delete Experience */
export async function deleteExperience(id) {
  deleteLocalItem('experiences', fallbackData.experiences, id);
  const supabase = await getSupabaseClient();
  if (!supabase) return { success: true };

  try {
    const { data, error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) throw error;
    return { data, success: true };
  } catch (err) {
    return { error: err.message };
  }
}

/** Save Activity */
export async function saveActivity(actData) {
  const supabase = await getSupabaseClient();
  const galleryVal = Array.isArray(actData.gallery) 
    ? actData.gallery.join('\n') 
    : (actData.gallery || actData.img || '');

  const payload = {
    title: actData.title || '',
    category: actData.category || 'University Events',
    role: actData.role || 'General Secretary & Lead Organizer',
    year: actData.year || '2023 - 2024',
    impact: actData.impact || '',
    stat: actData.stat || '',
    tag: actData.tag || 'Campus Leadership',
    location: actData.location || 'Daffodil Smart City, Dhaka',
    link: actData.link || '',
    img: actData.img || (Array.isArray(actData.gallery) && actData.gallery[0] ? actData.gallery[0] : '/cpc1.jpg'),
    gallery: galleryVal,
    desc: actData.desc || actData.description || ''
  };

  const formattedForLocal = {
    ...actData,
    ...payload,
    gallery: Array.isArray(actData.gallery) ? actData.gallery : payload.gallery.split('\n').filter(Boolean)
  };

  const localRes = upsertLocalItem('activities', fallbackData.activities, formattedForLocal);

  if (!supabase) {
    return localRes;
  }

  try {
    if (actData.id && typeof actData.id === 'string' && actData.id.length > 20) {
      const { data, error } = await supabase.from('activities').update(payload).eq('id', actData.id).select();
      if (error) throw error;
      return { data, success: true };
    } else {
      const { data, error } = await supabase.from('activities').insert([payload]).select();
      if (error) throw error;
      return { data, success: true };
    }
  } catch (err) {
    console.error("saveActivity error:", err);
    return { data: payload, error: err.message, success: true };
  }
}

/** Delete Activity */
export async function deleteActivity(id) {
  deleteLocalItem('activities', fallbackData.activities, id);
  const supabase = await getSupabaseClient();
  if (!supabase) return { success: true };

  try {
    const { data, error } = await supabase.from('activities').delete().eq('id', id);
    if (error) throw error;
    return { data, success: true };
  } catch (err) {
    return { error: err.message };
  }
}

/** Save Tech Skill */
export async function saveTechSkill(skillData) {
  const supabase = await getSupabaseClient();
  const payload = {
    name: skillData.name || '',
    category: skillData.category || 'frontend',
    level: skillData.level || 'Expert',
    proficiency: parseInt(skillData.proficiency, 10) || 90,
    icon: skillData.icon || 'CodeIcon'
  };

  const localRes = upsertLocalItem('techSkills', fallbackData.techSkills, { ...skillData, ...payload });

  if (!supabase) {
    return localRes;
  }

  try {
    if (skillData.id && typeof skillData.id === 'string' && skillData.id.length > 20) {
      const { data, error } = await supabase.from('tech_skills').update(payload).eq('id', skillData.id).select();
      if (error) throw error;
      return { data, success: true };
    } else {
      const { data, error } = await supabase.from('tech_skills').insert([payload]).select();
      if (error) throw error;
      return { data, success: true };
    }
  } catch (err) {
    console.error("saveTechSkill error:", err);
    return { data: payload, error: err.message, success: true };
  }
}

/** Delete Tech Skill */
export async function deleteTechSkill(id) {
  deleteLocalItem('techSkills', fallbackData.techSkills, id);
  const supabase = await getSupabaseClient();
  if (!supabase) return { success: true };

  try {
    const { data, error } = await supabase.from('tech_skills').delete().eq('id', id);
    if (error) throw error;
    return { data, success: true };
  } catch (err) {
    return { error: err.message };
  }
}

/** Save Stat */
export async function saveStat(statData) {
  const supabase = await getSupabaseClient();
  const payload = {
    label: statData.label || '',
    value: statData.value || '',
    description: statData.description || ''
  };

  const localRes = upsertLocalItem('stats', fallbackData.stats, { ...statData, ...payload });
  if (!supabase) return localRes;

  try {
    if (statData.id && typeof statData.id === 'string' && statData.id.length > 20) {
      const { data, error } = await supabase.from('stats').update(payload).eq('id', statData.id).select();
      if (error) throw error;
      return { data, success: true };
    } else {
      const { data, error } = await supabase.from('stats').insert([payload]).select();
      if (error) throw error;
      return { data, success: true };
    }
  } catch (err) {
    return { data: payload, error: err.message, success: true };
  }
}

/** Delete Stat */
export async function deleteStat(id) {
  deleteLocalItem('stats', fallbackData.stats, id);
  const supabase = await getSupabaseClient();
  if (!supabase) return { success: true };

  try {
    const { data, error } = await supabase.from('stats').delete().eq('id', id);
    if (error) throw error;
    return { data, success: true };
  } catch (err) {
    return { error: err.message };
  }
}

/** Save Research Paper */
export async function saveResearch(researchData) {
  const supabase = await getSupabaseClient();
  const payload = {
    title: researchData.title || '',
    domain: researchData.domain || '',
    mltech: researchData.mlTech || researchData.mltech || '',
    venue: researchData.venue || researchData.journal || '',
    year: parseInt(researchData.year, 10) || 2024,
    abstract: researchData.abstract || '',
    pdfurl: researchData.pdfUrl || researchData.pdfurl || '',
    doi: researchData.doi || '',
    citation: researchData.citation || '',
    metrics: researchData.metrics || '',
    hardware: researchData.hardware || '',
    status: researchData.status || 'Research in Progress',
    img: researchData.img || '/neuro.png'
  };

  const localRes = upsertLocalItem('researchPapers', fallbackData.researchPapers, { ...researchData, ...payload });
  if (!supabase) return localRes;

  try {
    if (researchData.id && typeof researchData.id === 'string' && researchData.id.length > 20) {
      const { data, error } = await supabase.from('research_papers').update(payload).eq('id', researchData.id).select();
      if (error) throw error;
      return { data, success: true };
    } else {
      const { data, error } = await supabase.from('research_papers').insert([payload]).select();
      if (error) throw error;
      return { data, success: true };
    }
  } catch (err) {
    console.error("saveResearch error:", err);
    return { data: payload, error: err.message, success: true };
  }
}

/** Delete Research Paper */
export async function deleteResearch(id) {
  deleteLocalItem('researchPapers', fallbackData.researchPapers, id);
  const supabase = await getSupabaseClient();
  if (!supabase) return { success: true };

  try {
    const { data, error } = await supabase.from('research_papers').delete().eq('id', id);
    if (error) throw error;
    return { data, success: true };
  } catch (err) {
    return { error: err.message };
  }
}

/** Save Education */
export async function saveEducation(eduData) {
  const supabase = await getSupabaseClient();
  const payload = {
    degree: eduData.degree || '',
    institution: eduData.institution || '',
    period: eduData.period || '2021 - Present',
    cgpa: eduData.cgpa || '',
    details: eduData.details || ''
  };

  const localRes = upsertLocalItem('education', fallbackData.education, { ...eduData, ...payload });

  // Synchronize stats[0] with the new CGPA so the About section updates instantly
  const cleanCgpa = (payload.cgpa || '').replace(/\/.*$/, '').replace(/cgpa/i, '').trim();
  if (cleanCgpa) {
    const currentStats = getLocalCache('stats', fallbackData.stats);
    if (Array.isArray(currentStats) && currentStats.length > 0) {
      currentStats[0] = { ...currentStats[0], value: cleanCgpa };
      setLocalCache('stats', currentStats);
      syncServerDisk('stats', currentStats);
    }
  }

  if (!supabase) return localRes;

  try {
    if (eduData.id && typeof eduData.id === 'string' && eduData.id.length > 20) {
      const { data, error } = await supabase.from('education').update(payload).eq('id', eduData.id).select();
      if (error) throw error;
      return { data, success: true };
    } else {
      const { data, error } = await supabase.from('education').insert([payload]).select();
      if (error) throw error;
      return { data, success: true };
    }
  } catch (err) {
    return { data: payload, error: err.message, success: true };
  }
}

/** Delete Education */
export async function deleteEducation(id) {
  deleteLocalItem('education', fallbackData.education, id);
  const supabase = await getSupabaseClient();
  if (!supabase) return { success: true };

  try {
    const { data, error } = await supabase.from('education').delete().eq('id', id);
    if (error) throw error;
    return { data, success: true };
  } catch (err) {
    return { error: err.message };
  }
}

/** Save Website Settings */
export async function saveWebsiteSettings(settings) {
  setLocalCache('websiteSettings', settings);
  syncServerDisk('websiteSettings', settings);
  return { success: true, data: settings };
}

// ====================================================================
// CONTACT & INQUIRIES
// ====================================================================

export async function submitContactMessage(msgData) {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
      const data = await res.json();
      if (data.success) return data;
    } catch (e) {
      console.warn("Contact API call failed, falling back to client cache:", e);
    }
  }

  const supabase = await getSupabaseClient();
  const payload = {
    name: msgData.name || '',
    email: msgData.email || '',
    subject: msgData.subject || '',
    message: msgData.message || '',
    is_read: false
  };

  if (!supabase) {
    const currentMsgs = getLocalCache('messages', []);
    const newMsg = { id: `msg-${Date.now()}`, ...payload, created_at: new Date().toISOString() };
    setLocalCache('messages', [newMsg, ...currentMsgs]);
    return { success: true, isMock: true };
  }

  try {
    const { data, error } = await supabase.from('messages').insert([payload]).select();
    if (error) throw error;
    return { data, success: true };
  } catch (err) {
    return { error: err.message, success: false };
  }
}

export async function getContactMessages() {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const json = await res.json();
        if (json.data) return { data: json.data };
      }
    } catch {}
  }

  const supabase = await getSupabaseClient();
  if (!supabase) {
    return { data: getLocalCache('messages', []) };
  }

  try {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    return { data: data || [], error };
  } catch (err) {
    return { data: getLocalCache('messages', []), error: err.message };
  }
}

export async function deleteContactMessage(id) {
  if (typeof window !== 'undefined') {
    try {
      await fetch(`/api/contact?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {}
  }

  deleteLocalItem('messages', [], id);
  const supabase = await getSupabaseClient();
  if (!supabase) return { success: true };

  try {
    const { data, error } = await supabase.from('messages').delete().eq('id', id);
    return { data, error, success: !error };
  } catch (err) {
    return { error: err.message };
  }
}

// ====================================================================
// PERSISTENT IMAGE UPLOADER (LOCAL DISK + SUPABASE STORAGE)
// ====================================================================

export async function uploadImageToSupabase(file) {
  if (!file) return { url: '' };

  // 1. Try server-side persistent upload to /uploads/
  if (typeof window !== 'undefined') {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success && data.url) {
        // Also mirror to Supabase if credentials are present
        const supabase = await getSupabaseClient();
        if (supabase) {
          try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
            await supabase.storage.from('portfolio-images').upload(`uploads/${fileName}`, file, { upsert: true });
          } catch {}
        }
        return { url: data.url, isLocal: false };
      }
    } catch (err) {
      console.warn("Direct /api/upload failed, trying Supabase Storage:", err);
    }
  }

  // 2. Direct Supabase Storage fallback
  const supabase = await getSupabaseClient();
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(filePath);

        return { url: publicUrl, isLocal: false };
      }
    } catch (err) {
      console.warn("Storage upload exception:", err);
    }
  }

  // 3. Fallback to FileReader base64
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result, isLocal: true });
    };
    reader.readAsDataURL(file);
  });
}

// Multiple file uploader helper
export async function uploadMultipleImages(files) {
  const urls = [];
  for (const file of files) {
    const res = await uploadImageToSupabase(file);
    if (res.url) urls.push(res.url);
  }
  return urls;
}

// ====================================================================
// AUTHENTICATION
// ====================================================================

export async function signInAdmin(email, password) {
  // Call server auth API first
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_auth_status', 'true');
        return { data: { user: data.user }, error: null };
      }
    } catch {}
  }

  const supabase = await getSupabaseClient();
  if (!supabase) {
    return { data: null, error: { message: 'Invalid admin credentials.' } };
  }
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpAdmin(email, password) {
  const supabase = await getSupabaseClient();
  if (!supabase) return { data: null, error: { message: 'Supabase is not configured' } };
  return await supabase.auth.signUp({ email, password });
}

export async function signOutAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_auth_status');
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
  }
  const supabase = await getSupabaseClient();
  if (!supabase) return { error: null };
  return await supabase.auth.signOut();
}

export async function getAdminSession() {
  if (typeof window !== 'undefined') {
    const isCached = localStorage.getItem('admin_auth_status') === 'true';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/auth/me', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json.authenticated) {
          localStorage.setItem('admin_auth_status', 'true');
          return { session: true, user: json.user, error: null };
        }
      }
    } catch (err) {
      console.warn("Session check notice:", err);
    }

    if (isCached) {
      return { session: true, user: { email: 'asifbillah.cse@gmail.com', name: 'Asif Billah' }, error: null };
    }
  }

  const supabase = await getSupabaseClient();
  if (!supabase) {
    return { session: null, user: null };
  }
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, user: session?.user || null, error };
  } catch {
    return { session: null, user: null };
  }
}

export async function onAdminAuthStateChange(callback) {
  const supabase = await getSupabaseClient();
  if (!supabase) return { unsubscribe: () => {} };
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}
