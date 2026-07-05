import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/layout/Shell";
import { LoginPage } from "./features/auth/LoginPage";
import { ChatPage } from "./features/chat/ChatPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { InterviewPage } from "./features/interview/InterviewPage";
import { LandingPage } from "./features/landing/LandingPage";
import { PortfolioPage } from "./features/portfolio/PortfolioPage";
import { useAuthStore } from "./store/authStore";

const Protected = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  return token ? <Shell>{children}</Shell> : <Navigate to="/login" replace />;
};

export const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
    <Route path="/chat" element={<Protected><ChatPage mode="chat" /></Protected>} />
    <Route path="/recruiter" element={<Protected><ChatPage mode="recruiter" /></Protected>} />
    <Route path="/portfolio" element={<Protected><PortfolioPage /></Protected>} />
    <Route path="/interview" element={<Protected><InterviewPage /></Protected>} />
  </Routes>
);
