import { post } from '@/utils/request'

export function loginApi(data) {
  return post('/mini/auth/login', data)
}

export function registerApi(data) {
  return post('/mini/auth/register', data)
}

export function logoutApi() {
  return post('/mini/auth/logout')
}
