// api.js
import axios from 'axios'
import Cookies from 'js-cookie'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/?$/, '/')

const Api = axios.create({
  baseURL: BASE_URL
})

export default Api
