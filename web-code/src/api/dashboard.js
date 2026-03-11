import request from './index'

export const getDashboardStats = () => request.get('/admin/dashboard/stats')
