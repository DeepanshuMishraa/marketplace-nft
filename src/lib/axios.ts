import axios from 'axios'

export const api = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})
