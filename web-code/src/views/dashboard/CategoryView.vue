<template>
  <div>
    <div class="page-header">
      <span class="page-title">商品分类</span>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增分类</el-button>
    </div>

    <el-card shadow="never">
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="分类图片" width="90">
          <template #default="{ row }">
            <el-image :src="row.image" style="width:44px;height:44px;border-radius:6px;" fit="cover">
              <template #error>
                <div style="width:44px;height:44px;background:#f5f7fa;border-radius:6px;display:flex;align-items:center;justify-content:center;">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name"       label="分类名称" min-width="140" />
        <el-table-column prop="sort"       label="排序"     width="80" />
        <el-table-column prop="showOnHome" label="首页展示" width="100">
          <template #default="{ row }">
            <el-tag :type="row.showOnHome ? 'success' : 'info'" size="small">
              {{ row.showOnHome ? '是' : '否' }}
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
    </el-card>

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增分类' : '编辑分类'" width="460px" draggable>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="分类图片" prop="image">
          <el-upload
            :show-file-list="false"
            :http-request="handleImageUpload"
            :before-upload="beforeUpload"
            accept="image/*"
          >
            <div class="img-uploader">
              <el-image v-if="form.image" :src="form.image" class="img-preview" fit="cover" />
              <div v-else class="img-placeholder">
                <el-icon :size="22"><Plus /></el-icon>
                <span>上传图片</span>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="分类名称" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort" required>
          <el-input-number v-model="form.sort" :min="1" :max="999" />
        </el-form-item>
        <el-form-item label="首页展示" prop="showOnHome" required>
          <el-switch v-model="form.showOnHome" />
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
import { getCategoryList, createCategory, updateCategory, deleteCategory } from '@/api/category'
import { uploadFile } from '@/api/upload'

const formRef = ref(null)
const loading = ref(false)
const tableData = ref([])

const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getCategoryList()
    tableData.value = res?.data ?? []
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const dialogVisible = ref(false)
const dialogMode    = ref('add')
const submitting    = ref(false)
const form          = ref({})

const defaultForm = () => ({ image: '', name: '', sort: 1, showOnHome: false })

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
      await createCategory(form.value)
      ElMessage.success('新增成功')
    } else {
      await updateCategory(form.value.id, form.value)
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
  ElMessageBox.confirm(`确认删除分类「${row.name}」？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async () => {
    try {
      await deleteCategory(row.id)
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

const handleImageUpload = async ({ file }) => {
  try {
    const res = await uploadFile(file)
    form.value.image = res.data.url
    ElMessage.success('上传成功')
  } catch {
    ElMessage.error('上传失败')
  }
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title  { font-size: 18px; font-weight: 600; color: #1a2744; }

.img-uploader {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
}
.img-uploader:hover { border-color: #409eff; }
.img-preview { width: 80px; height: 80px; }
.img-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #8c939d;
  font-size: 12px;
}
</style>
