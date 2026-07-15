import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../lib/apiClient";



type DashboardSummary = {
  total_income: string;
  total_expenses: string;
  current_balance: string;
  month_income: string;
  month_expenses: string;
};

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboardSummary"],
    queryFn: () => apiGet<DashboardSummary>("/api/v1/dashboard/summary"),
  });
}