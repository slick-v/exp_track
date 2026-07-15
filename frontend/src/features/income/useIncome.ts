import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "../../lib/apiClient";

export type Income = {
  id: number;
  amount: string;
  account_id: number;
  source: string | null;
  income_date: string;
  notes: string | null;
};

export type IncomeInput = {
  amount: number;
  account_id: number;
  source: string | null;
  income_date: string;
  notes: string | null;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function apiPut<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${path}`, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
}

export function useIncome() {
  return useQuery<Income[]>({ queryKey: ["income"], queryFn: () => apiGet<Income[]>("/api/v1/income") });
}

function useInvalidateIncomeRelated() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["income"] });
    queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
  };
}

export function useCreateIncome() {
  const invalidate = useInvalidateIncomeRelated();
  return useMutation({ mutationFn: (input: IncomeInput) => apiPost("/api/v1/income", input), onSuccess: invalidate });
}

export function useUpdateIncome() {
  const invalidate = useInvalidateIncomeRelated();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: IncomeInput }) => apiPut(`/api/v1/income/${id}`, input),
    onSuccess: invalidate,
  });
}

export function useDeleteIncome() {
  const invalidate = useInvalidateIncomeRelated();
  return useMutation({ mutationFn: (id: number) => apiDelete(`/api/v1/income/${id}`), onSuccess: invalidate });
}