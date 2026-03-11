import { get } from '@/utils/request'

export function getCategoriesApi() {
  return get('/mini/categories')
}

export function getCategoryProductsApi(id, params) {
  return get(`/mini/categories/${id}/products`, params)
}
