<template>
  <div>
    <div class="page-header">
      <span class="page-title">轮播图管理</span>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增轮播图</el-button>
    </div>

    <el-card shadow="never">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="封面图" width="140">
          <template #default="{ row }">
            <el-image :src="row.cover" style="width:110px;height:55px;border-radius:4px;" fit="cover">
              <template #error>
                <div style="width:110px;height:55px;background:#f5f7fa;border-radius:4px;display:flex;align-items:center;justify-content:center;">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title"     label="标题"       min-width="200" />
        <el-table-column label="关联商品" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ getProductName(row.productId) }}</span>
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
    </el-card>

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增轮播图' : '编辑轮播图'" width="480px" draggable>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="封面图" prop="cover" required>
          <el-upload
            :show-file-list="false"
            :http-request="handleCoverUpload"
            :before-upload="beforeUpload"
            accept="image/*"
          >
            <div class="cover-uploader">
              <el-image v-if="form.cover" :src="form.cover" class="cover-preview" fit="cover" />
              <div v-else class="cover-placeholder">
                <el-icon :size="22"><Plus /></el-icon>
                <span>上传封面图</span>
              </div>
            </div>
          </el-upload>
          <div class="upload-tip">建议尺寸 750×375，支持 JPG/PNG，不超过 2MB</div>
        </el-form-item>
        <el-form-item label="标题" prop="title" required>
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="关联商品" prop="productId">
          <el-select v-model="form.productId" placeholder="请选择关联商品（可留空）" clearable style="width:100%" filterable>
            <el-option v-for="p in products" :key="p.id" :label="`[${p.id}] ${p.name}`" :value="p.id" />
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
import { ref, onMounted } from 'vue'
import { Plus, Picture } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getBannerList, createBanner, updateBanner, deleteBanner } from '@/api/banner'
import { getProductList } from '@/api/product'
import { uploadFile } from '@/api/upload'

const loading = ref(false)
const tableData = ref([])
const products = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getBannerList()
    tableData.value = res?.data ?? []
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  fetchData()
  try {
    const res = await getProductList({ page: 1, pageSize: 200 })
    products.value = res?.data?.list ?? []
  } catch {
    // ignore, selector degrades to empty
  }
})

const getProductName = (id) => {
  if (!id) return '-'
  const p = products.value.find(p => p.id === id)
  return p ? p.name : `ID: ${id}`
}

const formRef = ref(null)
const rules = {
  cover: [{ required: true, message: '请上传封面图', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
}

const dialogVisible = ref(false)
const dialogMode    = ref('add')
const submitting    = ref(false)
const form          = ref({})

const defaultForm = () => ({ cover: '', title: '', productId: null })

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
      await createBanner(form.value)
      ElMessage.success('新增成功')
    } else {
      await updateBanner(form.value.id, form.value)
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
  ElMessageBox.confirm(`确认删除轮播图「${row.title}」？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async () => {
    try {
      await deleteBanner(row.id)
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

const handleCoverUpload = async ({ file }) => {
  try {
    const res = await uploadFile(file)
    form.value.cover = res.data.url
    ElMessage.success('上传成功')
  } catch {
    ElMessage.error('上传失败')
  }
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title  { font-size: 18px; font-weight: 600; color: #1a2744; }
.upload-tip  { font-size: 12px; color: #909399; margin-top: 6px; }

.cover-uploader {
  width: 220px;
  height: 110px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
}
.cover-uploader:hover { border-color: #409eff; }
.cover-preview { width: 220px; height: 110px; }
.cover-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #8c939d;
  font-size: 13px;
}
</style>
