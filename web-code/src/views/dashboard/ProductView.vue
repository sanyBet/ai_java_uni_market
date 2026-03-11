<template>
  <div>
    <div class="page-header">
      <span class="page-title">商品管理</span>
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增商品</el-button>
    </div>

    <el-card shadow="never">
      <div class="search-bar">
        <el-input v-model="searchText" placeholder="搜索商品名称" clearable style="width: 220px;" :prefix-icon="Search" @keyup.enter="handleSearch" />
        <el-select v-model="searchStatus" placeholder="上架状态" clearable style="width: 130px;" @change="handleSearch">
          <el-option label="上架" :value="1" />
          <el-option label="下架" :value="0" />
        </el-select>
        <el-select v-model="searchCategory" placeholder="商品分类" clearable style="width: 130px;" @change="handleSearch">
          <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="封面" width="80">
          <template #default="{ row }">
            <el-image :src="row.cover" style="width:50px;height:50px;border-radius:6px;" fit="cover">
              <template #error>
                <div style="width:50px;height:50px;background:#f5f7fa;border-radius:6px;display:flex;align-items:center;justify-content:center;">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column label="价格" width="150">
          <template #default="{ row }">
            <div>
              <span style="color:#f56c6c;font-weight:600;">¥{{ row.price }}</span>
              <span v-if="row.originPrice" style="color:#c0c4cc;font-size:12px;text-decoration:line-through;margin-left:4px;">¥{{ row.originPrice }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stock"       label="库存"   width="80" />
        <el-table-column prop="sales"       label="销量"   width="80" />
        <el-table-column prop="views"       label="浏览量" width="80" />
        <el-table-column prop="status"      label="状态"   width="90">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? '上架' : '下架' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isRecommend" label="推荐"   width="80">
          <template #default="{ row }">
            <el-tag :type="row.isRecommend ? 'warning' : 'info'" size="small">{{ row.isRecommend ? '推荐' : '-' }}</el-tag>
          </template>
        </el-table-column>
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
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增商品' : '编辑商品'" width="620px" draggable>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">

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
          <div class="upload-tip">建议尺寸 750×750，支持 JPG/PNG，不超过 2MB</div>
        </el-form-item>

        <el-form-item label="商品名称" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>

        <el-form-item label="商品分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类（可留空）" clearable style="width:100%">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="售价" prop="price" required>
          <el-input v-model="form.price" placeholder="请输入售价">
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>

        <el-form-item label="原价" prop="originPrice">
          <el-input v-model="form.originPrice" placeholder="留空表示无原价">
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>

        <el-form-item label="库存" prop="stock" required>
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述（可留空）"
          />
        </el-form-item>

        <el-form-item label="详情图" prop="detailImgs">
          <el-upload
            list-type="picture-card"
            :file-list="detailFileList"
            :http-request="handleDetailImgUpload"
            :before-upload="beforeUpload"
            :on-remove="handleDetailImgRemove"
            accept="image/*"
            multiple
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">可上传多张详情图，支持 JPG/PNG，每张不超过 2MB（可留空）</div>
        </el-form-item>

        <el-form-item label="规格信息" prop="specs">
          <div style="width:100%;">
            <div
              v-for="(spec, i) in specList"
              :key="i"
              style="display:flex;gap:8px;margin-bottom:8px;align-items:center;"
            >
              <el-input v-model="spec.key"   placeholder="规格名，如：颜色" style="width:140px;" />
              <el-input v-model="spec.value" placeholder="规格值，如：黑色,白色" style="flex:1;" />
              <el-button type="danger" link :icon="Delete" @click="specList.splice(i, 1)" />
            </div>
            <el-button size="small" :icon="Plus" @click="specList.push({ key: '', value: '' })">添加规格</el-button>
            <div class="upload-tip">规格值可用逗号分隔多个选项，如：黑色,白色,银色（可留空）</div>
          </div>
        </el-form-item>

        <el-form-item label="上架状态" prop="status" required>
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="上架" inactive-text="下架" />
        </el-form-item>

        <el-form-item label="推荐" prop="isRecommend" required>
          <el-switch v-model="form.isRecommend" :active-value="1" :inactive-value="0" />
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
import { Plus, Search, RefreshRight, Picture, Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getProductList, getProductDetail, createProduct, updateProduct, deleteProduct } from '@/api/product'
import { getCategoryList } from '@/api/category'
import { uploadFile } from '@/api/upload'

const searchText     = ref('')
const searchStatus   = ref(null)
const searchCategory = ref(null)
const categories     = ref([])
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
    if (searchStatus.value !== null && searchStatus.value !== '') params.status = searchStatus.value
    if (searchCategory.value) params.categoryId = searchCategory.value
    const res = await getProductList(params)
    const data = res?.data
    tableData.value = data?.list ?? []
    total.value = data?.total ?? 0
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  fetchData()
  try {
    const res = await getCategoryList()
    categories.value = res?.data ?? []
  } catch {
    // ignore, search filter degrades gracefully
  }
})

const handleSearch = () => {
  page.value = 1
  fetchData()
}

const handleReset = () => {
  searchText.value = ''
  searchStatus.value = null
  searchCategory.value = null
  handleSearch()
}

const handlePageChange = (p) => {
  page.value = p
  fetchData()
}

const dialogVisible  = ref(false)
const dialogMode     = ref('add')
const submitting     = ref(false)
const form           = ref({})
const formRef        = ref(null)
const detailFileList = ref([])
const specList       = ref([])

const specsToList = (specs) => specs && typeof specs === 'object'
  ? Object.entries(specs).map(([key, value]) => ({ key, value: Array.isArray(value) ? value.join(',') : String(value) }))
  : []
const listToSpecs = (list) => {
  if (!list.length) return null
  const obj = {}
  list.forEach(({ key, value }) => {
    if (key) {
      const arr = String(value).split(',').map(v => v.trim()).filter(Boolean)
      if (arr.length) {
        obj[key] = obj[key] ? [...obj[key], ...arr] : arr
      }
    }
  })
  return Object.keys(obj).length ? obj : null
}

const rules = {
  cover:  [{ required: true, message: '请上传封面图', trigger: 'change' }],
  name:   [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  price:  [{ required: true, message: '请输入售价', trigger: 'blur' }],
  stock:  [{ required: true, message: '请输入库存', trigger: 'blur' }],
}

const defaultForm = () => ({
  cover: '', name: '', categoryId: null, price: '', originPrice: '',
  stock: 0, description: '', detailImgs: [], status: 1, isRecommend: 0,
})

const handleAdd = () => {
  form.value = defaultForm()
  detailFileList.value = []
  specList.value = []
  dialogMode.value = 'add'
  dialogVisible.value = true
}

const handleEdit = async (row) => {
  let detail = row
  try {
    const res = await getProductDetail(row.id)
    if (res?.data) detail = res.data
  } catch {
    // fallback to row data
  }
  form.value = { ...detail }
  detailFileList.value = (detail.detailImgs || []).map(url => ({ url, name: url }))
  specList.value = specsToList(detail.specs)
  dialogMode.value = 'edit'
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  form.value.detailImgs = detailFileList.value.map(f => f.url).filter(Boolean)
  form.value.specs = listToSpecs(specList.value)
  submitting.value = true
  try {
    if (dialogMode.value === 'add') {
      await createProduct(form.value)
      ElMessage.success('新增成功')
    } else {
      await updateProduct(form.value.id, form.value)
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
  ElMessageBox.confirm(`确认删除商品「${row.name}」？此操作不可恢复。`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async () => {
    try {
      await deleteProduct(row.id)
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

const handleDetailImgUpload = async ({ file, onSuccess, onError }) => {
  try {
    const res = await uploadFile(file)
    detailFileList.value.push({ url: res.data.url, name: file.name })
    onSuccess(res)
  } catch {
    ElMessage.error('上传失败')
    onError(new Error('upload failed'))
  }
}

const handleDetailImgRemove = (file) => {
  detailFileList.value = detailFileList.value.filter(f => f.url !== file.url)
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title  { font-size: 18px; font-weight: 600; color: #1a2744; }
.search-bar  { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pagination  { display: flex; justify-content: flex-end; margin-top: 16px; }
.upload-tip  { font-size: 12px; color: #909399; margin-top: 6px; }

.cover-uploader {
  width: 100px;
  height: 100px;
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
.cover-preview { width: 100px; height: 100px; }
.cover-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #8c939d;
  font-size: 13px;
}
</style>
