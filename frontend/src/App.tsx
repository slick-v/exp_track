import RegisterForm from "./features/auth/RegistrationForm";
import LoginForm from "./features/auth/LoginForm";
import { useState } from "react";

function App() {
  const [view, setView] = useState<"register" | "login" | "loggedIn">("register");

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