<template>
  <view class="page">
    <!-- 商品信息 -->
    <view class="product-card" v-if="orderDetail">
      <view class="product-item" v-for="item in orderDetail.orderItems" :key="item.productId">
        <image :src="item.cover" mode="aspectFill" class="product-img" />
        <view class="product-info">
          <text class="product-name">{{ item.productName }}</text>
          <text class="product-spec" v-if="item.spec">{{ item.spec }}</text>
        </view>
      </view>
    </view>

    <!-- 评分 -->
    <view class="section">
      <text class="section-title">商品评分</text>
      <view class="stars-row">
        <view v-for="i in 5" :key="i" @tap="rating = i" class="star-tap">
          <uni-icons :type="i <= rating ? 'star-filled' : 'star'" size="32" :color="i <= rating ? '#facc15' : '#d1d5db'" />
        </view>
        <text class="rating-text">{{ ratingTexts[rating - 1] }}</text>
      </view>
    </view>

    <!-- 评价内容 -->
    <view class="section">
      <text class="section-title">评价内容</text>
      <textarea
        class="review-textarea"
        v-model="content"
        placeholder="请分享您的使用体验..."
        maxlength="500"
        :auto-height="false"
      />
      <text class="char-count">{{ content.length }}/500</text>
    </view>

    <!-- 图片上传 -->
    <view class="section">
      <text class="section-title">上传图片（最多3张）</text>
      <view class="image-list">
        <view class="image-item" v-for="(img, index) in images" :key="index">
          <image :src="img" mode="aspectFill" class="upload-img" />
          <view class="image-remove" @tap="removeImage(index)">
            <uni-icons type="close" size="14" color="#fff" />
          </view>
        </view>
        <view class="image-add" v-if="images.length < 3" @tap="chooseImage">
          <uni-icons type="plusempty" size="32" color="#9ca3af" />
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-wrap">
      <view class="submit-btn" :class="{ disabled: submitting }" @tap="submitReview">
        <text class="submit-btn-text">{{ submitting ? '提交中...' : '提交评价' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getOrderDetailApi } from '@/api/order'
import { createReviewApi } from '@/api/review'

const orderId = ref(null)
const orderDetail = ref(null)
const rating = ref(5)
const content = ref('')
const images = ref([])
const submitting = ref(false)

const ratingTexts = ['非常差', '差', '一般', '满意', '非常满意']

onLoad(async (options) => {
  if (options.orderId) {
    orderId.value = Number(options.orderId)
    try {
      orderDetail.value = await getOrderDetailApi(orderId.value)
    } catch (e) {
      uni.showToast({ title: '获取订单失败', icon: 'none' })
    }
  }
})

function chooseImage() {
  uni.chooseImage({
    count: 3 - images.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      images.value.push(...res.tempFilePaths)
    },
  })
}

function removeImage(index) {
  images.value.splice(index, 1)
}

async function submitReview() {
  if (submitting.value) return
  if (!content.value.trim()) {
    uni.showToast({ title: '请填写评价内容', icon: 'none' })
    return
  }
  if (!orderDetail.value || !orderDetail.value.orderItems?.length) {
    uni.showToast({ title: '订单信息异常', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    // 为订单中每个商品提交评价
    for (const item of orderDetail.value.orderItems) {
      await createReviewApi({
        orderId: orderId.value,
        productId: item.productId,
        rating: rating.value,
        content: content.value,
        images: images.value,
      })
    }
    uni.showToast({ title: '评价成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    // error handled by request.js
  } finally {
    submitting.value = false
  }
}
</script>

<style>
.page {
  background: var(--bg-page);
  min-height: 100vh;
  padding-bottom: 140rpx;
}

/* 商品信息 */
.product-card {
  background: #fff;
  padding: 24rpx 32rpx;
  margin-bottom: 16rpx;
}
.product-item {
  display: flex;
  gap: 20rpx;
  margin-bottom: 16rpx;
}
.product-item:last-child {
  margin-bottom: 0;
}
.product-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  background: #f3f4f6;
  flex-shrink: 0;
}
.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.product-name {
  font-size: 28rpx;
  color: #1f2937;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-spec {
  font-size: 24rpx;
  color: #9ca3af;
  margin-top: 8rpx;
}

/* 通用 section */
.section {
  background: #fff;
  padding: 24rpx 32rpx;
  margin-bottom: 16rpx;
}
.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20rpx;
}

/* 评分 */
.stars-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.star-tap {
  padding: 8rpx;
}
.rating-text {
  font-size: 26rpx;
  color: #f97316;
  margin-left: 12rpx;
}

/* 文本框 */
.review-textarea {
  width: 100%;
  height: 200rpx;
  background: #f9fafb;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #374151;
  box-sizing: border-box;
}
.char-count {
  font-size: 24rpx;
  color: #9ca3af;
  text-align: right;
  margin-top: 8rpx;
}

/* 图片上传 */
.image-list {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}
.image-item {
  position: relative;
  width: 180rpx;
  height: 180rpx;
}
.upload-img {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}
.image-remove {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  width: 40rpx;
  height: 40rpx;
  background: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-add {
  width: 180rpx;
  height: 180rpx;
  border: 2rpx dashed #d1d5db;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 提交按钮 */
.submit-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  border-top: 2rpx solid #e5e7eb;
}
.submit-btn {
  background: #EF4444;
  border-radius: 50rpx;
  padding: 24rpx;
  text-align: center;
}
.submit-btn.disabled {
  opacity: 0.6;
}
.submit-btn-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
}
</style>
