import { get, post } from '@/utils/request'

export function getReviewsApi(params) {
  return get('/mini/reviews', params)
}

export function createReviewApi(data) {
  return post('/mini/reviews', data)
}
