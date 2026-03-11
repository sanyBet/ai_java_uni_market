<template>
  <view class="page">
    <view class="container">
      <!-- 左侧分类 -->
      <scroll-view scroll-y class="sidebar">
        <view
          v-for="cat in categories"
          :key="cat.id"
          class="sidebar-item"
          :class="{ 'sidebar-item-active': selectedId === cat.id }"
          @tap="selectedId = cat.id"
        >
          <text>{{ cat.name }}</text>
        </view>
      </scroll-view>

      <!-- 右侧商品 -->
      <scroll-view scroll-y class="content">
        <text class="content-title">{{ currentCategoryName }}</text>
        <view class="product-grid">
          <view
            v-for="item in products"
            :key="item.id"
            class="product-card"
            @tap="goDetail(item.id)"
          >
            <view class="product-img-wrap">
              <image :src="item.cover" mode="aspectFill" class="product-img" />
            </view>
            <view class="product-info">
              <text class="product-name">{{ item.name }}</text>
              <view class="product-bottom">
                <text class="product-price">¥{{ item.price }}</text>
                <view class="cart-btn" @tap.stop="openSpec(item)">
                  <text class="cart-btn-icon">+</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 规格弹窗 -->
    <view class="mask" v-if="showSpec" @tap="showSpec = false"></view>
    <view class="spec-popup" :class="{ show: showSpec }">
      <template v-if="specProduct">
        <!-- 头部预览 -->
        <view class="spec-header">
          <image :src="specProduct.cover" mode="aspectFill" class="spec-img" />
          <view class="spec-header-info">
            <text class="spec-price">¥{{ specProduct.price }}</text>
            <text class="spec-selected">已选：{{ selectedColor }} {{ selectedSize }}</text>
          </view>
          <view class="spec-close" @tap="showSpec = false">
            <uni-icons type="close" size="20" color="#9ca3af" />
          </view>
        </view>

        <!-- 颜色选择 -->
        <view class="spec-section">
          <text class="spec-label">颜色</text>
          <view class="spec-options">
            <view
              v-for="c in specColors"
              :key="c"
              class="spec-pill"
              :class="{ 'spec-pill-active': selectedColor === c }"
              @tap="selectedColor = c"
            >
              <text>{{ c }}</text>
            </view>
          </view>
        </view>

        <!-- 尺码选择 -->
        <view class="spec-section">
          <text class="spec-label">尺码</text>
          <view class="spec-options">
            <view
              v-for="s in specSizes"
              :key="s"
              class="spec-size"
              :class="{ 'spec-size-active': selectedSize === s }"
              @tap="selectedSize = s"
            >
              <text>{{ s }}</text>
            </view>
          </view>
        </view>

        <!-- 数量 -->
        <view class="spec-section">
          <text class="spec-label">数量</text>
          <view class="quantity-row">
            <view class="qty-btn" @tap="specQty = Math.max(1, specQty - 1)"><text>-</text></view>
            <text class="qty-num">{{ specQty }}</text>
            <view class="qty-btn" @tap="specQty++"><text>+</text></view>
          </view>
        </view>

        <!-- 加入购物车 -->
        <view class="spec-submit" @tap="confirmAdd">
          <text class="spec-submit-text">加入购物车</text>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useCartStore } from '@/stores/cart'
import { getCategoriesApi, getCategoryProductsApi } from '@/api/category'

const cartStore = useCartStore()

onShow(() => {
  const count = cartStore.cartCount
  if (count > 0) {
    uni.setTabBarBadge({ index: 2, text: String(count) })
  } else {
    uni.removeTabBarBadge({ index: 2 })
  }
})

const categories = ref([])
const selectedId = ref(null)
const products = ref([])

const currentCategoryName = computed(() => {
  const cat = categories.value.find(c => c.id === selectedId.value)
  return cat ? cat.name : ''
})

async function loadCategories() {
  try {
    const data = await getCategoriesApi()
    categories.value = data || []
    if (categories.value.length > 0 && !selectedId.value) {
      selectedId.value = categories.value[0].id
    }
  } catch (e) {
    // error handled by request.js
  }
}

async function loadProducts(categoryId) {
  if (!categoryId) return
  try {
    const data = await getCategoryProductsApi(categoryId, { page: 1, pageSize: 50 })
    products.value = data.list || data || []
  } catch (e) {
    products.value = []
  }
}

watch(selectedId, (newId) => {
  if (newId) loadProducts(newId)
})

loadCategories()

const showSpec = ref(false)
const specProduct = ref(null)
const selectedColor = ref('')
const selectedSize = ref('')
const specQty = ref(1)

// 规格选项从商品数据动态获取，无数据时使用默认值
const specColors = computed(() => {
  const specs = specProduct.value?.specs
  if (specs && specs.colors) return specs.colors
  return ['默认']
})
const specSizes = computed(() => {
  const specs = specProduct.value?.specs
  if (specs && specs.sizes) return specs.sizes
  return ['均码']
})

function goDetail(id) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

function openSpec(product) {
  specProduct.value = product
  selectedColor.value = specColors.value[0] || '默认'
  selectedSize.value = specSizes.value[0] || '均码'
  specQty.value = 1
  showSpec.value = true
}

function confirmAdd() {
  const product = specProduct.value
  cartStore.addToCart(
    { id: product.id, name: product.name, cover: product.cover, price: product.price },
    `${selectedColor.value} / ${selectedSize.value}`,
    specQty.value
  )
  showSpec.value = false
  uni.showToast({ title: '已加入购物车', icon: 'success' })
}
</script>

<style>
.page {
  height: 100vh;
  background: var(--bg-page);
  display: flex;
  flex-direction: column;
}
.container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧栏 */
.sidebar {
  width: 180rpx;
  background: #fff;
  height: 100%;
}
.sidebar-item {
  padding: 28rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: #374151;
  border-left: 4rpx solid transparent;
}
.sidebar-item-active {
  background: #f9fafb;
  border-left-color: #EF4444;
  color: #EF4444;
}

/* 右侧内容 */
.content {
  flex: 1;
  padding: 24rpx;
  height: 100%;
}
.content-title {
  font-size: 34rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}

/* 商品网格 */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.product-card {
  width: calc(50% - 8rpx);
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}
.product-img-wrap {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  background: #f3f4f6;
}
.product-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.product-info {
  padding: 16rpx;
}
.product-name {
  font-size: 26rpx;
  color: #1f2937;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12rpx;
}
.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.product-price {
  font-size: 32rpx;
  color: var(--primary);
  font-weight: 600;
}
.cart-btn {
  width: 48rpx;
  height: 48rpx;
  background: #EF4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-btn-icon {
  color: #fff;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1;
}

/* 遮罩 */
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 100;
}

/* 规格弹窗 */
.spec-popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  z-index: 101;
  padding: 32rpx;
  transform: translateY(100%);
  transition: transform 0.3s;
}
.spec-popup.show {
  transform: translateY(0);
}

.spec-header {
  display: flex;
  gap: 24rpx;
  margin-bottom: 40rpx;
}
.spec-img {
  width: 180rpx;
  height: 180rpx;
  border-radius: 16rpx;
}
.spec-header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.spec-price {
  font-size: 40rpx;
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 8rpx;
}
.spec-selected {
  font-size: 26rpx;
  color: var(--text-secondary);
}
.spec-close {
  padding: 8rpx;
  color: #9ca3af;
  font-size: 36rpx;
}

.spec-section {
  margin-bottom: 36rpx;
}
.spec-label {
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 20rpx;
}
.spec-options {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}
.spec-pill {
  padding: 14rpx 32rpx;
  border-radius: 50rpx;
  background: #f3f4f6;
  font-size: 26rpx;
  color: #374151;
}
.spec-pill-active {
  background: #EF4444;
  color: #fff;
}
.spec-size {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  background: #f3f4f6;
  font-size: 26rpx;
  color: #374151;
}
.spec-size-active {
  background: #EF4444;
  color: #fff;
}

.quantity-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.qty-btn {
  width: 64rpx;
  height: 64rpx;
  border: 2rpx solid #d1d5db;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #374151;
}
.qty-num {
  width: 80rpx;
  text-align: center;
  font-size: 30rpx;
}

.spec-submit {
  margin-top: 16rpx;
  background: var(--primary);
  border-radius: 50rpx;
  padding: 24rpx;
  text-align: center;
}
.spec-submit-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
}
</style>
