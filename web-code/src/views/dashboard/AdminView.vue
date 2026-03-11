<template>
  <div>
    <div class="page-header">
      <span class="page-title">管理员管理</span>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增管理员</el-button>
    </div>

    <el-card shadow="never">
      <div class="search-bar">
        <el-input v-model="searchText" placeholder="搜索账号/昵称" clearable style="width: 220px;" :prefix-icon="Search" @keyup.enter="handleSearch" />
        <el-select v-model="searchRole" placeholder="角色筛选" clearable style="width: 150px;" @change="handleSearch">
          <el-option label="超级管理员" value="super_admin" />
          <el-option label="管理员"     value="admin" />
        </el-select>
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
        <el-table-column prop="account"    label="账号" min-width="120" />
        <el-table-column prop="nickname"   label="昵称" min-width="120" />
        <el-table-column prop="role"       label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'super_admin' ? 'danger' : 'primary'" size="small">
              {{ row.role === 'super_admin' ? '超级管理员' : '管理员' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger"  link @click="handleDelete(row)">删除</el-button>
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

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增管理员' : '编辑管理员'" width="460px" draggable>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="头像" prop="avatar">
          <el-upload
            :show-file-list="false"
            :http-request="handleAvatarUpload"
            :before-upload="beforeUpload"
            accept="image/*"
          >
            <div class="avatar-uploader">
              <el-avatar v-if="form.avatar" :size="80" :src="form.avatar" style="cursor:pointer" />
              <div v-else class="avatar-placeholder">
                <el-icon :size="22"><Plus /></el-icon>
                <span>上传头像</span>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="账号" prop="account" required>
          <el-input v-model="form.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item v-if="dialogMode === 'add'" label="密码" prop="password" required>
          <el-input v-model="form.password" type="password" placeholder="请输入初始密码" show-password />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称（可留空）" />
        </el-form-item>
        <el-form-item label="角色" prop="role" required>
          <el-select v-model="form.role" style="width:100%">
            <el-option label="超级管理员" value="super_admin" />
            <el-option label="管理员"     value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus, Search, RefreshRight } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getAdminList, createAdmin, updateAdmin, deleteAdmin } from '@/api/admin'
import { uploadFile } from '@/api/upload'

const searchText = ref('')
const searchRole = ref('')
const formRef = ref(null)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])

const rules = computed(() => ({
  account:  [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: dialogMode.value === 'add'
    ? [{ required: true, message: '请输入初始密码', trigger: 'blur' }]
    : [],
  role:     [{ required: true, message: '请选择角色', trigger: 'change' }],
}))

const fetchData = async () => {
  loading.value = true
  try {
    const params = { page: page.value, pageSize: pageSize.value }
    if (searchText.value) params.keyword = searchText.value
    if (searchRole.value) params.role = searchRole.value
    const res = await getAdminList(params)
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
  searchRole.value = ''
  handleSearch()
}

const handlePageChange = (p) => {
  page.value = p
  fetchData()
}

const dialogVisible = ref(false)
const dialogMode    = ref('add')
const submitting    = ref(false)
const form          = ref({})

const defaultForm = () => ({ avatar: '', account: '', password: '', nickname: '', role: 'admin' })

const handleAdd = () => {
  form.value = defaultForm()
  dialogMode.value = 'add'
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.value = { ...row }
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  submitting.value = true
  try {
    if (dialogMode.value === 'add') {
      await createAdmin(form.value)
      ElMessage.success('新增成功')
    } else {
      await updateAdmin(form.value.id, form.value)
      ElMessage.success('修改成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch {
    ElMessage.error(dialogMode.value === 'add' ? '新增失败' : '修改失败')
  } finally {
    submitting.value = false
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除管理员「${row.nickname || row.account}」？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async () => {
    try {
      await deleteAdmin(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const beforeUpload = (file) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (file.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  return true
}

const handleAvatarUpload = async ({ file }) => {
  try {
    const res = await uploadFile(file)
    form.value.avatar = res.data.url
    ElMessage.success('上传成功')
  } catch {
    ElMessage.error('上传失败')
  }
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title  { font-size: 18px; font-weight: 600; color: #1a2744; }
.search-bar  { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pagination  { display: flex; justify-content: flex-end; margin-top: 16px; }

.avatar-uploader {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
}
.avatar-uploader:hover { border-color: #409eff; }
.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #8c939d;
  font-size: 12px;
}
</style>
