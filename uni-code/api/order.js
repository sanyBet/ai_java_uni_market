import { get, post, put } from '@/utils/request'

export function createOrderApi(data) {
  return post('/mini/orders', data)
}

export function getOrderListApi(params) {
  return get('/mini/orders', params)
}

export function getOrderDetailApi(id) {
  return get(`/mini/orders/${id}`)
}

export function cancelOrderApi(id) {
  return put(`/mini/orders/${id}/cancel`)
}

export function payOrderApi(id) {
  return put(`/mini/orders/${id}/pay`)
}

export function confirmOrderApi(id) {
  return put(`/mini/orders/${id}/confirm`)
}

export function applyRefundApi(id) {
  return put(`/mini/orders/${id}/refund`)
}
