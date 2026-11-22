import { getServerPortfolioData } from '@/lib/serverPortfolio';
import StandalonePageLayout from '@/components/StandalonePageLayout';
import Contact from '@/components/Contact';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact & Connect | Asif Billah — Get In Touch',
  description: 'Reach out to Asif Billah for software engineering roles, AI research collaboration, or technical speaking invitations.',
};

export default async function ContactPage() {
  const data = getServerPortfolioData();

  return (
    <StandalonePageLayout initialData={data}>
      <Contact personInfo={data.personInfo} />
    </StandalonePageLayout>
  );
}
