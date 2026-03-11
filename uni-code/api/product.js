import { get } from '@/utils/request'

export function searchProductsApi(params) {
  return get('/mini/products/search', params)
}

export function getHotKeywordsApi() {
  return get('/mini/products/hot-keywords')
}

export function getProductDetailApi(id) {
  return get(`/mini/products/${id}`)
}
