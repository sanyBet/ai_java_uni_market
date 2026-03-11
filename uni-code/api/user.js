import { get, put } from '@/utils/request'

export function getUserProfileApi() {
  return get('/mini/user/profile')
}

export function updateUserProfileApi(data) {
  return put('/mini/user/profile', data)
}

export function getOrderStatsApi() {
  return get('/mini/user/order-stats')
}
