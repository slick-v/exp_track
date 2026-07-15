import { useState } from "react";
import RegisterForm from "./features/auth/RegistrationForm";
import LoginForm from "./features/auth/LoginForm";
import DashboardPage from "./features/dashboard/DashboardPage";
import BudgetsPage from "./features/budgets/BudgetsPage";

import { useCurrentUser, useLogout } from "./features/auth/useCurrentUser";




function App() {
  const [authview, setAuthView] = useState<"register" | "login" | "loggedIn">("register");
  const [page, setPage] = useState<"dashboard" | "budgets">("dashboard");
  const { data: user, isLoading, refetch } = useCurrentUser();
  // const { data: user, isLoading, refetch } = useCurrentUser();
  const logout = useLogout();

  if (isLoading) {
    return <p className="text-center py-20">Loading…</p>;
  }

  if (user) {
    return (
      <div className="min-h-screen bg-slate-100">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800">Expense Tracker</h1>
          <nav className="space-x-4 text-sm">
            <button onClick={() => setPage("dashboard")} className={page === "dashboard" ? "font-semibold" : "text-slate-500"}>
              Dashboard
            </button>
            <button onClick={() => setPage("budgets")} className={page === "budgets" ? "font-semibold" : "text-slate-500"}>
              Budgets
            </button>
          <button onClick={() => logout.mutate()} className="text-sm underline text-slate-600">
            Log out
          </button>
          </nav>
        </header>
        {page === "dashboard" ? <DashboardPage /> : <BudgetsPage />}
      {/* </div> */}
        <DashboardPage />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-800 text-center py-8">
        Expense Tracker
      </h1>

      <div className="text-center mb-4 space-x-4">
        <button onClick={() => setAuthView("register")} className="text-sm underline">
          Register
        </button>
        <button onClick={() => setAuthView("login")} className="text-sm underline">
          Login
        </button>
      </div>

      {authview === "register" && <RegisterForm />}
      {authview === "login" && <LoginForm onLoginSuccess={() => refetch()} />}
      {/* {view === "loggedIn" && (
      // <p className="text-center text-green-600">You're logged in! Cookie is set.</p>
      )} */}
    </div>
  );
}

export default App;