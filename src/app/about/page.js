import { getServerPortfolioData } from '@/lib/serverPortfolio';
import StandalonePageLayout from '@/components/StandalonePageLayout';
import About from '@/components/About';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About | Asif Billah — Software Developer & AI Researcher',
  description: 'Academic background, BSc in CSE at Daffodil International University, DIU-CPC General Secretary tenure, and research objectives of Asif Billah.',
};

export default async function AboutPage() {
  const data = getServerPortfolioData();

  return (
    <StandalonePageLayout initialData={data}>
      <About
        personInfo={data.personInfo}
        stats={data.stats}
        education={data.education}
      />
    </StandalonePageLayout>
  );
}
