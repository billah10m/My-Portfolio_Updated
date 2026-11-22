import { getServerPortfolioData } from '@/lib/serverPortfolio';
import PortfolioApp from '@/components/PortfolioApp';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = getServerPortfolioData();

  return <PortfolioApp initialData={data} />;
}
