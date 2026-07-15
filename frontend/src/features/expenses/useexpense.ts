import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "../../lib/apiClient";

export type Expense = {
  id: number;
  amount: string;
  category_id: number;
  account_id: number;
  merchant: string | null;
  expense_date: string;
  notes: string | null;
  tags: string | null;
};

export type ExpenseInput = {
  amount: number;
  category_id: number;
  account_id: number;
  merchant: string | null;
  expense_date: string;
  notes: string | null;
  tags: string | null;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiPut<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
}

export function useExpenses() {
  return useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: () => apiGet<Expense[]>("/api/v1/expenses"),
  });
}

function useInvalidateExpenseRelated() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
    queryClient.invalidateQueries({ queryKey: ["budgetStatus"] });
  };
}

export function useCreateExpense() {
  const invalidate = useInvalidateExpenseRelated();
  return useMutation({
    mutationFn: (input: ExpenseInput) => apiPost("/api/v1/expenses", input),
    onSuccess: invalidate,
  });
}

export function useUpdateExpense() {
  const invalidate = useInvalidateExpenseRelated();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ExpenseInput }) =>
      apiPut(`/api/v1/expenses/${id}`, input),
    onSuccess: invalidate,
  });
}

export function useDeleteExpense() {
  const invalidate = useInvalidateExpenseRelated();
  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/expenses/${id}`),
    onSuccess: invalidate,
  });
}