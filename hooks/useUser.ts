import { useQuery } from "@tanstack/react-query"
import { authService } from "@/services/authService"
import { User } from "@/types/auth"
import { useRouter } from "next/navigation"

export const useUser = () => {
  const router = useRouter()

  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await authService.getProfile()
        return response.user
      } catch (error) {
        if ((error as Error).message.includes("Unauthorized")) {
          router.push("/login")
        }
        throw error
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: true,
  })
}
