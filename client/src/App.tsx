import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import WorldCup from "./pages/WorldCup";
import DailySchedule from "./pages/DailySchedule";
import FairPlay from "./pages/FairPlay";
import HeadToHead from "./pages/HeadToHead";
import Predictions from "./pages/Predictions";
import PredictionsRanking from "./pages/PredictionsRanking";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/world-cup" element={<WorldCup />} />
        <Route path="/daily-schedule" element={<DailySchedule />} />
        <Route path="/fair-play" element={<FairPlay />} />
        <Route path="/head-to-head" element={<HeadToHead />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/predictions-ranking" element={<PredictionsRanking />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
