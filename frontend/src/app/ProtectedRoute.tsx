import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../features/auth/useCurrentUser";

export default function ProtectedRoute() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <p className="text-center py-20">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}