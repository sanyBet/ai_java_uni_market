<template>
  <div>
    <div class="page-header">
      <span class="page-title">用户管理</span>
    </div>

    <el-card shadow="never">
      <div class="search-bar">
        <el-input v-model="searchText" placeholder="搜索账号/昵称" clearable style="width: 220px;" :prefix-icon="Search" @keyup.enter="handleSearch" />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="头像" width="70">
          <template #default="{ row }">
            <el-avatar :size="36" :src="row.avatar" icon="UserFilled" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname"   label="昵称"        min-width="120" />
        <el-table-column prop="account"    label="账号"        min-width="130" />
        <el-table-column prop="openid"     label="微信 OpenID" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="注册时间"    min-width="160" />
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
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getUserList, deleteUser } from '@/api/user'

const searchText = ref('')
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const params = { page: page.value, pageSize: pageSize.value }
    if (searchText.value) params.keyword = searchText.value
    const res = await getUserList(params)
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
  searchText.value = ''
  handleSearch()
}

const handlePageChange = (p) => {
  page.value = p
  fetchData()
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除用户「${row.nickname}」？此操作不可恢复。`, '警告', {
    type: 'warning',
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
  }).then(async () => {
    try {
      await deleteUser(row.id)
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
