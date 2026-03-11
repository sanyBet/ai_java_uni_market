<template>
  <view class="page">
    <!-- 订单信息 -->
    <view class="order-card">
      <view class="order-row">
        <text class="order-label">订单编号</text>
        <text class="order-value">{{ orderNo }}</text>
      </view>
      <view class="order-row">
        <text class="order-label">应付金额</text>
        <text class="order-amount">¥{{ payAmount }}</text>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="section">
      <text class="section-title">选择支付方式</text>
      <view class="pay-option" v-for="method in payMethods" :key="method.id" @tap="currentPay = method.id">
        <view class="pay-left">
          <uni-icons :type="method.icon" size="24" :color="method.color" />
          <text class="pay-name">{{ method.name }}</text>
        </view>
        <view class="radio" :class="{ active: currentPay === method.id }">
          <view v-if="currentPay === method.id" class="radio-dot"></view>
        </view>
      </view>
    </view>

    <!-- 倒计时提示 -->
    <view class="countdown-tip">
      <text class="countdown-text">请在 {{ countdownText }} 内完成支付，超时订单将自动取消</text>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-bar">
      <view class="pay-later" @tap="payLater">
        <text class="pay-later-text">稍后支付</text>
      </view>
      <view class="pay-btn" :class="{ disabled: paying }" @tap="handlePay">
        <text class="pay-btn-text">{{ paying ? '支付中...' : '立即支付 ¥' + payAmount }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { payOrderApi } from '@/api/order'

const orderId = ref(null)
const orderNo = ref('')
const payAmount = ref('')
const currentPay = ref('wechat')
const paying = ref(false)

const payMethods = [
  { id: 'wechat', name: '微信支付', icon: 'weixin', color: '#07C160' },
  { id: 'alipay', name: '支付宝', icon: 'shop', color: '#1677FF' },
  { id: 'balance', name: '余额支付', icon: 'wallet', color: '#F59E0B' },
]

// 15分钟倒计时
const countdown = ref(15 * 60)
const countdownText = ref('15:00')

let timer = null

function startCountdown() {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      uni.showToast({ title: '支付超时，订单已取消', icon: 'none' })
      setTimeout(() => {
        uni.redirectTo({ url: '/pages/orders/orders' })
      }, 1500)
      return
    }
    const min = Math.floor(countdown.value / 60)
    const sec = countdown.value % 60
    countdownText.value = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }, 1000)
}

onLoad((options) => {
  orderId.value = Number(options.orderId)
  orderNo.value = options.orderNo || ''
  payAmount.value = options.payAmount || '0.00'
  startCountdown()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

async function handlePay() {
  if (paying.value) return
  paying.value = true
  try {
    await payOrderApi(orderId.value)
    if (timer) clearInterval(timer)
    uni.redirectTo({ url: '/pages/order-success/index' })
  } catch (e) {
    // error handled by request.js
  } finally {
    paying.value = false
  }
}

function payLater() {
  uni.showModal({
    title: '确认稍后支付？',
    content: '订单将保留15分钟，超时未支付将自动取消',
    confirmText: '稍后支付',
    confirmColor: '#EF4444',
    success: (res) => {
      if (res.confirm) {
        if (timer) clearInterval(timer)
        uni.redirectTo({ url: '/pages/orders/orders?status=0' })
      }
    },
  })
}
</script>

<style>
.page {
  background: #f9fafb;
  min-height: 100vh;
  padding-bottom: 140rpx;
}

/* 订单信息 */
.order-card {
  background: #fff;
  margin: 16rpx 0;
  padding: 32rpx;
}
.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.order-row:last-child {
  margin-bottom: 0;
}
.order-label {
  font-size: 28rpx;
  color: #6b7280;
}
.order-value {
  font-size: 28rpx;
  color: #1f2937;
}
.order-amount {
  font-size: 40rpx;
  color: #EF4444;
  font-weight: 600;
}

/* 支付方式 */
.section {
  background: #fff;
  margin-top: 16rpx;
  padding: 28rpx 32rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}
.pay-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}
.pay-option:last-child {
  margin-bottom: 0;
}
.pay-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.pay-name {
  font-size: 28rpx;
  color: #1f2937;
}
.radio {
  width: 36rpx;
  height: 36rpx;
  border: 4rpx solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.radio.active {
  border-color: #EF4444;
}
.radio-dot {
  width: 20rpx;
  height: 20rpx;
  background: #EF4444;
  border-radius: 50%;
}

/* 倒计时 */
.countdown-tip {
  padding: 24rpx 32rpx;
  text-align: center;
}
.countdown-text {
  font-size: 24rpx;
  color: #f97316;
}

/* 底部栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 2rpx solid #e5e7eb;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.pay-later {
  padding: 18rpx 32rpx;
  border: 2rpx solid #d1d5db;
  border-radius: 50rpx;
}
.pay-later-text {
  font-size: 28rpx;
  color: #6b7280;
}
.pay-btn {
  flex: 1;
  background: #EF4444;
  padding: 18rpx;
  border-radius: 50rpx;
  text-align: center;
}
.pay-btn.disabled {
  opacity: 0.6;
}
.pay-btn-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
}
</style>
