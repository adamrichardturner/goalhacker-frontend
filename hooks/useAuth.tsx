import { authService } from "@/services/authService"
import { LoginCredentials, RegisterCredentials } from "@/types/auth"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

const useAuth = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const loginUser = async (credentials: LoginCredentials) => {
    setLoading(true)
    try {
      const response = await authService.login(credentials)
      queryClient.setQueryData(["user"], response.user)
      router.push("/goals")
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signupUser = async (credentials: RegisterCredentials) => {
    setLoading(true)
    try {
      const response = await authService.register(credentials)
      if (response.success) {
        toast.success("Registered successfully")
        return true
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
    return false
  }

  const logoutUser = async () => {
    setLoading(true)
    try {
      await authService.logout()
      queryClient.removeQueries({ queryKey: ["user"] })
      document.cookie =
        "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      router.push("/")
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const verifyEmail = async (token: string, email: string) => {
    setLoading(true)
    try {
      await authService.verifyEmail(token, email)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const resendVerificationEmail = async () => {
    setLoading(true)
    try {
      await authService.resendVerificationEmail()
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setLoading(true)
    try {
      await authService.forgotPassword(email)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token: string, password: string) => {
    setLoading(true)
    try {
      await authService.resetPassword(token, password)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading: loading,
    loginUser,
    logoutUser,
    verifyEmail,
    resendVerificationEmail,
    resetPassword,
    forgotPassword,
    signupUser,
  }
}

export default useAuth
