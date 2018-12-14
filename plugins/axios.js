export default function ({ $axios, req }) {
  $axios.defaults.baseURL = process.server ? `${req.protocol}://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}/api` : '/api'
  $axios.interceptors.response.use(response => {
    return Promise.resolve(response.data)
  }, error => {
    return Promise.reject(new Error(error.response.data))
  })
}