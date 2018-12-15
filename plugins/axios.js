let host = process.env.HOST || 'localhost'
let port = process.env.PORT || 3000

export default function ({ $axios, req }) {
  $axios.defaults.baseURL = process.server ? `${req.protocol}://${host}:${port}/api` : '/api'
  $axios.interceptors.response.use(response => {
    return Promise.resolve(response.data)
  }, error => {
    return Promise.reject(new Error(error.response.data))
  })
}