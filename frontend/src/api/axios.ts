import axios from 'axios'
import type {
  InternalAxiosRequestConfig,
} from 'axios'


const api = axios.create({

  baseURL: 'http://localhost:8080/api',

  timeout: 30000,

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


    console.log(
      'AXIOS REQUEST:',
      config.method?.toUpperCase(),
      config.url
    )


    console.log(
      'TOKEN FROM LOCAL STORAGE:',
      token
    )


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`


      console.log(
        'AUTHORIZATION HEADER SET'
      )

    } else {

      console.log(
        'NO TOKEN FOUND'
      )

    }


    return config

  },


  (error) =>
    Promise.reject(error)

)


api.interceptors.response.use(

  (response) => {

    console.log(
      'API SUCCESS:',
      response.config.url,
      response.status
    )

    return response

  },


  (error) => {

    console.error(
      'API ERROR:',
      error.code,
      error.message,
      error.response?.status,
      error.response?.data
    )

    return Promise.reject(error)

  }

)


export default api