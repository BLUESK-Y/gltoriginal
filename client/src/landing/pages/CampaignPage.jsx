import { HomeTopBar } from '../components/HomeTopBar';
import { CampaignEstimator } from '../sections/CampaignEstimator';

export function CampaignPage() {
  return (
    <div className="bg-paper">
      <HomeTopBar />

      <main id="main">
        <CampaignEstimator />
      </main>
    </div>
  );
}
