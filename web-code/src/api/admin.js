import request from './index'

export const getAdminList = (params) => request.get('/admin/admins', { params })
export const createAdmin = (data) => request.post('/admin/admins', data)
export const updateAdmin = (id, data) => request.put(`/admin/admins/${id}`, data)
export const deleteAdmin = (id) => request.delete(`/admin/admins/${id}`)
export const resetAdminPassword = (id, data) => request.put(`/admin/admins/${id}/password`, data)
