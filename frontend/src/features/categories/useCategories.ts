import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../lib/apiClient";

type Category = {
  id: number;
  name: string;
  is_default: boolean;
};

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => apiGet<Category[]>("/api/v1/categories"),
  });
}