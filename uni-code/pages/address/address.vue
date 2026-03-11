<template>
  <view class="page">
    <!-- 新增/编辑表单 -->
    <template v-if="showForm">
      <view class="form">
        <view class="field">
          <text class="field-label">收货人</text>
          <input type="text" v-model="form.contactName" placeholder="请输入收货人姓名" class="field-input" />
        </view>
        <view class="field">
          <text class="field-label">手机号码</text>
          <input type="number" v-model="form.contactPhone" placeholder="请输入手机号码" class="field-input" />
        </view>
        <view class="field">
          <text class="field-label">所在地区</text>
          <view class="region-row">
            <picker mode="selector" :range="provinces" @change="e => form.province = provinces[e.detail.value]">
              <view class="region-picker"><text>{{ form.province }}</text></view>
            </picker>
            <picker mode="selector" :range="cities" @change="e => form.city = cities[e.detail.value]">
              <view class="region-picker"><text>{{ form.city }}</text></view>
            </picker>
            <picker mode="selector" :range="districts" @change="e => form.district = districts[e.detail.value]">
              <view class="region-picker"><text>{{ form.district }}</text></view>
            </picker>
          </view>
        </view>
        <view class="field">
          <text class="field-label">详细地址</text>
          <textarea v-model="form.detail" placeholder="街道、楼牌号等" class="field-textarea" :maxlength="200" />
        </view>
        <view class="switch-row">
          <text class="switch-label">设为默认地址</text>
          <switch :checked="form.isDefault" @change="form.isDefault = $event.detail.value" color="#EF4444" />
        </view>

        <view class="save-btn" @tap="saveAddress">
          <text class="save-btn-text">保存</text>
        </view>
      </view>
    </template>

    <!-- 地址列表 -->
    <template v-else>
      <view class="address-list">
        <view
          class="address-card"
          v-for="addr in addresses"
          :key="addr.id"
          @tap="selectAddr(addr)"
        >
          <uni-icons type="location" size="22" color="#EF4444" class="address-pin" />
          <view class="address-content">
            <view class="address-name-row">
              <text class="address-name">{{ addr.contactName }}</text>
              <text class="address-phone">{{ addr.contactPhone }}</text>
              <view v-if="addr.isDefault" class="default-tag">
                <text class="default-tag-text">默认</text>
              </view>
            </view>
            <text class="address-full">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</text>

            <view class="address-actions" v-if="!isSelectMode">
              <text class="action-link" @tap.stop="editAddr(addr)">编辑</text>
              <text class="action-link" @tap.stop="deleteAddr(addr.id)">删除</text>
              <text class="action-link primary" v-if="!addr.isDefault" @tap.stop="setDefault(addr.id)">设为默认</text>
            </view>
          </view>

          <!-- 选择模式单选 -->
          <view v-if="isSelectMode" class="radio" :class="{ active: addr.isDefault }">
            <view v-if="addr.isDefault" class="radio-dot"></view>
          </view>
        </view>
      </view>

      <!-- 底部新增按钮 -->
      <view class="add-btn-wrap">
        <view class="add-btn" @tap="openAddForm">
          <text class="add-btn-text">+ 新增收货地址</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()
const isSelectMode = ref(false)
const showForm = ref(false)
const editingId = ref(null)

const defaultAddresses = [
  { id: 1, contactName: '张三', contactPhone: '138****8888', province: '浙江省', city: '杭州市', district: '西湖区', detail: '文三路XX号XX大厦XX室', isDefault: true },
  { id: 2, contactName: '李四', contactPhone: '139****9999', province: '浙江省', city: '杭州市', district: '滨江区', detail: '滨盛路XX号XX中心XX层', isDefault: false },
]

function loadAddresses() {
  try {
    const saved = JSON.parse(uni.getStorageSync('addresses') || '[]')
    if (saved.length > 0) return saved
  } catch (e) { /* ignore */ }
  // 首次加载：将默认地址写入 storage
  uni.setStorageSync('addresses', JSON.stringify(defaultAddresses))
  return defaultAddresses
}

function saveAddresses() {
  uni.setStorageSync('addresses', JSON.stringify(addresses.value))
}

const addresses = ref(loadAddresses())

const provinces = ['浙江省', '江苏省', '上海市']
const cities = ['杭州市', '宁波市', '温州市']
const districts = ['西湖区', '滨江区', '余杭区']

const form = ref({
  contactName: '',
  contactPhone: '',
  province: '浙江省',
  city: '杭州市',
  district: '西湖区',
  detail: '',
  isDefault: false,
})

onLoad((options) => {
  if (options.select === '1') {
    isSelectMode.value = true
  }
})

function selectAddr(addr) {
  if (!isSelectMode.value) return
  orderStore.setAddress(addr)
  uni.navigateBack()
}

function openAddForm() {
  editingId.value = null
  form.value = { contactName: '', contactPhone: '', province: '浙江省', city: '杭州市', district: '西湖区', detail: '', isDefault: false }
  showForm.value = true
  uni.setNavigationBarTitle({ title: '新增地址' })
}

function editAddr(addr) {
  editingId.value = addr.id
  form.value = { ...addr }
  showForm.value = true
  uni.setNavigationBarTitle({ title: '编辑地址' })
}

function saveAddress() {
  if (!form.value.contactName || !form.value.contactPhone || !form.value.detail) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }

  if (editingId.value) {
    const idx = addresses.value.findIndex(a => a.id === editingId.value)
    if (idx > -1) {
      addresses.value[idx] = { ...form.value, id: editingId.value }
      if (form.value.isDefault) {
        addresses.value.forEach((a, i) => { if (i !== idx) a.isDefault = false })
      }
    }
  } else {
    const newAddr = { ...form.value, id: Date.now() }
    if (newAddr.isDefault) {
      addresses.value.forEach(a => { a.isDefault = false })
    }
    addresses.value.push(newAddr)
  }

  saveAddresses()
  showForm.value = false
  uni.setNavigationBarTitle({ title: isSelectMode.value ? '选择收货地址' : '收货地址' })
  uni.showToast({ title: '保存成功', icon: 'success' })
}

function deleteAddr(id) {
  if (addresses.value.length <= 1) {
    uni.showToast({ title: '至少保留一个地址', icon: 'none' })
    return
  }
  addresses.value = addresses.value.filter(a => a.id !== id)
  saveAddresses()
  uni.showToast({ title: '已删除', icon: 'success' })
}

function setDefault(id) {
  addresses.value.forEach(a => { a.isDefault = a.id === id })
  saveAddresses()
  uni.showToast({ title: '已设为默认', icon: 'success' })
}
</script>

<style>
.page {
  background: var(--bg-page);
  min-height: 100vh;
  padding-bottom: 140rpx;
}

/* 地址列表 */
.address-list {
  padding-top: 16rpx;
}
.address-card {
  background: #fff;
  margin-bottom: 16rpx;
  padding: 28rpx 32rpx;
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
}
.address-pin {
  font-size: 36rpx;
  margin-top: 4rpx;
  flex-shrink: 0;
}
.address-content {
  flex: 1;
  min-width: 0;
}
.address-name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}
.address-name {
  font-weight: 500;
  font-size: 28rpx;
}
.address-phone {
  font-size: 28rpx;
  color: var(--text-secondary);
}
.default-tag {
  background: #FEF2F2;
  padding: 2rpx 12rpx;
  border-radius: 6rpx;
}
.default-tag-text {
  font-size: 20rpx;
  color: var(--primary);
}
.address-full {
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-bottom: 16rpx;
}
.address-actions {
  display: flex;
  gap: 32rpx;
}
.action-link {
  font-size: 26rpx;
  color: var(--text-secondary);
}
.action-link.primary {
  color: var(--primary);
}

.radio {
  width: 36rpx;
  height: 36rpx;
  border: 4rpx solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 8rpx;
}
.radio.active {
  border-color: var(--primary);
}
.radio-dot {
  width: 20rpx;
  height: 20rpx;
  background: var(--primary);
  border-radius: 50%;
}

/* 底部新增按钮 */
.add-btn-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: var(--bg-page);
}
.add-btn {
  background: var(--primary);
  border-radius: 50rpx;
  padding: 24rpx;
  text-align: center;
}
.add-btn-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
}

/* 表单 */
.form {
  background: #fff;
  margin-top: 16rpx;
  padding: 32rpx;
}
.field {
  margin-bottom: 28rpx;
}
.field-label {
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-bottom: 12rpx;
}
.field-input {
  width: 100%;
  padding: 20rpx;
  border: 2rpx solid var(--border);
  border-radius: 12rpx;
  font-size: 28rpx;
}
.field-textarea {
  width: 100%;
  padding: 20rpx;
  border: 2rpx solid var(--border);
  border-radius: 12rpx;
  font-size: 28rpx;
  height: 160rpx;
}
.region-row {
  display: flex;
  gap: 16rpx;
}
.region-picker {
  flex: 1;
  padding: 20rpx;
  border: 2rpx solid var(--border);
  border-radius: 12rpx;
  font-size: 26rpx;
  text-align: center;
}
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
}
.switch-label {
  font-size: 28rpx;
}
.save-btn {
  margin-top: 40rpx;
  background: var(--primary);
  border-radius: 50rpx;
  padding: 24rpx;
  text-align: center;
}
.save-btn-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
}
</style>
