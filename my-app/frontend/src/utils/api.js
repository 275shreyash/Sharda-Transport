const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper function to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token')
}

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)

    // Handle non-JSON responses
    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new Error(text || `Server returned ${response.status}`)
    }

    if (!response.ok) {
      throw new Error(data.message || `Server error: ${response.status}`)
    }

    return data
  } catch (error) {
    // Network error - backend not reachable
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.')
    }
    // Re-throw other errors
    throw error
  }
}

// Auth API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: credentials
  }),

  signup: (userData) => apiRequest('/auth/signup', {
    method: 'POST',
    body: userData
  }),

  forgotPassword: (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: { email }
  }),

  resetPassword: (token, password) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: { token, password }
  }),

  getMe: () => apiRequest('/auth/me')
}

// Bookings API
export const bookingsAPI = {
  getAll: () => apiRequest('/bookings'),

  getStats: () => apiRequest('/bookings/stats'),

  create: (bookingData) => apiRequest('/bookings', {
    method: 'POST',
    body: bookingData
  }),

  update: (id, bookingData) => apiRequest(`/bookings/${id}`, {
    method: 'PUT',
    body: bookingData
  }),

  updateRating: (id, rating, review) => apiRequest(`/bookings/${id}/rate`, {
    method: 'PATCH',
    body: { rating, review }
  }),

  delete: (id) => apiRequest(`/bookings/${id}`, {
    method: 'DELETE'
  })
}

// Cars API
export const carsAPI = {
  getAll: () => apiRequest('/cars'),
  create: (carData) => apiRequest('/cars', { method: 'POST', body: carData }),
  update: (id, carData) => apiRequest(`/cars/${id}`, { method: 'PUT', body: carData }),
  delete: (id) => apiRequest(`/cars/${id}`, { method: 'DELETE' })
}

// Inquiries API
export const inquiriesAPI = {
  create: (data) => apiRequest('/inquiries', { method: 'POST', body: data }),
  getAll: () => apiRequest('/inquiries'), // requires admin token
  update: (id, data) => apiRequest(`/inquiries/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/inquiries/${id}`, { method: 'DELETE' })
}

// Admin Extra Tools API
export const adminAPI = {
  exportCSV: async (type) => {
    const token = localStorage.getItem('token')
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${API_URL}/admin/export/${type}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sharda_transport_${type}_export.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }
}

// Reviews API (Public)
export const reviewsAPI = {
  getTopReviews: () => apiRequest('/reviews')
}

