import { getServerPortfolioData } from '@/lib/serverPortfolio';
import StandalonePageLayout from '@/components/StandalonePageLayout';
import Projects from '@/components/Projects';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects | Asif Billah — Campus Gig, Orivo & AI Systems',
  description: 'Production software systems, collegiate microjobs platforms, enterprise e-commerce, and deep learning medical models architected by Asif Billah.',
};

export default async function ProjectsPage() {
  const data = getServerPortfolioData();

  return (
    <StandalonePageLayout initialData={data}>
      <Projects
        projects={data.projects}
        techSkills={data.techSkills}
      />
    </StandalonePageLayout>
  );
}
