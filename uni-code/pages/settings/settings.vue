<template>
  <view class="page">
    <!-- 头像 -->
    <view class="menu-item" @tap="changeAvatar">
      <text class="menu-label">头像</text>
      <view class="menu-right">
        <image v-if="authStore.userInfo?.avatar" :src="authStore.userInfo.avatar" mode="aspectFill" class="avatar-preview" />
        <view v-else class="avatar-placeholder-small">
          <uni-icons type="person-filled" size="24" color="#9ca3af" />
        </view>
        <uni-icons type="right" size="14" color="#9ca3af" />
      </view>
    </view>

    <!-- 昵称 -->
    <view class="menu-item" @tap="editNickname">
      <text class="menu-label">昵称</text>
      <view class="menu-right">
        <text class="menu-value">{{ authStore.userInfo?.nickname || '未设置' }}</text>
        <uni-icons type="right" size="14" color="#9ca3af" />
      </view>
    </view>

    <!-- 账号（只读） -->
    <view class="menu-item">
      <text class="menu-label">账号</text>
      <view class="menu-right">
        <text class="menu-value">{{ authStore.userInfo?.account || '-' }}</text>
      </view>
    </view>

    <view class="divider"></view>

    <!-- 清除缓存 -->
    <view class="menu-item" @tap="clearCache">
      <text class="menu-label">清除缓存</text>
      <view class="menu-right">
        <text class="menu-value">{{ cacheSize }}</text>
        <uni-icons type="right" size="14" color="#9ca3af" />
      </view>
    </view>

    <!-- 关于 -->
    <view class="menu-item">
      <text class="menu-label">版本</text>
      <view class="menu-right">
        <text class="menu-value">v1.0.0</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useAuthStore } from '@/stores/auth'
import { updateUserProfileApi } from '@/api/user'

const authStore = useAuthStore()
const cacheSize = ref('0 KB')

onShow(() => {
  getStorageSize()
})

function getStorageSize() {
  try {
    const res = uni.getStorageInfoSync()
    const kb = res.currentSize || 0
    cacheSize.value = kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB'
  } catch (e) {
    cacheSize.value = '0 KB'
  }
}

function changeAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempPath = res.tempFilePaths[0]
      try {
        await updateUserProfileApi({ avatar: tempPath })
        authStore.userInfo.avatar = tempPath
        uni.showToast({ title: '头像已更新', icon: 'success' })
      } catch (e) {
        // error handled by request.js
      }
    },
  })
}

function editNickname() {
  uni.showModal({
    title: '修改昵称',
    editable: true,
    placeholderText: '请输入新昵称',
    content: authStore.userInfo?.nickname || '',
    success: async (res) => {
      if (res.confirm && res.content && res.content.trim()) {
        const nickname = res.content.trim()
        try {
          await updateUserProfileApi({ nickname })
          authStore.userInfo.nickname = nickname
          uni.showToast({ title: '昵称已更新', icon: 'success' })
        } catch (e) {
          // error handled by request.js
        }
      }
    },
  })
}

function clearCache() {
  uni.showModal({
    title: '提示',
    content: '确定清除缓存？',
    success: (res) => {
      if (res.confirm) {
        try {
          uni.clearStorageSync()
          // 重新保存登录信息
          if (authStore.token) {
            uni.setStorageSync('token', authStore.token)
            uni.setStorageSync('userInfo', authStore.userInfo)
          }
          getStorageSize()
          uni.showToast({ title: '缓存已清除', icon: 'success' })
        } catch (e) {
          uni.showToast({ title: '清除失败', icon: 'none' })
        }
      }
    },
  })
}
</script>

<style>
.page {
  background: var(--bg-page);
  min-height: 100vh;
}

.menu-item {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 32rpx;
  border-bottom: 2rpx solid #f3f4f6;
}
.menu-label {
  font-size: 28rpx;
  color: #1f2937;
}
.menu-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.menu-value {
  font-size: 28rpx;
  color: #9ca3af;
}

.avatar-preview {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}
.avatar-placeholder-small {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider {
  height: 16rpx;
}
</style>
