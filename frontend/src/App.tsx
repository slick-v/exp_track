import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./app/Layout";
import ProtectedRoute from "./app/ProtectedRoute";
import RegisterForm from "./features/auth/RegistrationForm";
import LoginForm from "./features/auth/LoginForm";
import DashboardPage from "./features/dashboard/DashboardPage";
import BudgetsPage from "./features/budgets/BudgetPage";
import GoalsPage from "./features/goals/GoalPage"
import { useNavigate } from "react-router-dom";
import VoiceExpenseEntry from "./features/ai/VoiceExpenseEntry";
import { useQueryClient } from "@tanstack/react-query";

function LoginPage() {
  const navigate = useNavigate();
  return <LoginForm onLoginSuccess={() => navigate("/")} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<div className="min-h-screen bg-slate-50 pt-12"><RegisterForm /></div>} />
        <Route path="/login" element={<div className="min-h-screen bg-slate-50 pt-12"><LoginPage /></div>} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/voice-entry" element={<VoiceEntryPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


function VoiceEntryPage() {
  const queryClient = useQueryClient();
  return (
    <div className="p-6">
      <VoiceExpenseEntry
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
          queryClient.invalidateQueries({ queryKey: ["budgetStatus"] });
        }}
      />
    </div>
  );
}
export default App;