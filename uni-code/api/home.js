import { get } from '@/utils/request'

export function getHomeDataApi() {
  return get('/mini/home/data')
}
