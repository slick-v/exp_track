import RegisterForm from "./features/auth/RegistrationForm";
import LoginForm from "./features/auth/LoginForm";
import { useState } from "react";
import { useCurrentUser, useLogout } from "./features/auth/useCurrentUser";



function App() {
  const [view, setView] = useState<"register" | "login" | "loggedIn">("register");
  const { data: user, isLoading, refetch } = useCurrentUser();
  const logout = useLogout();

   if (isLoading) {
    return <p className="text-center py-20">Loading…</p>;
  }

  if (user) {
    return (
      <div className="min-h-screen bg-slate-50 text-center py-20">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Expense Tracker</h1>
        <p className="text-green-600">Logged in as {user.email}</p>

         <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="text-sm underline text-slate-600"
        >
        {logout.isPending ? "Logging out…" : "Log out"}
        </button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-800 text-center py-8">
        Expense Tracker
      </h1>

      <div className="text-center mb-4 space-x-4">
        <button onClick={() => setView("register")} className="text-sm underline">
          Register
        </button>
        <button onClick={() => setView("login")} className="text-sm underline">
          Login
        </button>
      </div>

      {view === "register" && <RegisterForm />}
      {view === "login" && <LoginForm onLoginSuccess={() => setView("loggedIn")} />}
      {view === "loggedIn" && (
      <p className="text-center text-green-600">You're logged in! Cookie is set.</p>
      )}
    </div>
  );
}

export default App;