import { Property, Trip, Truck, Furniture, PropertyStats } from '../types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// Token management for API calls
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json"
  }
  
  // Only add auth header in browser environment
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('arambo_admin_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

// Enhanced fetch function with auth handling
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  // Handle authentication errors globally
  if (response.status === 401) {
    // Token expired or invalid
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('arambo_admin_token')
      sessionStorage.removeItem('arambo_token_expiry')
      
      // Redirect to login page
      window.location.href = '/login'
    }
    throw new Error('Authentication required')
  }

  return response
}

// Determine if an operation requires authentication
const requiresAuth = (method: string): boolean => {
  return ['PUT', 'DELETE'].includes(method.toUpperCase())
}

export const api = {
  // Authentication API
  auth: {
    login: async (username: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      return response.json()
    },
    verify: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      })
      return response.json()
    },
    status: async (token?: string) => {
      const headers: HeadersInit = { "Content-Type": "application/json" }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${API_BASE_URL}/auth/status`, { headers })
      return response.json()
    },
    logout: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      })
      return response.json()
    },
    health: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/health`)
      return response.json()
    }
  },

  // Properties API
  properties: {
    getAll: async (params?: Record<string, string | number | boolean>) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value))
          }
        })
      }
      const url = `${API_BASE_URL}/properties${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch properties")
      return response.json()
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`)
      if (!response.ok) throw new Error("Failed to fetch property")
      return response.json()
    },
    create: async (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error("Failed to create property")
      return response.json()
    },
    update: async (id: string, data: Partial<Property>) => {
      const response = await authenticatedFetch(`${API_BASE_URL}/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
      
      if (!response.ok) throw new Error("Failed to update property")
      return response.json()
    },
    delete: async (id: string) => {
      const response = await authenticatedFetch(`${API_BASE_URL}/properties/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete property")
      return response.json()
    },
    getStats: async (): Promise<PropertyStats> => {
      const response = await fetch(`${API_BASE_URL}/properties/stats`)
      if (!response.ok) throw new Error("Failed to fetch property stats")
      return response.json()
    },
  },

  // Trips API
  trips: {
    getAll: async (): Promise<Trip[]> => {
      const response = await fetch(`${API_BASE_URL}/trips`)
      if (!response.ok) throw new Error("Failed to fetch trips")
      return response.json()
    },
    getById: async (id: string): Promise<Trip> => {
      const response = await fetch(`${API_BASE_URL}/trips/${id}`)
      if (!response.ok) throw new Error("Failed to fetch trip")
      return response.json()
    },
    create: async (data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create trip")
      return response.json()
    },
    update: async (id: string, data: Partial<Trip>) => {
      const response = await authenticatedFetch(`${API_BASE_URL}/trips/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update trip: ${errorText}`)
      }
      return response.json()
    },
    delete: async (id: string) => {
      const response = await authenticatedFetch(`${API_BASE_URL}/trips/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete trip")
      return response.json()
    },
  },

  // Trucks API
  trucks: {
    getAll: async (): Promise<Truck[]> => {
      const response = await fetch(`${API_BASE_URL}/trucks`)
      if (!response.ok) throw new Error("Failed to fetch trucks")
      return response.json()
    },
    getById: async (id: string): Promise<Truck> => {
      const response = await fetch(`${API_BASE_URL}/trucks/${id}`)
      if (!response.ok) throw new Error("Failed to fetch truck")
      return response.json()
    },
    create: async (data: Omit<Truck, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch(`${API_BASE_URL}/trucks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create truck")
      return response.json()
    },
    update: async (id: string, data: Partial<Truck>) => {
      const response = await authenticatedFetch(`${API_BASE_URL}/trucks/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to update truck")
      return response.json()
    },
    delete: async (id: string) => {
      const response = await authenticatedFetch(`${API_BASE_URL}/trucks/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete truck")
      return response.json()
    },
  },

  // Furniture API
  furniture: {
    getAll: async (params?: Record<string, string | number | boolean>): Promise<Furniture[]> => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value))
          }
        })
      }
      const url = `${API_BASE_URL}/furniture${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch furniture")
      const result = await response.json()
      // Backend returns {data: [...]} format, we need just the array
      const furnitureList = result.data || result
      // Convert _id to id for consistency
      return furnitureList.map((item: Record<string, unknown>) => ({
        ...item,
        id: item._id || item.id
      }))
    },
    getById: async (id: string): Promise<Furniture> => {
      const response = await fetch(`${API_BASE_URL}/furniture/${id}`)
      if (!response.ok) throw new Error("Failed to fetch furniture")
      const result = await response.json()
      // Convert _id to id for consistency
      if (result._id && !result.id) {
        result.id = result._id
      }
      return result
    },
    create: async (data: Omit<Furniture, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch(`${API_BASE_URL}/furniture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create furniture request")
      const result = await response.json()
      // Convert _id to id for consistency
      if (result._id && !result.id) {
        result.id = result._id
      }
      return result
    },
    update: async (id: string, data: Partial<Furniture>) => {
      const response = await authenticatedFetch(`${API_BASE_URL}/furniture/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to update furniture request")
      const result = await response.json()
      // Convert _id to id for consistency
      if (result._id && !result.id) {
        result.id = result._id
      }
      return result
    },
    delete: async (id: string) => {
      const response = await authenticatedFetch(`${API_BASE_URL}/furniture/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete furniture request")
      return response.json()
    },
    getStats: async () => {
      const response = await fetch(`${API_BASE_URL}/furniture/stats`)
      if (!response.ok) throw new Error("Failed to fetch furniture stats")
      return response.json()
    },
  },
}