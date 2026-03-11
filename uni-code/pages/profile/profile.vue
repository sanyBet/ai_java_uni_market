<template>
  <view class="page">
    <!-- 头部 -->
    <view class="header">
      <view class="header-content">
        <view class="avatar-wrap" @tap="onAvatarTap">
          <image v-if="authStore.userInfo?.avatar" :src="authStore.userInfo.avatar" mode="aspectFill" class="avatar" />
          <view v-else class="avatar-placeholder">
            <uni-icons type="person-filled" size="50" color="#9ca3af" />
          </view>
        </view>
        <view class="user-info">
          <text class="nickname" v-if="authStore.isLoggedIn">{{ authStore.userInfo?.nickname }}</text>
          <text class="nickname" v-else @tap="goLogin">点击登录</text>
          <text class="member-level" v-if="authStore.isLoggedIn">会员等级：{{ authStore.userInfo?.memberLevel || '普通会员' }}</text>
        </view>
      </view>
    </view>

    <!-- 订单状态卡片 -->
    <view class="order-card">
      <view class="order-card-header">
        <text class="order-card-title">我的订单</text>
        <view class="order-card-link" @tap="goOrders">
          <text class="order-card-link-text">查看全部</text>
          <uni-icons type="right" size="14" color="#9ca3af" />
        </view>
      </view>
      <view class="order-stats">
        <view class="stat-item" v-for="stat in orderStats" :key="stat.label" @tap="goOrders(stat.status)">
          <view class="stat-icon-wrap">
            <uni-icons :type="stat.icon" size="28" color="#374151" />
            <view v-if="stat.count > 0" class="stat-badge">
              <text class="stat-badge-text">{{ stat.count }}</text>
            </view>
          </view>
          <text class="stat-label">{{ stat.label }}</text>
        </view>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="menu-list">
      <view
        class="menu-item"
        v-for="(item, index) in menuItems"
        :key="item.label"
        @tap="goPage(item.path)"
        :class="{ 'border-bottom': index < menuItems.length - 1 }"
      >
        <view class="menu-left">
          <uni-icons :type="item.icon" size="22" color="#374151" />
          <text class="menu-label">{{ item.label }}</text>
        </view>
        <uni-icons type="right" size="14" color="#9ca3af" />
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-wrap" v-if="authStore.isLoggedIn">
      <view class="logout-btn" @tap="handleLogout">
        <text class="logout-text">退出登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { getOrderStatsApi } from '@/api/user'

const authStore = useAuthStore()
const cartStore = useCartStore()

onShow(() => {
  const count = cartStore.cartCount
  if (count > 0) {
    uni.setTabBarBadge({ index: 2, text: String(count) })
  } else {
    uni.removeTabBarBadge({ index: 2 })
  }
  if (authStore.isLoggedIn) {
    loadOrderStats()
  }
})

const orderStats = ref([
  { icon: 'gift', label: '待发货', count: 0, status: 1 },
  { icon: 'cart', label: '待收货', count: 0, status: 2 },
  { icon: 'checkbox-filled', label: '已完成', count: 0, status: 3 },
  { icon: 'redo', label: '退款/售后', count: 0, status: 4 },
])

async function loadOrderStats() {
  try {
    const data = await getOrderStatsApi()
    if (data) {
      orderStats.value[0].count = data.pendingDelivery || 0
      orderStats.value[1].count = data.pendingReceive || 0
      orderStats.value[2].count = data.completed || 0
      orderStats.value[3].count = data.refunding || 0
    }
  } catch (e) {
    // error handled by request.js
  }
}

const menuItems = ref([
  { icon: 'person', label: '个人信息', path: '/pages/profile-info/index' },
  { icon: 'list', label: '我的订单', path: '/pages/orders/orders' },
  { icon: 'location', label: '收货地址', path: '/pages/address/address' },
  { icon: 'headphones', label: '客服支持', path: '/pages/support/support' },
  { icon: 'gear', label: '设置', path: '/pages/settings/settings' },
])

function onAvatarTap() {
  if (!authStore.isLoggedIn) {
    goLogin()
  }
}

function goLogin() {
  uni.navigateTo({ url: '/pages/login/login' })
}

function goOrders(status) {
  if (!authStore.isLoggedIn) {
    goLogin()
    return
  }
  const url = typeof status === 'number' ? `/pages/orders/orders?status=${status}` : '/pages/orders/orders'
  uni.navigateTo({ url })
}

function goPage(path) {
  if (!path) {
    uni.showToast({ title: '暂未开放', icon: 'none' })
    return
  }
  if (!authStore.isLoggedIn) {
    goLogin()
    return
  }
  uni.navigateTo({ url: path })
}

function handleLogout() {
  authStore.logout()
  cartStore.clearCart()
  uni.showToast({ title: '已退出登录', icon: 'none' })
}
</script>

<style>
.page {
  background: var(--bg-page);
  min-height: 100vh;
}

/* 头部 */
.header {
  background: linear-gradient(135deg, #EF4444, #DC2626);
  padding: 48rpx 32rpx 160rpx;
}
.header-content {
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.avatar-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
  flex-shrink: 0;
}
.avatar {
  width: 100%;
  height: 100%;
}
.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
}
.user-info {
  flex: 1;
}
.nickname {
  color: #fff;
  font-size: 34rpx;
  font-weight: 600;
}
.member-level {
  color: rgba(255,255,255,0.8);
  font-size: 26rpx;
  margin-top: 8rpx;
}

/* 订单状态卡片 */
.order-card {
  background: #fff;
  margin: -120rpx 24rpx 16rpx;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}
.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.order-card-title {
  font-size: 30rpx;
  font-weight: 600;
}
.order-card-link {
  display: flex;
  align-items: center;
}
.order-card-link-text {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.order-stats {
  display: flex;
  justify-content: space-around;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-icon-wrap {
  position: relative;
  margin-bottom: 12rpx;
}
.stat-badge {
  position: absolute;
  top: -10rpx;
  right: -16rpx;
  min-width: 36rpx;
  height: 36rpx;
  padding: 0 8rpx;
  background: #EF4444;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.stat-badge-text {
  color: #fff;
  font-size: 22rpx;
  font-weight: 500;
}
.stat-label {
  font-size: 22rpx;
  color: var(--text-secondary);
}

/* 菜单列表 */
.menu-list {
  background: #fff;
  margin-bottom: 16rpx;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
}
.menu-item.border-bottom {
  border-bottom: 2rpx solid #f3f4f6;
}
.menu-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.menu-label {
  font-size: 28rpx;
  color: #1f2937;
}

/* 退出登录 */
.logout-wrap {
  background: #fff;
  padding: 24rpx 32rpx;
}
.logout-btn {
  background: #EF4444;
  border-radius: 12rpx;
  padding: 24rpx;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}
.logout-text {
  color: #fff;
  font-size: 28rpx;
}
</style>
