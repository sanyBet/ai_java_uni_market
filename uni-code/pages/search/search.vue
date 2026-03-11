<template>
  <view class="page">
    <!-- 搜索头部 -->
    <view class="search-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="back-btn" @tap="goBack">
        <image src="/static/icons/arrow-left.svg" class="back-icon" />
      </view>
      <view class="search-input-wrap">
        <text class="search-icon">&#xe721;</text>
        <input
          ref="searchInput"
          v-model="keyword"
          type="text"
          placeholder="搜索商品"
          :focus="true"
          confirm-type="search"
          @confirm="onSearch"
        />
        <text v-if="keyword" class="clear-btn" @tap="keyword = ''">&#xe720;</text>
      </view>
      <text class="cancel-btn" @tap="goBack">取消</text>
    </view>

    <!-- 搜索结果 -->
    <view v-if="showResult" class="result-section">
      <view v-if="resultList.length" class="product-grid">
        <view class="product-card" v-for="item in resultList" :key="item.id" @tap="goDetail(item.id)">
          <view class="product-img-wrap">
            <image :src="item.cover" mode="aspectFill" class="product-img" />
            <view v-if="item.isRecommend" class="product-tag">推荐</view>
          </view>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <view class="product-bottom">
              <view class="product-price-wrap">
                <text class="product-price">¥{{ item.price }}</text>
                <text class="product-origin-price">¥{{ item.originPrice }}</text>
              </view>
              <text class="product-sales">{{ item.sales }}人付款</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="empty-result">
        <text class="empty-icon">🔍</text>
        <text class="empty-text">未找到相关商品</text>
      </view>
    </view>

    <!-- 搜索前：历史 + 热门 -->
    <view v-else class="search-body">
      <!-- 搜索历史 -->
      <view v-if="history.length" class="section">
        <view class="section-header">
          <text class="section-title">搜索历史</text>
          <text class="section-action" @tap="clearHistory">清空</text>
        </view>
        <view class="tag-list">
          <text class="tag" v-for="(item, idx) in history" :key="idx" @tap="onTagTap(item)">{{ item }}</text>
        </view>
      </view>

      <!-- 热门搜索 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">热门搜索</text>
        </view>
        <view class="tag-list">
          <text class="tag hot" v-for="(item, idx) in hotKeywords" :key="idx" @tap="onTagTap(item)">{{ item }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { searchProductsApi, getHotKeywordsApi } from '@/api/product'

const statusBarHeight = ref(0)
const sysInfo = uni.getSystemInfoSync()
statusBarHeight.value = sysInfo.statusBarHeight || 0

const keyword = ref('')
const showResult = ref(false)

const hotKeywords = ref([])

async function loadHotKeywords() {
  try {
    const data = await getHotKeywordsApi()
    hotKeywords.value = data || []
  } catch (e) {
    // error handled by request.js
  }
}
loadHotKeywords()

// 搜索历史
const HISTORY_KEY = 'search_history'
const history = ref([])

function loadHistory() {
  try {
    const data = uni.getStorageSync(HISTORY_KEY)
    if (data) history.value = JSON.parse(data)
  } catch (e) { /* ignore */ }
}
loadHistory()

function saveHistory(kw) {
  const list = history.value.filter(item => item !== kw)
  list.unshift(kw)
  if (list.length > 10) list.length = 10
  history.value = list
  uni.setStorageSync(HISTORY_KEY, JSON.stringify(list))
}

function clearHistory() {
  history.value = []
  uni.removeStorageSync(HISTORY_KEY)
}

// 搜索结果
const resultList = ref([])

async function onSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  saveHistory(kw)
  try {
    const data = await searchProductsApi({ keyword: kw, page: 1, pageSize: 20 })
    resultList.value = data.list || data || []
  } catch (e) {
    resultList.value = []
  }
  showResult.value = true
}

function onTagTap(tag) {
  keyword.value = tag
  onSearch()
}

function goBack() {
  uni.navigateBack()
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}
</script>

<style>
.page {
  background-color: var(--bg-page);
  min-height: 100vh;
}

/* 搜索头部 */
.search-header {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20rpx 32rpx;
  position: sticky;
  top: 0;
  z-index: 10;
}
.back-btn {
  margin-right: 16rpx;
  padding: 8rpx;
  flex-shrink: 0;
}
.back-icon {
  width: 40rpx;
  height: 40rpx;
}
.search-input-wrap {
  flex: 1;
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
.search-input-wrap input {
  flex: 1;
  font-size: 28rpx;
  color: #1f2937;
}
.clear-btn {
  font-size: 32rpx;
  color: #9ca3af;
  padding: 0 8rpx;
}
.cancel-btn {
  font-size: 28rpx;
  color: #6b7280;
  margin-left: 24rpx;
  flex-shrink: 0;
}

/* 搜索主体 */
.search-body {
  padding: 32rpx;
}
.section {
  margin-bottom: 40rpx;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2937;
}
.section-action {
  font-size: 24rpx;
  color: #9ca3af;
}

/* 标签 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.tag {
  background: #f3f4f6;
  color: #374151;
  font-size: 24rpx;
  padding: 12rpx 28rpx;
  border-radius: 32rpx;
}
.tag.hot {
  background: #FEF2F2;
  color: #EF4444;
}

/* 搜索结果 */
.result-section {
  padding: 32rpx;
}
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
  gap: 8rpx;
}
.product-price {
  font-size: 34rpx;
  color: var(--primary);
  font-weight: 600;
}
.product-origin-price {
  font-size: 22rpx;
  color: #9ca3af;
  text-decoration: line-through;
}
.product-sales {
  font-size: 22rpx;
  color: #9ca3af;
}

/* 空结果 */
.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}
.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}
.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}
</style>
