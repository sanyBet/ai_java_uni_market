import request from './index'

export const getUserList = (params) => request.get('/admin/users', { params })
export const deleteUser = (id) => request.delete(`/admin/users/${id}`)
