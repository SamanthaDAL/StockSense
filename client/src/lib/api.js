const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`

    try {
      const errorBody = await response.json()

      if (errorBody.message) {
        message = errorBody.message
      }
    } catch {
      // Keep the fallback message if the response is not JSON.
    }

    throw new Error(message)
  }

  return response.json()
}