import { defineStore } from "pinia"
import { ref } from "vue"

const TOKEN_KEY = "finlink_token"
const USERNAME_KEY = "finlink_username"

export const useUserStore = defineStore("user", () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || "")
  const username = ref(localStorage.getItem(USERNAME_KEY) || "")

  const setUser = (userData) => {
    token.value = userData.token
    username.value = userData.username
    localStorage.setItem(TOKEN_KEY, userData.token)
    localStorage.setItem(USERNAME_KEY, userData.username)
  }

  const logout = () => {
    token.value = ""
    username.value = ""
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USERNAME_KEY)
  }

  return {
    token,
    username,
    setUser,
    logout
  }
})
