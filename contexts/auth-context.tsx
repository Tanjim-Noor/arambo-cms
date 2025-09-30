"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

interface Admin {
  id: string
  username: string
  lastLogin?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  admin: Admin | null
  isLoading: boolean
  sessionDuration: string | null
  remainingTime: string
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// Token management utilities
class TokenManager {
  private static readonly TOKEN_KEY = 'arambo_admin_token'
  private static readonly TOKEN_EXPIRY_KEY = 'arambo_token_expiry'
  private static readonly SESSION_DURATION_KEY = 'arambo_session_duration'

  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(this.TOKEN_KEY)
  }

  // Parse expiry time from backend format (supports 15m, 2h, 1d, etc.)
  private static parseExpiryTime(expiresIn: string): number {
    const value = parseInt(expiresIn)
    const unit = expiresIn.slice(-1).toLowerCase()
    
    switch (unit) {
      case 'm': // minutes
        return value * 60 * 1000
      case 'h': // hours
        return value * 60 * 60 * 1000
      case 'd': // days
        return value * 24 * 60 * 60 * 1000
      case 's': // seconds
        return value * 1000
      default:
        // If no unit, assume minutes (backward compatibility)
        return value * 60 * 1000
    }
  }

  static setToken(token: string, expiresIn: string = '15m'): void {
    if (typeof window === 'undefined') return
    
    // Calculate expiry time based on backend expiresIn format
    const durationMs = this.parseExpiryTime(expiresIn)
    const expiryTime = new Date().getTime() + durationMs
    
    sessionStorage.setItem(this.TOKEN_KEY, token)
    sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString())
    sessionStorage.setItem(this.SESSION_DURATION_KEY, expiresIn)
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem(this.TOKEN_KEY)
    sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY)
    sessionStorage.removeItem(this.SESSION_DURATION_KEY)
  }

  static isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true
    
    const expiryTime = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY)
    if (!expiryTime) return true
    
    return new Date().getTime() > parseInt(expiryTime)
  }

  static isTokenValid(): boolean {
    const token = this.getToken()
    return token !== null && !this.isTokenExpired()
  }

  // Get session duration in human-readable format
  static getSessionDuration(): string | null {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(this.SESSION_DURATION_KEY)
  }

  // Get remaining session time in milliseconds
  static getRemainingTime(): number {
    if (typeof window === 'undefined') return 0
    
    const expiryTime = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY)
    if (!expiryTime) return 0
    
    const remaining = parseInt(expiryTime) - new Date().getTime()
    return remaining > 0 ? remaining : 0
  }

  // Format remaining time for display
  static getFormattedRemainingTime(): string {
    const remaining = this.getRemainingTime()
    if (remaining <= 0) return 'Expired'
    
    const minutes = Math.floor(remaining / (60 * 1000))
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000)
    
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}h ${remainingMinutes}m`
    }
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    
    return `${seconds}s`
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionDuration, setSessionDuration] = useState<string | null>(null)
  const [remainingTime, setRemainingTime] = useState<string>('--')
  const router = useRouter()

  // Check authentication status
  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = TokenManager.getToken()
      
      if (!token || TokenManager.isTokenExpired()) {
        return false
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.admin) {
          setAdmin(data.admin)
          setIsAuthenticated(true)
          return true
        }
      }

      // Token is invalid
      TokenManager.removeToken()
      return false
    } catch (error) {
      console.error('Auth check failed:', error)
      TokenManager.removeToken()
      return false
    }
  }

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        TokenManager.setToken(data.data.accessToken, data.data.expiresIn)
        setAdmin(data.data.admin)
        setIsAuthenticated(true)
        setSessionDuration(data.data.expiresIn)
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.data.admin.username}! Session expires in ${data.data.expiresIn}.`,
        })
        
        return true
      } else {
        // Handle specific error cases
        if (response.status === 429) {
          toast({
            title: "Too Many Attempts",
            description: data.message || "Too many login attempts. Please try again later.",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Login Failed",
            description: data.message || "Invalid username or password.",
            variant: "destructive"
          })
        }
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive"
      })
      return false
    }
  }

  // Logout function
  const logout = useCallback(async () => {
    try {
      const token = TokenManager.getToken()
      
      if (token) {
        // Call logout endpoint
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clean up local state
      TokenManager.removeToken()
      setAdmin(null)
      setIsAuthenticated(false)
      setSessionDuration(null)
      setRemainingTime('--')
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      
      router.push('/login')
    }
  }, [router])

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      const isValid = await checkAuth()
      if (isValid) {
        // Restore session duration from storage
        const duration = TokenManager.getSessionDuration()
        setSessionDuration(duration)
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  // Update remaining time every second when authenticated
  useEffect(() => {
    if (!isAuthenticated) return

    const updateRemainingTime = () => {
      const formatted = TokenManager.getFormattedRemainingTime()
      setRemainingTime(formatted)
    }

    // Update immediately
    updateRemainingTime()

    // Update every second
    const interval = setInterval(updateRemainingTime, 1000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  // Auto-logout on token expiry (check every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && TokenManager.isTokenExpired()) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        })
        logout()
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [isAuthenticated, logout])

  const value: AuthContextType = {
    isAuthenticated,
    admin,
    isLoading,
    sessionDuration,
    remainingTime,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Export TokenManager for use in API calls
export { TokenManager }