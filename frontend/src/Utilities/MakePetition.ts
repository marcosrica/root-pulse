type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiOptions {
  method?: HttpMethod
  body?: unknown
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean | undefined>
  timeout?: number
}

interface ApiResponse<T = unknown> {
  data: T
  status: number
  ok: boolean
  message?: string
}

// Base url
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ─── Helper: Build URL with query params ───
function buildUrl(url: string, params?: Record<string, string | number | boolean | undefined>): string {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`
  
  if (!params) return fullUrl
  
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `${fullUrl}?${queryString}` : fullUrl
}

// Promise timeout handler 
function timeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
  })
}

// Api calls
async function api<T = unknown>(url: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    body,
    headers = {},
    params,
    timeout = 10000
  } = options

  const fullUrl = buildUrl(url, params)

  // Default headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  // Merge headers
  const mergedHeaders = {
    ...defaultHeaders,
    ...headers
  }

  // Build fetch options
  const fetchOptions: RequestInit = {
    method,
    headers: mergedHeaders,
  }

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body)
  }

  try {
    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(fullUrl, fetchOptions),
      timeoutPromise(timeout)
    ])

    // Parse response
    let data: T
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      data = (await response.text()) as unknown as T
    }

    // Handle non-OK responses
    if (!response.ok) {
      throw new ApiError(
        (data as any)?.message || `Request failed with status ${response.status}`,
        response.status,
        data
      )
    }

    return {
      data,
      status: response.status,
      ok: true
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      0
    )
  }
}


export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}


export const apiClient = {
  get<T = unknown>(url: string, options?: Omit<ApiOptions, 'method' | 'body'>) {
    return api<T>(url, { ...options, method: 'GET' })
  },

  post<T = unknown>(url: string, body: unknown, options?: Omit<ApiOptions, 'method'>) {
    return api<T>(url, { ...options, method: 'POST', body })
  },

  put<T = unknown>(url: string, body: unknown, options?: Omit<ApiOptions, 'method'>) {
    return api<T>(url, { ...options, method: 'PUT', body })
  },

  patch<T = unknown>(url: string, body: unknown, options?: Omit<ApiOptions, 'method'>) {
    return api<T>(url, { ...options, method: 'PATCH', body })
  },

  delete<T = unknown>(url: string, options?: Omit<ApiOptions, 'method' | 'body'>) {
    return api<T>(url, { ...options, method: 'DELETE' })
  }
}

export { api }
export default apiClient