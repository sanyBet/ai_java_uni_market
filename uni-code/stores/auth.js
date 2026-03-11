import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, registerApi, logoutApi } from '@/api/auth'
import { getUserProfileApi, updateUserProfileApi } from '@/api/user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(uni.getStorageSync('token') || null)
  const userInfo = ref(uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : null)

  const isLoggedIn = computed(() => token.value !== null)

  async function login(account, password) {
    const data = await loginApi({ account, password })
    token.value = data.token
    userInfo.value = data.userInfo
    uni.setStorageSync('token', data.token)
    uni.setStorageSync('userInfo', JSON.stringify(data.userInfo))
  }

  async function register(account, nickname, password) {
    const data = await registerApi({ account, nickname, password })
    token.value = data.token
    userInfo.value = data.userInfo
    uni.setStorageSync('token', data.token)
    uni.setStorageSync('userInfo', JSON.stringify(data.userInfo))
  }

  async function logout() {
    try {
      await logoutApi()
    } catch (e) {
      // ignore
    }
    token.value = null
    userInfo.value = null
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
  }

  async function fetchProfile() {
    const data = await getUserProfileApi()
    userInfo.value = data
    uni.setStorageSync('userInfo', JSON.stringify(data))
  }

  async function updateProfile(profileData) {
    await updateUserProfileApi(profileData)
    userInfo.value = { ...userInfo.value, ...profileData }
    uni.setStorageSync('userInfo', JSON.stringify(userInfo.value))
  }

  return { token, userInfo, isLoggedIn, login, register, logout, fetchProfile, updateProfile }
})
