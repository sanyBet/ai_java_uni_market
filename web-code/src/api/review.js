import request from './index'

export const getReviewList = (params) => request.get('/admin/reviews', { params })
export const deleteReview = (id) => request.delete(`/admin/reviews/${id}`)
