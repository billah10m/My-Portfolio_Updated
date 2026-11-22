import { getServerPortfolioData } from '@/lib/serverPortfolio';
import StandalonePageLayout from '@/components/StandalonePageLayout';
import Research from '@/components/Research';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Research & Publications | Asif Billah — Medical AI & Vision-Language',
  description: 'Academic deep learning research in multi-label cranial CT findings detection and report generation by Asif Billah.',
};

export default async function ResearchPage() {
  const data = getServerPortfolioData();

  return (
    <StandalonePageLayout initialData={data}>
      <Research researchPapers={data.researchPapers} />
    </StandalonePageLayout>
  );
}
