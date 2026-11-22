import fs from 'fs';
import path from 'path';
import * as defaultData from '@/data/portfolio';

export function getServerPortfolioData() {
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'portfolio.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        personInfo: { ...defaultData.personInfo, ...(parsed.personInfo || {}) },
        stats: Array.isArray(parsed.stats) ? parsed.stats : defaultData.stats,
        techCategories: parsed.techCategories || defaultData.techCategories,
        techSkills: Array.isArray(parsed.techSkills) ? parsed.techSkills : defaultData.techSkills,
        projects: Array.isArray(parsed.projects) ? parsed.projects : defaultData.projects,
        researchPapers: Array.isArray(parsed.researchPapers) ? parsed.researchPapers : defaultData.researchPapers,
        experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
        activities: Array.isArray(parsed.activities) ? parsed.activities : defaultData.activities,
        education: Array.isArray(parsed.education) ? parsed.education : defaultData.education,
        websiteSettings: parsed.websiteSettings || defaultData.websiteSettings
      };
    }
  } catch (err) {
    console.error("Failed to read portfolio.json on server:", err);
  }
  return defaultData;
}
