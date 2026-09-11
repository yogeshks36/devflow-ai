import axios from 'axios'
import type {
  InternalAxiosRequestConfig,
} from 'axios'

const api = axios.create({

  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:8080/api',

  timeout: 120000,

  headers: {
    'Content-Type': 'application/json',
  },

})

api.interceptors.request.use(

  (
    config: InternalAxiosRequestConfig
  ) => {

    const token =
      localStorage.getItem(
        'devflow_token'
      )

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`

    }

    return config

  },

  (error) =>
    Promise.reject(error)

)

api.interceptors.response.use(

  (response) => {

    return response

  },

  (error) => {

    return Promise.reject(error)

  }

)

export default api