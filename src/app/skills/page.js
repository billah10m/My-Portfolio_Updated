import { getServerPortfolioData } from '@/lib/serverPortfolio';
import StandalonePageLayout from '@/components/StandalonePageLayout';
import TechStack from '@/components/TechStack';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Skills & Arsenal | Asif Billah — Technical Stack & Engineering Capabilities',
  description: 'Explore Asif Billah\'s engineering stack across Programming Languages, Frontend, Backend, AI/ML, Medical Research, and Digital Marketing.',
};

export default async function SkillsPage() {
  const data = getServerPortfolioData();

  return (
    <StandalonePageLayout initialData={data}>
      <TechStack
        categories={data.techCategories}
        skills={data.techSkills}
        projects={data.projects}
      />
    </StandalonePageLayout>
  );
}
