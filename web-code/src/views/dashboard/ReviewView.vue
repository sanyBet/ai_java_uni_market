<template>
  <div>
    <div class="page-header">
      <span class="page-title">评价管理</span>
    </div>

    <el-card shadow="never">
      <div class="search-bar">
        <el-select v-model="searchRating" placeholder="评分筛选" clearable style="width: 140px;" @change="handleSearch">
          <el-option v-for="n in 5" :key="n" :label="`${n} 星`" :value="n" />
        </el-select>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id"        label="ID"     width="70" />
        <el-table-column prop="userId"    label="用户ID" width="90" />
        <el-table-column prop="productId" label="商品ID" width="90" />
        <el-table-column prop="orderId"   label="订单ID" width="90" />
        <el-table-column prop="rating"    label="评分"   width="140">
          <template #default="{ row }">
            <el-rate :model-value="row.rating" disabled size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容" min-width="220" show-overflow-tooltip />
        <el-table-column label="评价图片" width="160">
          <template #default="{ row }">
            <span v-if="!row.images || row.images.length === 0" style="color:#c0c4cc;">无</span>
            <div v-else style="display:flex;gap:4px;flex-wrap:wrap;">
              <el-image
                v-for="(img, i) in row.images"
                :key="i"
                :src="img"
                :preview-src-list="row.images"
                :initial-index="i"
                style="width:36px;height:36px;border-radius:4px;cursor:pointer;"
                fit="cover"
                preview-teleported
              >
                <template #error>
                  <div style="width:36px;height:36px;background:#f5f7fa;border-radius:4px;display:flex;align-items:center;justify-content:center;">
                    <el-icon style="font-size:14px;color:#c0c4cc;"><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="评价时间" min-width="160" />
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, RefreshRight, Picture } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getReviewList, deleteReview } from '@/api/review'

const searchRating = ref(null)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const params = { page: page.value, pageSize: pageSize.value }
    if (searchRating.value) params.rating = searchRating.value
    const res = await getReviewList(params)
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
  searchRating.value = null
  handleSearch()
}

const handlePageChange = (p) => {
  page.value = p
  fetchData()
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该条评价？此操作不可恢复。', '警告', {
    type: 'warning',
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
  }).then(async () => {
    try {
      await deleteReview(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title  { font-size: 18px; font-weight: 600; color: #1a2744; }
.search-bar  { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pagination  { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
