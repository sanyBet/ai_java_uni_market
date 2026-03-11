<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-bar" @tap="goSearch">
      <view class="search-input">
        <uni-icons type="search" size="18" color="#9ca3af" class="search-icon" />
        <input type="text" placeholder="搜索商品" disabled />
      </view>
    </view>

    <!-- Banner 轮播 -->
    <swiper class="banner" autoplay circular :interval="3000" indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#ffffff">
      <swiper-item v-for="banner in banners" :key="banner.id" @tap="onBannerTap(banner)">
        <image :src="banner.cover" mode="aspectFill" class="banner-img" />
      </swiper-item>
    </swiper>

    <!-- 快捷入口 -->
    <view class="quick-links">
      <view class="quick-item" v-for="item in quickLinks" :key="item.name">
        <view class="quick-icon" :class="item.bgClass">
          <uni-icons :type="item.icon" size="24" :color="item.color" />
        </view>
        <text class="quick-label">{{ item.name }}</text>
      </view>
    </view>

    <!-- 热门商品 -->
    <view class="section">
      <text class="section-title">热门商品</text>
      <view class="product-grid">
        <view class="product-card" v-for="item in products" :key="item.id" @tap="goDetail(item.id)">
          <view class="product-img-wrap">
            <image :src="item.cover" mode="aspectFill" class="product-img" />
            <view v-if="item.isRecommend" class="product-tag">推荐</view>
          </view>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <view class="product-bottom">
              <view class="product-price-wrap">
                <text class="product-price">¥{{ item.price }}</text>
                <text class="product-sales">{{ item.sales }}人付款</text>
              </view>
              <view class="cart-btn" @tap.stop="onQuickAdd(item)">
                <text class="cart-btn-icon">+</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { useCartStore } from '@/stores/cart'
import { getHomeDataApi } from '@/api/home'

const cartStore = useCartStore()

onShow(() => {
  const count = cartStore.cartCount
  if (count > 0) {
    uni.setTabBarBadge({ index: 2, text: String(count) })
  } else {
    uni.removeTabBarBadge({ index: 2 })
  }
})

onPullDownRefresh(async () => {
  await loadHomeData()
  uni.stopPullDownRefresh()
})

const banners = ref([])
const products = ref([])

const quickLinks = ref([
  { icon: 'fire', name: '秒杀', bgClass: 'bg-orange', color: '#F97316' },
  { icon: 'gift', name: '优惠券', bgClass: 'bg-red', color: '#EF4444' },
  { icon: 'star', name: '新品', bgClass: 'bg-blue', color: '#3B82F6' },
  { icon: 'fire-filled', name: '热卖', bgClass: 'bg-pink', color: '#EC4899' },
])

async function loadHomeData() {
  try {
    const data = await getHomeDataApi()
    banners.value = data.banners || []
    products.value = data.recommendProducts || []
  } catch (e) {
    // error handled by request.js
  }
}

loadHomeData()

function onBannerTap(banner) {
  if (banner.productId) {
    uni.navigateTo({ url: `/pages/product/detail?id=${banner.productId}` })
  }
}

function goSearch() {
  uni.navigateTo({ url: '/pages/search/search' })
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

function onQuickAdd(item) {
  cartStore.addToCart(item, '默认', 1)
  uni.showToast({ title: '已加入购物车', icon: 'success' })
}
</script>

<style>
.page {
  background-color: var(--bg-page);
  min-height: 100vh;
}

/* 搜索栏 */
.search-bar {
  background: #fff;
  padding: 20rpx 32rpx;
  position: sticky;
  top: 0;
  z-index: 10;
}
.search-input {
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 50rpx;
  padding: 16rpx 28rpx;
}
.search-icon {
  font-size: 32rpx;
  color: #9ca3af;
  margin-right: 12rpx;
}
.search-input input {
  flex: 1;
  font-size: 28rpx;
  color: var(--text-primary);
}

/* Banner */
.banner {
  width: 100%;
  height: 360rpx;
  background: #fff;
}
.banner-img {
  width: 100%;
  height: 360rpx;
}

/* 快捷入口 */
.quick-links {
  background: #fff;
  margin-top: 16rpx;
  padding: 32rpx;
  display: flex;
  justify-content: space-around;
}
.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.quick-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}
.quick-icon-text {
  font-size: 40rpx;
}
.bg-orange { background: #FFF7ED; }
.bg-red { background: #FEF2F2; }
.bg-blue { background: #EFF6FF; }
.bg-pink { background: #FDF2F8; }

.quick-label {
  font-size: 24rpx;
  color: #374151;
}

/* 商品区域 */
.section {
  background: #fff;
  margin-top: 16rpx;
  padding: 32rpx;
}
.section-title {
  font-size: 34rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}

/* 商品网格 */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.product-card {
  width: calc(50% - 10rpx);
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}
.product-img-wrap {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background: #f3f4f6;
}
.product-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.product-tag {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  background: var(--primary);
  color: #fff;
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
}
.product-info {
  padding: 20rpx;
}
.product-name {
  font-size: 26rpx;
  color: #1f2937;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 72rpx;
  margin-bottom: 12rpx;
}
.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.product-price-wrap {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
}
.product-price {
  font-size: 34rpx;
  color: var(--primary);
  font-weight: 600;
}
.product-sales {
  font-size: 22rpx;
  color: #9ca3af;
  margin-left: 8rpx;
}
.cart-btn {
  width: 56rpx;
  height: 56rpx;
  background: #EF4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cart-btn-icon {
  color: #fff;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 1;
}
</style>
