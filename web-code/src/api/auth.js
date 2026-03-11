import request from './index'

export const login = (data) => request.post('/admin/auth/login', data)
export const logout = () => request.post('/admin/auth/logout')
export const getMe = () => request.get('/admin/auth/me')
