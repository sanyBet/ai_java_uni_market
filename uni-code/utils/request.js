// H5 开发环境通过 Vite 代理，其他平台直接请求后端地址
// #ifdef H5
const BASE_URL = '/api'
// #endif
// #ifndef H5
const BASE_URL = 'http://localhost:8080/api'
// #endif

function getToken() {
  return uni.getStorageSync('token') || ''
}

function request(options) {
  const { url, method = 'GET', data, header = {} } = options

  const token = getToken()
  if (token) {
    header['Authorization'] = `Bearer ${token}`
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
      success: (res) => {
        const { code, message, data } = res.data
        if (code === 200) {
          resolve(data)
        } else if (code === 401) {
          uni.removeStorageSync('token')
          uni.removeStorageSync('userInfo')
          uni.showToast({ title: '请重新登录', icon: 'none' })
          setTimeout(() => {
            uni.navigateTo({ url: '/pages/login/login' })
          }, 500)
          reject(new Error(message || '未授权'))
        } else {
          uni.showToast({ title: message || '请求失败', icon: 'none' })
          reject(new Error(message || '请求失败'))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常', icon: 'none' })
        reject(err)
      },
    })
  })
}

export function get(url, data) {
  return request({ url, method: 'GET', data })
}

export function post(url, data) {
  return request({ url, method: 'POST', data })
}

export function put(url, data) {
  return request({ url, method: 'PUT', data })
}

export function del(url, data) {
  return request({ url, method: 'DELETE', data })
}

export function uploadFile(url, filePath, name = 'file') {
  const token = getToken()
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: BASE_URL + url,
      filePath,
      name,
      header: token ? { Authorization: `Bearer ${token}` } : {},
      success: (res) => {
        const result = JSON.parse(res.data)
        if (result.code === 200) {
          resolve(result.data)
        } else {
          uni.showToast({ title: result.message || '上传失败', icon: 'none' })
          reject(new Error(result.message))
        }
      },
      fail: (err) => {
        uni.showToast({ title: '上传失败', icon: 'none' })
        reject(err)
      },
    })
  })
}

export default request
