import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.request.use(
  (config) => {
    if (config.method !== 'get' && config.data) {
      // console.log('Request Body:', config.data)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // console.log(error.response.data.message)
    // console.log(error.response)

    throw error.response.data
  },
)

export default apiClient
