<template>
  <view class="page">
    <!-- 头像区 -->
    <view class="avatar-section">
      <view class="avatar-wrap" @tap="changeAvatar">
        <image v-if="authStore.userInfo?.avatar" :src="authStore.userInfo.avatar" mode="aspectFill" class="avatar-img" />
        <view v-else class="avatar-placeholder">
          <uni-icons type="person-filled" size="48" color="#9ca3af" />
        </view>
        <view class="camera-btn" v-if="isEditing">
          <uni-icons type="camera-filled" size="16" color="#fff" />
        </view>
      </view>
      <text class="avatar-tip">点击更换头像</text>
    </view>

    <!-- 信息列表 -->
    <view class="info-list">
      <view class="info-item border-bottom">
        <text class="info-label">账号</text>
        <text class="info-value">{{ authStore.userInfo?.account }}</text>
      </view>
      <view class="info-item border-bottom">
        <text class="info-label">昵称</text>
        <view v-if="isEditing" class="edit-input-wrap">
          <input type="text" v-model="nickname" class="edit-input" :focus="isEditing" />
        </view>
        <text v-else class="info-value">{{ authStore.userInfo?.nickname }}</text>
      </view>
      <view class="info-item border-bottom">
        <text class="info-label">用户ID</text>
        <text class="info-value light">{{ authStore.userInfo?.id }}</text>
      </view>
    </view>

    <view class="info-list">
      <view class="info-item">
        <text class="info-label">注册时间</text>
        <text class="info-value">{{ authStore.userInfo?.createTime }}</text>
      </view>
    </view>

    <!-- 编辑/保存按钮 -->
    <view class="btn-wrap">
      <view class="edit-btn" @tap="toggleEdit">
        <text class="edit-btn-text">{{ isEditing ? '保存' : '编辑资料' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { updateUserProfileApi } from '@/api/user'
import { uploadImageApi } from '@/api/upload'

const authStore = useAuthStore()
const isEditing = ref(false)
const nickname = ref(authStore.userInfo?.nickname || '')

async function toggleEdit() {
  if (isEditing.value) {
    if (!nickname.value.trim()) {
      uni.showToast({ title: '昵称不能为空', icon: 'none' })
      return
    }
    try {
      await updateUserProfileApi({ nickname: nickname.value.trim() })
      authStore.updateProfile({ nickname: nickname.value.trim() })
      uni.showToast({ title: '保存成功', icon: 'success' })
      isEditing.value = false
    } catch (e) {
      // error handled by request.js
    }
  } else {
    nickname.value = authStore.userInfo?.nickname || ''
    isEditing.value = true
  }
}

function changeAvatar() {
  if (!isEditing.value) return
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const filePath = res.tempFilePaths[0]
      try {
        const data = await uploadImageApi(filePath)
        const avatarUrl = data.url || data
        await updateUserProfileApi({ avatar: avatarUrl })
        authStore.updateProfile({ avatar: avatarUrl })
        uni.showToast({ title: '头像已更换', icon: 'success' })
      } catch (e) {
        // error handled by request.js
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

/* 头像区 */
.avatar-section {
  background: #fff;
  margin-top: 16rpx;
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-wrap {
  position: relative;
  width: 180rpx;
  height: 180rpx;
}
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-icon {
  font-size: 80rpx;
}
.camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 56rpx;
  height: 56rpx;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.camera-icon {
  font-size: 28rpx;
}
.avatar-tip {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-top: 24rpx;
}

/* 信息列表 */
.info-list {
  background: #fff;
  margin-top: 16rpx;
}
.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
}
.info-item.border-bottom {
  border-bottom: 2rpx solid #f3f4f6;
}
.info-label {
  font-size: 28rpx;
  color: var(--text-secondary);
}
.info-value {
  font-size: 28rpx;
  color: #1f2937;
}
.info-value.light {
  color: #9ca3af;
  font-size: 26rpx;
}

.edit-input-wrap {
  flex: 1;
  margin-left: 32rpx;
}
.edit-input {
  text-align: right;
  border-bottom: 2rpx solid var(--primary);
  padding: 4rpx 8rpx;
  font-size: 28rpx;
}

/* 按钮 */
.btn-wrap {
  padding: 48rpx 32rpx;
}
.edit-btn {
  background: var(--primary);
  border-radius: 50rpx;
  padding: 24rpx;
  text-align: center;
}
.edit-btn-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
}
</style>
