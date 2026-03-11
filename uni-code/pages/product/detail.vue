<template>
  <view class="page">
    <!-- 图片轮播 -->
    <swiper class="product-swiper" autoplay circular indicator-dots indicator-color="rgba(0,0,0,0.2)" indicator-active-color="#EF4444">
      <swiper-item v-for="(img, index) in (product.detailImgs || [product.cover])" :key="index">
        <image :src="img" mode="aspectFill" class="swiper-img" />
      </swiper-item>
    </swiper>

    <!-- 价格区 -->
    <view class="price-section">
      <view class="price-row">
        <text class="current-price">¥{{ product.price }}</text>
        <text class="origin-price">¥{{ product.originPrice }}</text>
      </view>
      <text class="product-title">{{ product.name }}</text>
      <view class="meta-row">
        <text class="meta-text">销量 {{ product.sales }}</text>
        <text class="meta-text">{{ product.reviewCount > 0 ? '好评率 ' + product.positiveRate + '%' : '暂无评价' }}</text>
      </view>
    </view>

    <!-- 规格选择入口 -->
    <view class="spec-entry" @tap="openSpec('cart')">
      <text class="spec-entry-label">选择规格</text>
      <text class="spec-entry-value">{{ selectedColor }} {{ selectedSize }} ›</text>
    </view>

    <!-- 商品评价 -->
    <view class="review-section">
      <text class="section-title">商品评价</text>
      <view class="review-card" v-for="review in reviews" :key="review.id">
        <view class="review-header">
          <text class="review-user">用户{{ review.userId }}</text>
          <view class="review-stars">
            <uni-icons v-for="i in 5" :key="i" :type="i <= review.rating ? 'star-filled' : 'star'" size="16" :color="i <= review.rating ? '#facc15' : '#d1d5db'" />
          </view>
        </view>
        <text class="review-content">{{ review.content }}</text>
        <view class="review-images" v-if="review.images.length > 0">
          <image v-for="(img, idx) in review.images" :key="idx" :src="img" mode="aspectFill" class="review-img" />
        </view>
        <text class="review-date">{{ review.createTime }}</text>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail-section" v-if="product.description">
      <text class="section-title">商品详情</text>
      <view class="detail-list">
        <text class="detail-item">{{ product.description }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-action">
      <view class="btn-outline" @tap="openSpec('cart')">
        <text class="btn-outline-text">加入购物车</text>
      </view>
      <view class="btn-primary" @tap="openSpec('buy')">
        <text class="btn-primary-text">立即购买</text>
      </view>
    </view>

    <!-- 规格弹窗 -->
    <view class="mask" v-if="showSpec" @tap="showSpec = false"></view>
    <view class="spec-popup" :class="{ show: showSpec }">
      <view class="spec-header">
        <image :src="(product.detailImgs || [product.cover])[0]" mode="aspectFill" class="spec-img" />
        <view class="spec-header-info">
          <text class="spec-price">¥{{ product.price }}</text>
          <text class="spec-selected">已选：{{ selectedColor }} {{ selectedSize }}</text>
        </view>
        <view class="spec-close" @tap="showSpec = false"><uni-icons type="close" size="20" color="#9ca3af" /></view>
      </view>

      <view class="spec-group">
        <text class="spec-label">颜色</text>
        <view class="spec-options">
          <view v-for="c in specColors" :key="c" class="spec-pill" :class="{ 'spec-pill-active': selectedColor === c }" @tap="selectedColor = c">
            <text>{{ c }}</text>
          </view>
        </view>
      </view>

      <view class="spec-group">
        <text class="spec-label">尺码</text>
        <view class="spec-sizes">
          <view v-for="s in specSizes" :key="s" class="spec-size" :class="{ 'spec-size-active': selectedSize === s }" @tap="selectedSize = s">
            <text>{{ s }}</text>
          </view>
        </view>
      </view>

      <view class="spec-group">
        <text class="spec-label">数量</text>
        <view class="quantity-row">
          <view class="qty-btn" @tap="specQty = Math.max(1, specQty - 1)"><text>-</text></view>
          <text class="qty-num">{{ specQty }}</text>
          <view class="qty-btn" @tap="specQty++"><text>+</text></view>
        </view>
      </view>

      <view class="spec-confirm" @tap="confirmAction">
        <text class="spec-confirm-text">{{ actionType === 'buy' ? '立即购买' : '加入购物车' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { getProductDetailApi } from '@/api/product'
import { getReviewsApi } from '@/api/review'

const cartStore = useCartStore()
const orderStore = useOrderStore()

const productId = ref(null)
const product = ref({})
const reviews = ref([])

const specColors = computed(() => {
  const specs = product.value?.specs
  if (specs && specs.colors) return specs.colors
  return ['默认']
})
const specSizes = computed(() => {
  const specs = product.value?.specs
  if (specs && specs.sizes) return specs.sizes
  return ['均码']
})

const selectedColor = ref('')
const selectedSize = ref('')
const specQty = ref(1)
const showSpec = ref(false)
const actionType = ref('cart')

onLoad(async (options) => {
  if (options.id) {
    productId.value = options.id
    await loadProductDetail(options.id)
    loadReviews(options.id)
  }
})

async function loadProductDetail(id) {
  try {
    const data = await getProductDetailApi(id)
    product.value = data || {}
    // 设置默认选中规格
    selectedColor.value = specColors.value[0] || '默认'
    selectedSize.value = specSizes.value[0] || '均码'
  } catch (e) {
    // error handled by request.js
  }
}

async function loadReviews(productId) {
  try {
    const data = await getReviewsApi({ productId, page: 1, pageSize: 10 })
    reviews.value = (data.list || data || []).map(r => ({
      ...r,
      images: r.images || [],
    }))
  } catch (e) {
    reviews.value = []
  }
}

function openSpec(type) {
  actionType.value = type
  showSpec.value = true
}

function confirmAction() {
  showSpec.value = false
  const spec = `${selectedColor.value} / ${selectedSize.value}`

  if (actionType.value === 'cart') {
    cartStore.addToCart(
      { id: product.value.id, name: product.value.name, cover: product.value.cover, price: product.value.price },
      spec,
      specQty.value
    )
    uni.showToast({ title: '已添加到购物车', icon: 'success' })
  } else {
    const item = {
      id: Date.now(),
      productId: product.value.id,
      productName: product.value.name,
      cover: product.value.cover,
      price: product.value.price,
      spec,
      quantity: specQty.value,
      selected: true,
    }
    const totalAmount = product.value.price * specQty.value
    orderStore.setCurrentOrder({
      items: [item],
      totalAmount,
      discountAmount: 0,
      payAmount: totalAmount,
    })
    uni.navigateTo({ url: '/pages/checkout/checkout' })
  }
}
</script>

<style>
.page {
  background: #fff;
  min-height: 100vh;
  padding-bottom: 140rpx;
}

/* 轮播 */
.product-swiper {
  width: 100%;
  height: 750rpx;
}
.swiper-img {
  width: 100%;
  height: 750rpx;
}

/* 价格区 */
.price-section {
  padding: 24rpx 32rpx;
}
.price-row {
  margin-bottom: 16rpx;
}
.current-price {
  font-size: 48rpx;
  color: #EF4444;
  font-weight: 600;
}
.origin-price {
  font-size: 26rpx;
  color: #9ca3af;
  text-decoration: line-through;
  margin-left: 16rpx;
}
.product-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12rpx;
}
.meta-row {
  display: flex;
  gap: 32rpx;
}
.meta-text {
  font-size: 26rpx;
  color: var(--text-secondary);
}

/* 规格选择入口 */
.spec-entry {
  padding: 24rpx 32rpx;
  background: var(--bg-page);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.spec-entry-label {
  font-size: 28rpx;
  color: var(--text-secondary);
}
.spec-entry-value {
  font-size: 28rpx;
  color: #9ca3af;
}

/* 评价区 */
.review-section {
  margin-top: 16rpx;
  padding: 24rpx 32rpx;
  background: var(--bg-page);
}
.section-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}
.review-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}
.review-user {
  font-size: 26rpx;
  font-weight: 500;
}
.review-stars {
  display: flex;
}
.star {
  font-size: 28rpx;
  color: #d1d5db;
}
.star.filled {
  color: #facc15;
}
.review-content {
  font-size: 26rpx;
  color: #374151;
  margin-bottom: 12rpx;
}
.review-images {
  display: flex;
  gap: 12rpx;
  margin-bottom: 12rpx;
}
.review-img {
  width: 150rpx;
  height: 150rpx;
  border-radius: 12rpx;
}
.review-date {
  font-size: 22rpx;
  color: #9ca3af;
}

/* 商品详情 */
.detail-section {
  margin-top: 16rpx;
  padding: 24rpx 32rpx;
}
.detail-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.detail-item {
  font-size: 26rpx;
  color: #374151;
}

/* 底部操作栏 */
.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 2rpx solid #e5e7eb;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  display: flex;
  gap: 20rpx;
  z-index: 10;
}
.btn-outline {
  flex: 1;
  padding: 22rpx 0;
  border-radius: 50rpx;
  text-align: center;
  border: 2rpx solid #EF4444;
}
.btn-outline-text {
  color: #EF4444;
  font-size: 28rpx;
  font-weight: 500;
}
.btn-primary {
  flex: 1;
  padding: 22rpx 0;
  border-radius: 50rpx;
  text-align: center;
  background: #EF4444;
}
.btn-primary-text {
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
}

/* 遮罩 & 弹窗 (复用分类页样式) */
.mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 100;
}
.spec-popup {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  z-index: 101;
  padding: 32rpx;
  transform: translateY(100%);
  transition: transform 0.3s;
}
.spec-popup.show { transform: translateY(0); }

.spec-header { display: flex; gap: 24rpx; margin-bottom: 40rpx; }
.spec-img { width: 180rpx; height: 180rpx; border-radius: 16rpx; }
.spec-header-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.spec-price { font-size: 40rpx; color: #EF4444; font-weight: 600; margin-bottom: 8rpx; }
.spec-selected { font-size: 26rpx; color: var(--text-secondary); }
.spec-close { padding: 8rpx; color: #9ca3af; font-size: 36rpx; }

.spec-group { margin-bottom: 36rpx; }
.spec-label { font-size: 28rpx; font-weight: 500; margin-bottom: 20rpx; }
.spec-options { display: flex; gap: 16rpx; flex-wrap: wrap; justify-content: flex-start; }
.spec-pill { padding: 14rpx 32rpx; border-radius: 50rpx; background: #f3f4f6; font-size: 26rpx; color: #374151; }
.spec-pill-active { background: #EF4444; color: #fff; }
.spec-sizes { display: flex; gap: 0; flex-wrap: wrap; justify-content: flex-start; }
.spec-size { width: 88rpx; height: 88rpx; display: flex; align-items: center; justify-content: center; border-radius: 0; background: #f3f4f6; font-size: 26rpx; color: #374151; border-right: 2rpx solid #e5e7eb; }
.spec-size:first-child { border-radius: 12rpx 0 0 12rpx; }
.spec-size:last-child { border-radius: 0 12rpx 12rpx 0; border-right: none; }
.spec-size-active { background: #EF4444; color: #fff; }

.quantity-row { display: flex; align-items: center; gap: 24rpx; }
.qty-btn { width: 64rpx; height: 64rpx; border: 2rpx solid #d1d5db; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; font-size: 32rpx; color: #374151; }
.qty-num { width: 80rpx; text-align: center; font-size: 30rpx; }

.spec-confirm { margin-top: 16rpx; background: #EF4444; border-radius: 50rpx; padding: 24rpx; text-align: center; }
.spec-confirm-text { color: #fff; font-size: 30rpx; font-weight: 500; }
</style>
