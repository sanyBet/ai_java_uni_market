<template>
  <view class="page">
    <!-- 顶部图标 -->
    <view class="hero">
      <uni-icons type="headphones" size="60" color="#EF4444" class="hero-icon" />
      <text class="hero-title">联系客服</text>
      <text class="hero-subtitle">我们随时为您提供帮助</text>
    </view>

    <!-- 联系方式 -->
    <view class="contact-list">
      <view class="contact-item" v-for="item in contacts" :key="item.label">
        <view class="contact-left">
          <uni-icons :type="item.icon" size="26" color="#374151" />
          <view class="contact-info">
            <text class="contact-label">{{ item.label }}</text>
            <text class="contact-desc">{{ item.desc }}</text>
          </view>
        </view>
        <uni-icons type="right" size="14" color="#9ca3af" />
      </view>
    </view>

    <!-- 工作时间 -->
    <view class="work-time">
      <text class="work-time-title">工作时间</text>
      <text class="work-time-desc">周一至周五 09:00 - 18:00</text>
      <text class="work-time-desc">周末及节假日 10:00 - 17:00</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const contacts = ref([
  { icon: 'phone', label: '电话客服', desc: '400-888-8888' },
  { icon: 'chat', label: '在线客服', desc: '点击咨询在线客服' },
  { icon: 'help', label: '帮助中心', desc: '常见问题解答' },
])
</script>

<style>
.page {
  background: var(--bg-page);
  min-height: 100vh;
}

/* 顶部 */
.hero {
  background: #fff;
  padding: 64rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hero-icon {
  font-size: 100rpx;
  margin-bottom: 24rpx;
}
.hero-title {
  font-size: 40rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}
.hero-subtitle {
  font-size: 26rpx;
  color: var(--text-secondary);
}

/* 联系方式列表 */
.contact-list {
  background: #fff;
  margin-top: 16rpx;
}
.contact-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 2rpx solid #f3f4f6;
}
.contact-item:last-child {
  border-bottom: none;
}
.contact-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.contact-icon {
  font-size: 44rpx;
}
.contact-info {
  display: flex;
  flex-direction: column;
}
.contact-label {
  font-size: 28rpx;
  color: #1f2937;
  margin-bottom: 4rpx;
}
.contact-desc {
  font-size: 24rpx;
  color: var(--text-secondary);
}
.chevron {
  font-size: 32rpx;
  color: #9ca3af;
}

/* 工作时间 */
.work-time {
  background: #fff;
  margin-top: 16rpx;
  padding: 32rpx;
}
.work-time-title {
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 16rpx;
}
.work-time-desc {
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-bottom: 8rpx;
}
</style>
