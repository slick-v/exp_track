import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../lib/apiClient";

export type Account = { id: number; name: string; account_type: string };

export function useAccounts() {
  return useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: () => apiGet<Account[]>("/api/v1/accounts"),
  });
}