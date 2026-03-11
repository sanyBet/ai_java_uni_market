<template>
  <view class="page">
    <!-- 收货地址 -->
    <view class="address-card" @tap="selectAddress">
      <uni-icons type="location-filled" size="22" color="#EF4444" />
      <view class="address-info" v-if="orderStore.currentOrder?.address">
        <view class="address-name-row">
          <text class="address-name">{{ orderStore.currentOrder.address.contactName }}</text>
          <text class="address-phone">{{ orderStore.currentOrder.address.contactPhone }}</text>
        </view>
        <text class="address-detail">
          {{ orderStore.currentOrder.address.province }}{{ orderStore.currentOrder.address.city }}{{ orderStore.currentOrder.address.district }}{{ orderStore.currentOrder.address.detail }}
        </text>
      </view>
      <view class="address-info" v-else>
        <text class="address-placeholder">请选择收货地址</text>
      </view>
      <uni-icons type="right" size="14" color="#9ca3af" />
    </view>

    <!-- 商品清单 -->
    <view class="section">
      <text class="section-title">商品清单</text>
      <view class="order-item" v-for="item in items" :key="item.id">
        <image :src="item.cover" mode="aspectFill" class="order-item-img" />
        <view class="order-item-info">
          <text class="order-item-name">{{ item.productName }}</text>
          <text class="order-item-spec">{{ item.spec }}</text>
          <view class="order-item-bottom">
            <text class="order-item-price">¥{{ item.price }}</text>
            <text class="order-item-qty">x{{ item.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="section">
      <text class="section-title">价格明细</text>
      <view class="price-row">
        <text class="price-label">商品金额</text>
        <text class="price-value">¥{{ totalAmount }}</text>
      </view>
      <view class="price-row">
        <text class="price-label">运费</text>
        <text class="price-value">¥{{ shipping }}</text>
      </view>
      <view class="price-row">
        <text class="price-label">优惠</text>
        <text class="price-value discount">-¥{{ discount }}</text>
      </view>
      <view class="price-divider"></view>
      <view class="price-row">
        <text class="price-total-label">实付款</text>
        <text class="price-total-value">¥{{ payAmount }}</text>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="section">
      <text class="section-title">支付方式</text>
      <view class="pay-option" v-for="method in payMethods" :key="method.id" @tap="selectPay(method.id)">
        <view class="pay-left">
          <uni-icons :type="method.icon" size="24" :color="method.color" />
          <text class="pay-name">{{ method.name }}</text>
        </view>
        <view class="radio" :class="{ active: currentPay === method.id }">
          <view v-if="currentPay === method.id" class="radio-dot"></view>
        </view>
      </view>
    </view>

    <!-- 底部栏 -->
    <view class="bottom-bar">
      <view class="bottom-left">
        <text class="bottom-label">应付金额：</text>
        <text class="bottom-price">¥{{ payAmount }}</text>
      </view>
      <view class="submit-btn" @tap="submitOrder">
        <text class="submit-btn-text">提交订单</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useCartStore } from '@/stores/cart'
import { createOrderApi } from '@/api/order'

const orderStore = useOrderStore()
const cartStore = useCartStore()

const items = computed(() => orderStore.currentOrder?.items || [])
const totalAmount = computed(() => orderStore.currentOrder?.totalAmount || 0)
const shipping = ref(10)
const discount = ref(20)
const payAmount = computed(() => totalAmount.value + shipping.value - discount.value)

const payMethods = [
  { id: 'wechat', name: '微信支付', icon: 'weixin', color: '#07C160' },
  { id: 'alipay', name: '支付宝', icon: 'shop', color: '#1677FF' },
  { id: 'balance', name: '余额支付', icon: 'wallet', color: '#F59E0B' },
]
const currentPay = ref(orderStore.currentOrder?.payMethod || 'wechat')

// 从缓存加载默认地址
if (orderStore.currentOrder && !orderStore.currentOrder.address) {
  try {
    const addresses = JSON.parse(uni.getStorageSync('addresses') || '[]')
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0]
    if (defaultAddr) {
      orderStore.setAddress(defaultAddr)
    }
  } catch (e) { /* ignore */ }
}

function selectAddress() {
  uni.navigateTo({ url: '/pages/address/address?select=1' })
}

function selectPay(id) {
  currentPay.value = id
  orderStore.setPayMethod(id)
}

const submitting = ref(false)

async function submitOrder() {
  if (!orderStore.currentOrder?.address) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' })
    return
  }
  if (submitting.value) return
  submitting.value = true

  const address = orderStore.currentOrder.address
  const orderData = {
    addressId: address.id,
    contactName: address.contactName,
    contactPhone: address.contactPhone,
    address: `${address.province}${address.city}${address.district}${address.detail}`,
    payMethod: currentPay.value,
    items: items.value.map(item => ({
      productId: item.productId,
      spec: item.spec,
      quantity: item.quantity,
      price: item.price,
    })),
    totalAmount: totalAmount.value,
    shippingFee: shipping.value,
    discountAmount: discount.value,
    payAmount: payAmount.value,
  }

  try {
    const res = await createOrderApi(orderData)
    cartStore.clearSelected()
    orderStore.clearCurrentOrder()
    const query = `orderId=${res.orderId}&orderNo=${res.orderNo}&payAmount=${res.payAmount}`
    uni.redirectTo({ url: `/pages/payment/payment?${query}` })
  } catch (e) {
    // error handled by request.js
  } finally {
    submitting.value = false
  }
}
</script>

<style>
.page {
  background: #f9fafb;
  min-height: 100vh;
  padding-bottom: 140rpx;
}

/* 收货地址 */
.address-card {
  background: #fff;
  margin-top: 16rpx;
  padding: 28rpx 32rpx;
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}
.address-icon {
  font-size: 36rpx;
  margin-top: 4rpx;
}
.address-info {
  flex: 1;
}
.address-name-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 8rpx;
}
.address-name {
  font-weight: 500;
  font-size: 28rpx;
}
.address-phone {
  color: #6b7280;
  font-size: 28rpx;
}
.address-detail {
  font-size: 26rpx;
  color: #6b7280;
}
.address-placeholder {
  font-size: 28rpx;
  color: #9ca3af;
}
.chevron {
  font-size: 32rpx;
  color: #9ca3af;
  margin-top: 4rpx;
}

/* 通用 section */
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

/* 商品项 */
.order-item {
  display: flex;
  gap: 20rpx;
  margin-bottom: 24rpx;
}
.order-item:last-child {
  margin-bottom: 0;
}
.order-item-img {
  width: 150rpx;
  height: 150rpx;
  border-radius: 12rpx;
  background: #f3f4f6;
  flex-shrink: 0;
}
.order-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.order-item-name {
  font-size: 26rpx;
  color: #1f2937;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 4rpx;
}
.order-item-spec {
  font-size: 22rpx;
  color: #9ca3af;
  margin-bottom: 8rpx;
}
.order-item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-item-price {
  color: #EF4444;
  font-weight: 600;
  font-size: 28rpx;
}
.order-item-qty {
  font-size: 26rpx;
  color: #6b7280;
}

/* 价格明细 */
.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.price-label {
  font-size: 26rpx;
  color: #6b7280;
}
.price-value {
  font-size: 26rpx;
  color: #1f2937;
}
.price-value.discount {
  color: #EF4444;
}
.price-divider {
  border-top: 2rpx solid #e5e7eb;
  margin: 16rpx 0;
}
.price-total-label {
  font-size: 28rpx;
  font-weight: 600;
}
.price-total-value {
  font-size: 34rpx;
  color: #EF4444;
  font-weight: 600;
}

/* 支付方式 */
.pay-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}
.pay-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.pay-icon {
  font-size: 40rpx;
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
  justify-content: space-between;
  z-index: 10;
}
.bottom-left {
  display: flex;
  align-items: baseline;
}
.bottom-label {
  font-size: 26rpx;
  color: #6b7280;
}
.bottom-price {
  color: #EF4444;
  font-size: 40rpx;
  font-weight: 600;
  margin-left: 4rpx;
}
.submit-btn {
  background: #EF4444;
  padding: 18rpx 48rpx;
  border-radius: 50rpx;
}
.submit-btn-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
}
</style>
