import { getServerPortfolioData } from '@/lib/serverPortfolio';
import StandalonePageLayout from '@/components/StandalonePageLayout';
import Activities from '@/components/Activities';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Activities & Events | Asif Billah — DIU-CPC Leadership & Tournaments',
  description: 'Workshops, Take-Off Programming Contests, national hackathons, and extracurricular leadership by Asif Billah.',
};

export default async function ActivitiesPage() {
  const data = getServerPortfolioData();

  return (
    <StandalonePageLayout initialData={data}>
      <Activities activities={data.activities} />
    </StandalonePageLayout>
  );
}
