import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { apiGet,apiPost} from "../../lib/apiClient";

type UserResponse = {
  id: number;
  email: string;
  full_name: string | null;
};

export function useCurrentUser() {
  return useQuery<UserResponse>({
    queryKey: ["currentUser"],
    queryFn: () => apiGet<UserResponse>("/api/v1/me"),
    retry: false,
  });
}


export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiPost("/api/v1/logout", {}),
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}