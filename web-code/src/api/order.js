import request from './index'

export const getOrderList = (params) => request.get('/admin/orders', { params })
export const getOrderDetail = (id) => request.get(`/admin/orders/${id}`)
export const updateOrderStatus = (id, status) => request.put(`/admin/orders/${id}/status`, { status })
