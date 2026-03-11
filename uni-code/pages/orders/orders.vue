<template>
  <view class="page">
    <!-- Tabs -->
    <scroll-view scroll-x class="tabs">
      <view class="tabs-inner">
        <view
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ 'tab-item-active': activeTab === tab.id }"
          @tap="activeTab = tab.id"
        >
          <text class="tab-text" :class="{ 'tab-text-active': activeTab === tab.id }">{{ tab.label }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 订单列表 -->
    <view class="order-list" v-if="filteredOrders.length > 0">
      <view class="order-card" v-for="order in filteredOrders" :key="order.id">
        <!-- 订单头 -->
        <view class="order-header">
          <text class="order-no">订单号：{{ order.orderNo }}</text>
          <text class="order-status" :style="{ color: statusConfig[order.status].color }">
            {{ statusConfig[order.status].label }}
          </text>
        </view>

        <!-- 商品列表 -->
        <view class="order-item" v-for="item in order.orderItems" :key="item.productId">
          <image :src="item.cover" mode="aspectFill" class="order-item-img" />
          <view class="order-item-info">
            <text class="order-item-name">{{ item.productName }}</text>
            <text class="order-item-spec" v-if="item.spec">{{ item.spec }}</text>
            <view class="order-item-bottom">
              <text class="order-item-price">¥{{ item.price }}</text>
              <text class="order-item-qty">x{{ item.quantity }}</text>
            </view>
          </view>
        </view>

        <!-- 订单尾 -->
        <view class="order-footer">
          <view class="order-footer-info">
            <text class="order-time">下单时间：{{ order.createTime }}</text>
            <view class="order-total-wrap">
              <text class="order-total-label">共计：</text>
              <text class="order-total-price">¥{{ order.payAmount }}</text>
            </view>
          </view>
          <view class="order-actions">
            <template v-if="order.status === 0">
              <view class="order-btn-outline" @tap="cancelOrder(order)"><text class="order-btn-outline-text">取消订单</text></view>
              <view class="order-btn-primary" @tap="payOrder(order)"><text class="order-btn-primary-text">去支付</text></view>
            </template>
            <template v-if="order.status === 1">
              <view class="order-btn-outline" @tap="applyRefund(order)"><text class="order-btn-outline-text">申请退款</text></view>
            </template>
            <template v-if="order.status === 2">
              <view class="order-btn-outline" @tap="applyRefund(order)"><text class="order-btn-outline-text">申请退款</text></view>
              <view class="order-btn-primary" @tap="confirmReceive(order)"><text class="order-btn-primary-text">确认收货</text></view>
            </template>
            <template v-if="order.status === 3">
              <view class="order-btn-primary" @tap="goReview(order)"><text class="order-btn-primary-text">去评价</text></view>
            </template>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty" v-else>
      <text class="empty-text">暂无订单</text>
    </view>

    <!-- 底部确认付款栏 -->
    <view class="bottom-bar">
      <view class="confirm-pay-btn" @tap="confirmPay">
        <text class="confirm-pay-btn-text">确认付款</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { getOrderListApi, cancelOrderApi, payOrderApi, confirmOrderApi, applyRefundApi } from '@/api/order'

const tabs = [
  { id: 'all', label: '全部' },
  { id: 0, label: '待支付' },
  { id: 1, label: '待发货' },
  { id: 2, label: '待收货' },
  { id: 3, label: '已完成' },
  { id: 4, label: '退款/售后' },
]

const statusConfig = {
  0: { label: '待支付', color: '#f97316' },
  1: { label: '待发货', color: '#3b82f6' },
  2: { label: '待收货', color: '#3b82f6' },
  3: { label: '已完成', color: '#22c55e' },
  4: { label: '退款中', color: '#ef4444' },
  5: { label: '已取消', color: '#9ca3af' },
}

const activeTab = ref('all')
const orders = ref([])

async function loadOrders() {
  try {
    const params = { page: 1, pageSize: 50 }
    if (activeTab.value !== 'all') {
      params.status = activeTab.value
    }
    const data = await getOrderListApi(params)
    orders.value = data.list || data || []
  } catch (e) {
    orders.value = []
  }
}

watch(activeTab, () => {
  loadOrders()
})

function cancelOrder(order) {
  uni.showModal({
    title: '提示',
    content: '确定取消该订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await cancelOrderApi(order.id)
          uni.showToast({ title: '订单已取消', icon: 'success' })
          loadOrders()
        } catch (e) {
          // error handled by request.js
        }
      }
    },
  })
}

function payOrder(order) {
  uni.showModal({
    title: '提示',
    content: '确认支付 ¥' + order.payAmount + '？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await payOrderApi(order.id)
          uni.showToast({ title: '支付成功', icon: 'success' })
          loadOrders()
        } catch (e) {
          // error handled by request.js
        }
      }
    },
  })
}

function applyRefund(order) {
  uni.showModal({
    title: '提示',
    content: '确定申请退款？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await applyRefundApi(order.id)
          uni.showToast({ title: '已申请退款', icon: 'success' })
          loadOrders()
        } catch (e) {
          // error handled by request.js
        }
      }
    },
  })
}
function confirmReceive(order) {
  uni.showModal({
    title: '提示',
    content: '确认已收到货物？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await confirmOrderApi(order.id)
          uni.showToast({ title: '已确认收货', icon: 'success' })
          loadOrders()
        } catch (e) {
          // error handled by request.js
        }
      }
    },
  })
}

function goReview(order) {
  uni.navigateTo({ url: `/pages/review/review?orderId=${order.id}` })
}

function confirmPay() {
  uni.showModal({
    title: '确认付款',
    content: '确认进行付款操作？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '付款成功', icon: 'success' })
        loadOrders()
      }
    },
  })
}

const filteredOrders = computed(() => {
  return orders.value
})

onLoad((options) => {
  if (options.status) {
    const s = Number(options.status)
    if (tabs.find(t => t.id === s)) {
      activeTab.value = s
    }
  }
  loadOrders()
})

onPullDownRefresh(async () => {
  await loadOrders()
  uni.stopPullDownRefresh()
})
</script>

<style>
.page {
  background: var(--bg-page);
  min-height: 100vh;
}

/* Tabs */
.tabs {
  background: #fff;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
}
.tabs-inner {
  display: inline-flex;
}
.tab-item {
  padding: 24rpx 32rpx;
  flex-shrink: 0;
  border-bottom: 4rpx solid transparent;
}
.tab-item-active {
  border-bottom-color: #EF4444;
}
.tab-text {
  font-size: 28rpx;
  color: #6b7280;
}
.tab-text-active {
  color: #EF4444;
}

/* 订单列表 */
.order-list {
  padding-top: 16rpx;
  padding-bottom: 120rpx;
}
.order-card {
  background: #fff;
  margin-bottom: 16rpx;
  padding: 28rpx 32rpx;
}

/* 订单头 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f3f4f6;
  margin-bottom: 20rpx;
}
.order-no {
  font-size: 24rpx;
  color: var(--text-secondary);
}
.order-status {
  font-size: 26rpx;
  font-weight: 500;
}

/* 商品项 */
.order-item {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
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
}
.order-item-spec {
  font-size: 22rpx;
  color: #9ca3af;
}
.order-item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-item-price {
  color: var(--primary);
  font-weight: 600;
  font-size: 28rpx;
}
.order-item-qty {
  font-size: 26rpx;
  color: var(--text-secondary);
}

/* 订单尾 */
.order-footer {
  border-top: 2rpx solid #f3f4f6;
  padding-top: 20rpx;
}
.order-footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.order-time {
  font-size: 24rpx;
  color: var(--text-secondary);
}
.order-total-wrap {
  display: flex;
  align-items: baseline;
}
.order-total-label {
  font-size: 26rpx;
  color: var(--text-secondary);
}
.order-total-price {
  color: var(--primary);
  font-weight: 600;
  font-size: 30rpx;
  margin-left: 4rpx;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}
.order-btn-outline {
  padding: 12rpx 28rpx;
  border-radius: 50rpx;
  border: 2rpx solid #d1d5db;
}
.order-btn-outline-text {
  font-size: 24rpx;
  color: #374151;
}
.order-btn-primary {
  padding: 12rpx 28rpx;
  border-radius: 50rpx;
  background: #EF4444;
}
.order-btn-primary-text {
  font-size: 24rpx;
  color: #fff;
}

/* 底部确认付款栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: flex-end;
  z-index: 100;
}
.confirm-pay-btn {
  padding: 18rpx 48rpx;
  border-radius: 50rpx;
  background: #EF4444;
}
.confirm-pay-btn-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
}

/* 空状态 */
.empty {
  padding-top: 200rpx;
  text-align: center;
}
.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}
</style>
