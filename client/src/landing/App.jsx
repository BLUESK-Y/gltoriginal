import { Route, Routes } from 'react-router-dom';

import { CampaignPage } from './pages/CampaignPage';
import { HomePage } from './pages/HomePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/run-a-campaign" element={<CampaignPage />} />
    </Routes>
  );
}
