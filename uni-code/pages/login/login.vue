<template>
  <view class="page">
    <!-- 顶部品牌区域 -->
    <view class="brand-header">
      <uni-icons type="shop" size="48" color="#fff" />
      <text class="brand-title">ShopMal</text>
      <text class="brand-subtitle">欢迎回来，请登录您的账号</text>
    </view>

    <!-- Tabs -->
    <view class="tabs">
      <view class="tab" :class="{ 'tab-active': activeTab === 'login' }" @tap="switchTab('login')">
        <text class="tab-text" :class="{ 'tab-text-active': activeTab === 'login' }">账号登录</text>
      </view>
      <view class="tab" :class="{ 'tab-active': activeTab === 'register' }" @tap="switchTab('register')">
        <text class="tab-text" :class="{ 'tab-text-active': activeTab === 'register' }">注册账号</text>
      </view>
    </view>

    <!-- 表单 -->
    <view class="form">
      <view class="field">
        <text class="field-label">账号</text>
        <input type="text" v-model="formData.account" placeholder="请输入账号" class="field-input" />
      </view>

      <view class="field" v-if="activeTab === 'register'">
        <text class="field-label">昵称（可选）</text>
        <input type="text" v-model="formData.nickname" placeholder="请输入昵称，不填则默认为账号" class="field-input" />
      </view>

      <view class="field">
        <text class="field-label">密码</text>
        <input type="password" v-model="formData.password" :placeholder="activeTab === 'login' ? '请输入密码' : '请输入密码（至少6位）'" class="field-input" />
      </view>

      <view class="submit-btn" @tap="handleSubmit">
        <text class="submit-btn-text">{{ activeTab === 'login' ? '登录' : '注册' }}</text>
      </view>

      <view class="tip" v-if="activeTab === 'login'">
        <text class="tip-text">还没有账号？</text>
        <text class="tip-link" @tap="switchTab('register')">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const activeTab = ref('login')
const formData = reactive({ account: '', password: '', nickname: '' })

function switchTab(tab) {
  activeTab.value = tab
  formData.account = ''
  formData.password = ''
  formData.nickname = ''
}

const loading = ref(false)

async function handleSubmit() {
  if (!formData.account || !formData.password) {
    uni.showToast({ title: '请输入账号和密码', icon: 'none' })
    return
  }

  if (activeTab.value === 'register' && formData.password.length < 6) {
    uni.showToast({ title: '密码长度至少6位', icon: 'none' })
    return
  }

  if (loading.value) return
  loading.value = true

  try {
    if (activeTab.value === 'login') {
      await authStore.login(formData.account, formData.password)
      uni.showToast({ title: '登录成功', icon: 'success' })
    } else {
      await authStore.register(formData.account, formData.nickname || formData.account, formData.password)
      uni.showToast({ title: '注册成功', icon: 'success' })
    }
    setTimeout(() => {
      uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/home/home' }) })
    }, 500)
  } catch (e) {
    // error handled by request.js
  } finally {
    loading.value = false
  }
}
</script>

<style>
.page {
  background: #fff;
  min-height: 100vh;
}

/* 品牌头部 */
.brand-header {
  background: linear-gradient(135deg, #EF4444, #DC2626);
  padding: 80rpx 48rpx 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.brand-icon {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}
.brand-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12rpx;
}
.brand-subtitle {
  font-size: 26rpx;
  color: rgba(255,255,255,0.8);
}

/* Tabs */
.tabs {
  display: flex;
  margin: 48rpx 48rpx 0;
  background: #f3f4f6;
  border-radius: 16rpx;
  padding: 6rpx;
}
.tab {
  flex: 1;
  padding: 22rpx 0;
  text-align: center;
  border-radius: 12rpx;
}
.tab-active {
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.08);
}
.tab-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #9ca3af;
}
.tab-text-active {
  color: #EF4444;
}

/* 表单 */
.form {
  padding: 48rpx;
}
.field {
  margin-bottom: 32rpx;
}
.field-label {
  font-size: 26rpx;
  color: #6b7280;
  margin-bottom: 16rpx;
}
.field-input {
  width: 100%;
  padding: 24rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: #f9fafb;
}

.submit-btn {
  margin-top: 48rpx;
  background: #EF4444;
  border-radius: 50rpx;
  padding: 26rpx;
  text-align: center;
  box-shadow: 0 8rpx 24rpx rgba(239, 68, 68, 0.3);
}
.submit-btn-text {
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
}

.tip {
  margin-top: 40rpx;
  text-align: center;
}
.tip-text {
  font-size: 26rpx;
  color: #6b7280;
}
.tip-link {
  font-size: 26rpx;
  color: #EF4444;
  margin-left: 8rpx;
}
</style>
