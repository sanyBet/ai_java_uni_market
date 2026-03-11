<template>
  <view class="page">
    <view class="card">
      <!-- 成功动画圆圈 -->
      <view class="icon-outer">
        <view class="icon-inner">
          <uni-icons type="checkbox-filled" size="56" color="#22c55e" />
        </view>
      </view>

      <text class="title">支付成功</text>
      <text class="subtitle">感谢您的购买，商品将尽快为您发货</text>

      <!-- 提示信息 -->
      <view class="tips">
        <view class="tip-item">
          <uni-icons type="paperplane" size="18" color="#6b7280" />
          <text class="tip-text">您可以在「我的订单」中查看物流信息</text>
        </view>
        <view class="tip-item">
          <uni-icons type="headphones" size="18" color="#6b7280" />
          <text class="tip-text">如有问题请联系客服</text>
        </view>
      </view>

      <view class="btn-group">
        <view class="btn-primary" @tap="goOrders">
          <text class="btn-primary-text">查看订单</text>
        </view>
        <view class="btn-outline" @tap="goHome">
          <text class="btn-outline-text">返回首页</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
function goOrders() {
  uni.redirectTo({ url: '/pages/orders/orders' })
}

function goHome() {
  uni.switchTab({ url: '/pages/home/home' })
}
</script>

<style>
.page {
  background: linear-gradient(180deg, #f0fdf4 0%, #f9fafb 40%);
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 120rpx 32rpx 32rpx;
}

.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 64rpx 40rpx 48rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
}

/* 成功图标 */
.icon-outer {
  width: 160rpx;
  height: 160rpx;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 40rpx;
}
.icon-inner {
  width: 120rpx;
  height: 120rpx;
  background: rgba(34, 197, 94, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 44rpx;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #6b7280;
  margin-bottom: 48rpx;
}

/* 提示信息 */
.tips {
  background: #f9fafb;
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
  margin-bottom: 48rpx;
}
.tip-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}
.tip-item:last-child {
  margin-bottom: 0;
}
.tip-text {
  font-size: 24rpx;
  color: #6b7280;
}

/* 按钮 */
.btn-group {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.btn-primary {
  background: #EF4444;
  padding: 26rpx;
  border-radius: 50rpx;
  text-align: center;
}
.btn-primary-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}
.btn-outline {
  border: 2rpx solid #d1d5db;
  padding: 26rpx;
  border-radius: 50rpx;
  text-align: center;
}
.btn-outline-text {
  color: #374151;
  font-size: 30rpx;
  font-weight: 500;
}
</style>
