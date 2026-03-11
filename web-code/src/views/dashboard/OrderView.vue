<template>
  <div>
    <div class="page-header">
      <span class="page-title">订单管理</span>
    </div>

    <el-card shadow="never">
      <div class="search-bar">
        <el-input v-model="searchOrderNo" placeholder="搜索订单编号" clearable style="width: 220px;" :prefix-icon="Search" @keyup.enter="handleSearch" />
        <el-select v-model="searchStatus" placeholder="订单状态" clearable style="width: 140px;" @change="handleSearch">
          <el-option label="待支付"    :value="0" />
          <el-option label="待发货"    :value="1" />
          <el-option label="待收货"    :value="2" />
          <el-option label="已完成"    :value="3" />
          <el-option label="退款/售后" :value="4" />
        </el-select>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="orderNo"      label="订单编号" min-width="190" />
        <el-table-column prop="contactName"  label="联系人"   width="90" />
        <el-table-column prop="contactPhone" label="联系电话" width="130" />
        <el-table-column label="金额" width="160">
          <template #default="{ row }">
            <div style="font-size:12px;color:#909399;">原价：¥{{ row.totalAmount }}</div>
            <div style="color:#e6a23c;font-weight:600;">实付：¥{{ row.payAmount }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.type" size="small">{{ statusMap[row.status]?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address"    label="收货地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          layout="total, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="page"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="订单详情" width="560px" draggable>
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="订单编号">{{ detailRow?.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ detailRow?.contactName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detailRow?.contactPhone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址">{{ detailRow?.address }}</el-descriptions-item>
        <el-descriptions-item label="订单备注">
          <span v-if="detailRow?.remark" style="color:#606266;">{{ detailRow.remark }}</span>
          <span v-else style="color:#c0c4cc;">无</span>
        </el-descriptions-item>
        <el-descriptions-item label="商品总价">¥{{ detailRow?.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="优惠金额">¥{{ detailRow?.discountAmount }}</el-descriptions-item>
        <el-descriptions-item label="实付金额">
          <span style="color:#e6a23c;font-weight:600;">¥{{ detailRow?.payAmount }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag v-if="detailRow" :type="statusMap[detailRow.status]?.type" size="small">
            {{ statusMap[detailRow.status]?.label }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailRow?.createTime }}</el-descriptions-item>
      </el-descriptions>

      <!-- 订单商品列表 -->
      <template v-if="detailRow?.orderItems?.length">
        <div style="font-weight:600;color:#1a2744;margin:16px 0 8px;">订单商品</div>
        <el-table :data="detailRow.orderItems" size="small" border>
          <el-table-column prop="name"  label="商品名称" min-width="160" show-overflow-tooltip />
          <el-table-column prop="spec"  label="规格"     width="100" show-overflow-tooltip />
          <el-table-column prop="price" label="单价"     width="90">
            <template #default="{ row }">¥{{ row.price }}</template>
          </el-table-column>
          <el-table-column prop="qty"   label="数量"     width="70" />
          <el-table-column label="小计" width="90">
            <template #default="{ row }">
              <span style="color:#e6a23c;font-weight:600;">¥{{ (row.price * row.qty).toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 更新状态 -->
      <div v-if="detailRow" style="margin-top:16px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:13px;color:#606266;">更新状态：</span>
        <el-select v-model="nextStatus" placeholder="选择目标状态" style="width:140px;" size="small">
          <el-option label="待支付"    :value="0" />
          <el-option label="待发货"    :value="1" />
          <el-option label="待收货"    :value="2" />
          <el-option label="已完成"    :value="3" />
          <el-option label="退款/售后" :value="4" />
        </el-select>
        <el-button type="primary" size="small" :loading="statusUpdating" @click="handleUpdateStatus">确认更新</el-button>
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getOrderList, getOrderDetail, updateOrderStatus } from '@/api/order'

const searchOrderNo = ref('')
const searchStatus  = ref(null)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])

const statusMap = {
  0: { label: '待支付',    type: 'info' },
  1: { label: '待发货',    type: 'warning' },
  2: { label: '待收货',    type: 'primary' },
  3: { label: '已完成',    type: 'success' },
  4: { label: '退款/售后', type: 'danger' },
}

const fetchData = async () => {
  loading.value = true
  try {
    const params = { page: page.value, pageSize: pageSize.value }
    if (searchOrderNo.value) params.orderNo = searchOrderNo.value
    if (searchStatus.value !== null && searchStatus.value !== '') params.status = searchStatus.value
    const res = await getOrderList(params)
    const data = res?.data
    tableData.value = data?.list ?? []
    total.value = data?.total ?? 0
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const handleSearch = () => {
  page.value = 1
  fetchData()
}

const handleReset = () => {
  searchOrderNo.value = ''
  searchStatus.value = null
  handleSearch()
}

const handlePageChange = (p) => {
  page.value = p
  fetchData()
}

const detailVisible = ref(false)
const detailRow = ref(null)
const nextStatus = ref(null)
const statusUpdating = ref(false)

const handleDetail = async (row) => {
  detailRow.value = row
  nextStatus.value = row.status
  detailVisible.value = true
  try {
    const res = await getOrderDetail(row.id)
    if (res?.data) {
      detailRow.value = res.data
      nextStatus.value = res.data.status
    }
  } catch {
    // keep row data as fallback
  }
}

const handleUpdateStatus = async () => {
  if (nextStatus.value === null || nextStatus.value === undefined) {
    ElMessage.warning('请选择目标状态')
    return
  }
  statusUpdating.value = true
  try {
    await updateOrderStatus(detailRow.value.id, nextStatus.value)
    detailRow.value = { ...detailRow.value, status: nextStatus.value }
    ElMessage.success('状态更新成功')
    fetchData()
  } catch {
    ElMessage.error('状态更新失败')
  } finally {
    statusUpdating.value = false
  }
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title  { font-size: 18px; font-weight: 600; color: #1a2744; }
.search-bar  { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pagination  { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
