<template>
  <view class="page">
    <!-- 未登录提示 -->
    <view v-if="!authStore.isLoggedIn" class="empty-state">
      <uni-icons type="cart" size="60" color="#d1d5db" />
      <text class="empty-text">登录后查看购物车</text>
      <view class="empty-btn" @tap="goLogin">
        <text class="empty-btn-text">去登录</text>
      </view>
    </view>

    <!-- 空购物车 -->
    <view v-else-if="cartStore.cartList.length === 0" class="empty-state">
      <uni-icons type="cart" size="60" color="#d1d5db" />
      <text class="empty-text">购物车空空如也</text>
      <view class="empty-btn" @tap="goHome">
        <text class="empty-btn-text">去逛逛</text>
      </view>
    </view>

    <!-- 购物车列表 -->
    <view v-else class="cart-list">
      <view class="cart-item" v-for="item in cartStore.cartList" :key="item.id">
        <view class="cart-row">
          <!-- 复选框 -->
          <view class="checkbox-wrap" @tap="cartStore.toggleSelect(item.id)">
            <view class="checkbox" :class="{ checked: item.selected }">
              <text v-if="item.selected" class="check-icon">✓</text>
            </view>
          </view>

          <!-- 商品图片 -->
          <view class="item-img-wrap">
            <image :src="item.cover" mode="aspectFill" class="item-img" />
          </view>

          <!-- 商品信息 -->
          <view class="item-info">
            <text class="item-name">{{ item.productName }}</text>
            <text class="item-spec">{{ item.spec }}</text>
            <view class="item-bottom">
              <text class="item-price">¥{{ item.price }}</text>
              <view class="quantity-control">
                <view class="qty-btn" @tap="cartStore.updateQuantity(item.id, -1)"><text>-</text></view>
                <text class="qty-num">{{ item.quantity }}</text>
                <view class="qty-btn" @tap="cartStore.updateQuantity(item.id, 1)"><text>+</text></view>
              </view>
            </view>
          </view>

          <!-- 删除 -->
          <view class="delete-btn" @tap="cartStore.removeFromCart(item.id)">
            <uni-icons type="close" size="18" color="#9ca3af" />
          </view>
        </view>
      </view>
    </view>

    <!-- 底部栏 -->
    <view class="bottom-bar" v-if="authStore.isLoggedIn && cartStore.cartList.length > 0">
      <view class="bottom-left">
        <view class="checkbox-wrap" @tap="cartStore.toggleSelectAll()">
          <view class="checkbox" :class="{ checked: cartStore.allSelected }">
            <text v-if="cartStore.allSelected" class="check-icon">✓</text>
          </view>
        </view>
        <text class="select-all-text">全选</text>
      </view>
      <view class="bottom-right">
        <view class="total-wrap">
          <text class="total-label">合计：</text>
          <text class="total-price">¥{{ cartStore.totalPrice }}</text>
        </view>
        <view
          class="settle-btn"
          :class="{ disabled: cartStore.selectedItems.length === 0 }"
          @tap="goCheckout"
        >
          <text class="settle-btn-text">结算({{ cartStore.selectedItems.length }})</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/order'

const cartStore = useCartStore()
const authStore = useAuthStore()
const orderStore = useOrderStore()

onShow(() => {
  const count = cartStore.cartCount
  if (count > 0) {
    uni.setTabBarBadge({ index: 2, text: String(count) })
  } else {
    uni.removeTabBarBadge({ index: 2 })
  }
})

function goLogin() {
  uni.navigateTo({ url: '/pages/login/login' })
}

function goHome() {
  uni.switchTab({ url: '/pages/home/home' })
}

function goCheckout() {
  if (cartStore.selectedItems.length === 0) return
  const items = cartStore.selectedItems
  const totalAmount = Number(cartStore.totalPrice)
  orderStore.setCurrentOrder({
    items,
    totalAmount,
    discountAmount: 0,
    payAmount: totalAmount,
  })
  uni.navigateTo({ url: '/pages/checkout/checkout' })
}
</script>

<style>
.page {
  background: #f9fafb;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}
.empty-icon {
  font-size: 100rpx;
  margin-bottom: 24rpx;
}
.empty-text {
  font-size: 28rpx;
  color: #6b7280;
  margin-bottom: 32rpx;
}
.empty-btn {
  background: #EF4444;
  padding: 16rpx 48rpx;
  border-radius: 50rpx;
}
.empty-btn-text {
  color: #fff;
  font-size: 28rpx;
}

/* 购物车列表 */
.cart-list {
  padding-top: 16rpx;
}
.cart-item {
  background: #fff;
  margin-bottom: 16rpx;
  padding: 24rpx 32rpx;
}
.cart-row {
  display: flex;
  gap: 20rpx;
}

/* 复选框 */
.checkbox-wrap {
  display: flex;
  align-items: flex-start;
  padding-top: 16rpx;
}
.checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #d1d5db;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checkbox.checked {
  background: #EF4444;
  border-color: #EF4444;
}
.check-icon {
  color: #fff;
  font-size: 24rpx;
}

/* 商品图片 */
.item-img-wrap {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #f3f4f6;
  flex-shrink: 0;
}
.item-img {
  width: 100%;
  height: 100%;
}

/* 商品信息 */
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.item-name {
  font-size: 26rpx;
  color: #1f2937;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8rpx;
}
.item-spec {
  font-size: 22rpx;
  color: #9ca3af;
}
.item-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.item-price {
  color: #EF4444;
  font-weight: 600;
  font-size: 30rpx;
}

/* 数量控制 */
.quantity-control {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.qty-btn {
  width: 44rpx;
  height: 44rpx;
  border: 2rpx solid #d1d5db;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #4b5563;
}
.qty-num {
  width: 48rpx;
  text-align: center;
  font-size: 26rpx;
}

/* 删除按钮 */
.delete-btn {
  padding: 12rpx;
  color: #9ca3af;
}
.delete-icon {
  font-size: 30rpx;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
}
.bottom-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.select-all-text {
  font-size: 26rpx;
  color: #1f2937;
}
.bottom-right {
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.total-wrap {
  text-align: right;
}
.total-label {
  font-size: 26rpx;
  color: #6b7280;
}
.total-price {
  color: #EF4444;
  font-size: 36rpx;
  font-weight: 600;
}
.settle-btn {
  background: #EF4444;
  padding: 16rpx 40rpx;
  border-radius: 50rpx;
}
.settle-btn.disabled {
  background: #d1d5db;
}
.settle-btn-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
}
</style>
