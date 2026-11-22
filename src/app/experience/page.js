import { redirect } from 'next/navigation';
import { getServerPortfolioData } from '@/lib/serverPortfolio';
import StandalonePageLayout from '@/components/StandalonePageLayout';
import Experience from '@/components/Experience';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Work Experience & Roles | Asif Billah — Career History',
  description: 'Professional software engineering experience, roles, leadership tenures, and key project deliveries of Asif Billah.',
};

export default async function ExperiencePage() {
  const data = getServerPortfolioData();

  if (!data.experiences || data.experiences.length === 0 || data.websiteSettings?.showExperience === false) {
    redirect('/');
  }

  return (
    <StandalonePageLayout initialData={data}>
      <Experience experiences={data.experiences} />
    </StandalonePageLayout>
  );
}
