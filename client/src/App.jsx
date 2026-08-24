import { Navigate, Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import Overview from "./pages/Overview.jsx";
import Reports from "./pages/Reports.jsx";
import Lifecycle from "./pages/Lifecycle.jsx";
import Concerns from "./pages/Concerns.jsx";
import { getClient } from "./auth.js";
import { HomePage } from "./landing/pages/HomePage.jsx";
import { CampaignPage } from "./landing/pages/CampaignPage.jsx";

function Home() {
  return getClient() ? <Navigate to="/dashboard" replace /> : <HomePage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/run-a-campaign" element={<CampaignPage />} />

      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="reports" element={<Reports />} />
        <Route path="lifecycle" element={<Lifecycle />} />
        <Route path="concerns" element={<Concerns />} />
      </Route>
    </Routes>
  );
}
