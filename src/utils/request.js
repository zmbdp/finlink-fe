import axios from "axios"
import { ElMessage } from "element-plus"
import { useUserStore } from "@/stores/user"

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 15000
})

request.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    // 登录接口不携带 Authorization 头，避免旧 token 干扰
    if (userStore.token && !config.url.includes('/login')) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  error => {
    console.error("Request error:", error)
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    // 如果是 blob 类型响应，直接返回
    if (response.config.responseType === 'blob') {
      return response.data
    }
    const res = response.data
    if (res.code !== 200000) {
      ElMessage.error(res.errMsg || "请求失败")
      
      const userStore = useUserStore()
      // 检查 code 是否以 401 开头
      if (String(res.code).startsWith('401')) {
        userStore.logout()
        window.location.href = "/login"
      }
      return Promise.reject(new Error(res.errMsg || "请求失败"))
    }
    return res
  },
  error => {
    console.error("Response error:", error)
    
    // 处理 401 错误
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      
      // 尝试获取后端返回的错误信息
      let errMsg = "请先登录"
      if (error.response.data) {
        errMsg = error.response.data.errMsg || error.response.data.msg || errMsg
      }
      
      ElMessage.error(errMsg)
      window.location.href = "/login"
      return Promise.reject(new Error(errMsg))
    }
    
    // 处理其他错误
    let errMsg = error.message || "网络错误"
    if (error.response && error.response.data) {
      errMsg = error.response.data.errMsg || error.response.data.msg || errMsg
    }
    
    ElMessage.error(errMsg)
    return Promise.reject(error)
  }
)

export default request
