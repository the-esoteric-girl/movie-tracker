import { Routes, Route } from "react-router-dom";
import FindPage from "./pages/FindPage";
import SavedPage from "./pages/SavedPage";
import SeenPage from "./pages/SeenPage";
import YouPage from "./pages/YouPage";
import BottomNav from "./components/BottomNav";
import "./App.css";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<FindPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/seen" element={<SeenPage />} />
        <Route path="/you" element={<YouPage />} />
      </Routes>
      <BottomNav />
    </>
  );
}
