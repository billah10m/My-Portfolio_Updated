import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as defaultData from '@/data/portfolio';

export const dynamic = 'force-dynamic';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'portfolio.json');

function readPortfolioFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read portfolio.json:", err);
  }
  return {
    personInfo: defaultData.personInfo,
    stats: defaultData.stats,
    education: defaultData.education,
    techCategories: defaultData.techCategories,
    techSkills: defaultData.techSkills,
    projects: defaultData.projects,
    researchPapers: defaultData.researchPapers,
    experiences: defaultData.experiences,
    activities: defaultData.activities,
    websiteSettings: defaultData.websiteSettings
  };
}

function writePortfolioFile(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Failed to write portfolio.json:", err);
    return false;
  }
}

export async function GET() {
  const data = readPortfolioFile();
  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const currentData = readPortfolioFile();

    const { section, data: sectionData, fullData } = body;

    let updated;
    if (fullData) {
      updated = { ...currentData, ...fullData };
    } else if (section && sectionData !== undefined) {
      updated = { ...currentData, [section]: sectionData };
    } else {
      updated = { ...currentData, ...body };
    }

    const success = writePortfolioFile(updated);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Could not write to disk' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
