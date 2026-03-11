import { uploadFile } from '@/utils/request'

export function uploadImageApi(filePath) {
  return uploadFile('/mini/upload', filePath, 'file')
}
