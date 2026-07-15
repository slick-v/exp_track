import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../lib/apiClient";

type BudgetStatus = {
  budget: {
    id: number;
    category_id: number | null;
    month: string;
    limit_amount: string;
  };
  spent: string;
  remaining: string;
  percent_used: number;
  is_over_budget: boolean;
};

export function useBudgetStatus(month: string) {
  return useQuery<BudgetStatus[]>({
    queryKey: ["budgetStatus", month],
    queryFn: () => apiGet<BudgetStatus[]>(`/api/v1/budgets/status?month=${month}`),
  });
}