import request from './index'

export const getProductList = (params) => request.get('/admin/products', { params })
export const getProductDetail = (id) => request.get(`/admin/products/${id}`)
export const createProduct = (data) => request.post('/admin/products', data)
export const updateProduct = (id, data) => request.put(`/admin/products/${id}`, data)
export const deleteProduct = (id) => request.delete(`/admin/products/${id}`)
