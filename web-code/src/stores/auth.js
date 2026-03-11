import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin, logout as apiLogout } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const adminInfo = ref(JSON.parse(localStorage.getItem('adminInfo') || 'null'))

  const isLoggedIn = () => !!token.value

  const login = async (account, password) => {
    const res = await apiLogin({ account, password })
    const data = res?.data
    token.value = data.token
    adminInfo.value = data.adminInfo
    localStorage.setItem('token', data.token)
    localStorage.setItem('adminInfo', JSON.stringify(data.adminInfo))
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch {
      // ignore error, always clear local state
    }
    token.value = ''
    adminInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('adminInfo')
  }

  return { token, adminInfo, isLoggedIn, login, logout }
})
