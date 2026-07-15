import { NavLink, Outlet } from "react-router-dom";
import { useLogout } from "../features/auth/useCurrentUser";

export default function Layout() {
  const logout = useLogout();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "font-semibold text-slate-800" : "text-slate-500";

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Expense Tracker</h1>
        <nav className="space-x-4 text-sm">
          <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/budgets" className={linkClass}>Budgets</NavLink>
          <NavLink to="/goals" className={linkClass}>Goals</NavLink>
            <NavLink to="/voice-entry" className={linkClass}>🎤 Voice Entry</NavLink>
          <button onClick={() => logout.mutate()} className="text-slate-500 underline">
            Log out
          </button>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}