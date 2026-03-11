# 商城后台管理系统前端 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `web-code/` 目录下从零搭建商城后台管理系统前端，实现登录页 + 8 个管理页面的静态原型。

**Architecture:** Vite 构建工具 + Vue 3 Composition API，Vue Router 管理路由并加入登录守卫，Pinia 管理登录态，Element Plus 提供 UI 组件，API 层独立存放于 `src/api/`，各页面使用内联 mock 数据。

**Tech Stack:** Vue 3, Vue Router 4, Pinia 2, Element Plus 2, Axios, Vite 5

**Design Spec:** `docs/superpowers/specs/2026-03-10-admin-frontend-design.md`

---

## Chunk 1: 工程初始化与基础配置

### Task 1: 初始化 Vite + Vue 3 项目

**Files:**
- Create: `web-code/` (项目根目录，使用 npm create)

- [ ] **Step 1: 进入目录，初始化项目**

```bash
cd /Users/hyang/code/learn/projects/shopMal
npm create vite@latest web-code -- --template vue
cd web-code
npm install
```

Expected: 生成标准 Vite Vue 项目骨架，`npm run dev` 可启动。

- [ ] **Step 2: 安装所有依赖**

```bash
cd /Users/hyang/code/learn/projects/shopMal/web-code
npm install vue-router@4 pinia element-plus @element-plus/icons-vue axios
npm install -D unplugin-vue-components unplugin-auto-import
```

- [ ] **Step 3: 清理默认文件**

删除以下文件（保留空目录结构）：
- `src/components/HelloWorld.vue`
- `src/assets/vue.svg`
- `public/vite.svg`
- 清空 `src/style.css` 内容（保留文件）
- 清空 `src/App.vue`，替换为最简骨架

`src/App.vue` 替换内容：
```vue
<template>
  <router-view />
</template>
```

- [ ] **Step 4: 配置 vite.config.js**

```js
// web-code/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3100,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

- [ ] **Step 5: 创建 .env 文件**

```bash
# web-code/.env
VITE_API_BASE_URL=/api
```

---

### Task 2: 创建目录结构

**Files:**
- Create: `src/api/`, `src/stores/`, `src/views/login/`, `src/views/dashboard/`, `src/components/layout/`, `src/router/`

- [ ] **Step 1: 创建所有目录和空占位文件**

```bash
cd /Users/hyang/code/learn/projects/shopMal/web-code
mkdir -p src/api src/stores src/router src/components/layout
mkdir -p src/views/login src/views/dashboard
touch src/api/index.js src/api/admin.js src/api/user.js
touch src/api/category.js src/api/product.js src/api/order.js
touch src/api/banner.js src/api/review.js
touch src/stores/auth.js src/stores/app.js
touch src/router/index.js
touch src/components/layout/AppLayout.vue
touch src/components/layout/SideMenu.vue
touch src/components/layout/TopHeader.vue
touch src/views/login/LoginView.vue
touch src/views/dashboard/DashboardView.vue
touch src/views/dashboard/AdminView.vue
touch src/views/dashboard/UserView.vue
touch src/views/dashboard/CategoryView.vue
touch src/views/dashboard/ProductView.vue
touch src/views/dashboard/OrderView.vue
touch src/views/dashboard/BannerView.vue
touch src/views/dashboard/ReviewView.vue
```

---

## Chunk 2: 核心基础层

### Task 3: API 层 — axios 实例与拦截器

**Files:**
- Modify: `src/api/index.js`

- [ ] **Step 1: 编写 axios 实例**

```js
// src/api/index.js
import axios from 'axios'
import router from '@/router'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

// 请求拦截：注入 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截：处理 401
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default request
```

- [ ] **Step 2: 编写各模块 API 文件**

```js
// src/api/admin.js
import request from './index'
export const getAdminList = (params) => request.get('/admin/list', { params })
export const createAdmin = (data) => request.post('/admin', data)
export const updateAdmin = (id, data) => request.put(`/admin/${id}`, data)
export const deleteAdmin = (id) => request.delete(`/admin/${id}`)
export const resetAdminPassword = (id, data) => request.put(`/admin/${id}/password`, data)
```

```js
// src/api/user.js
import request from './index'
export const getUserList = (params) => request.get('/user/list', { params })
export const deleteUser = (id) => request.delete(`/user/${id}`)
```

```js
// src/api/category.js
import request from './index'
export const getCategoryList = (params) => request.get('/category/list', { params })
export const createCategory = (data) => request.post('/category', data)
export const updateCategory = (id, data) => request.put(`/category/${id}`, data)
export const deleteCategory = (id) => request.delete(`/category/${id}`)
```

```js
// src/api/product.js
import request from './index'
export const getProductList = (params) => request.get('/product/list', { params })
export const createProduct = (data) => request.post('/product', data)
export const updateProduct = (id, data) => request.put(`/product/${id}`, data)
export const deleteProduct = (id) => request.delete(`/product/${id}`)
```

```js
// src/api/order.js
import request from './index'
export const getOrderList = (params) => request.get('/order/list', { params })
export const updateOrderStatus = (id, data) => request.put(`/order/${id}/status`, data)
```

```js
// src/api/banner.js
import request from './index'
export const getBannerList = (params) => request.get('/banner/list', { params })
export const createBanner = (data) => request.post('/banner', data)
export const updateBanner = (id, data) => request.put(`/banner/${id}`, data)
export const deleteBanner = (id) => request.delete(`/banner/${id}`)
```

```js
// src/api/review.js
import request from './index'
export const getReviewList = (params) => request.get('/review/list', { params })
export const deleteReview = (id) => request.delete(`/review/${id}`)
```

---

### Task 4: Pinia Stores

**Files:**
- Modify: `src/stores/auth.js`
- Modify: `src/stores/app.js`

- [ ] **Step 1: 编写 auth store（含测试模式）**

```js
// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const adminInfo = ref(JSON.parse(localStorage.getItem('adminInfo') || 'null'))

  const isLoggedIn = () => !!token.value

  // 测试模式：account=admin password=123456 直接通过
  const login = async (account, password) => {
    if (account === 'admin' && password === '123456') {
      const mockToken = 'mock-token-for-test'
      const mockAdmin = { account: 'admin', nickname: '超级管理员', role: 'super_admin', avatar: '' }
      token.value = mockToken
      adminInfo.value = mockAdmin
      localStorage.setItem('token', mockToken)
      localStorage.setItem('adminInfo', JSON.stringify(mockAdmin))
      return true
    }
    throw new Error('账号或密码错误')
  }

  const logout = () => {
    token.value = ''
    adminInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('adminInfo')
  }

  return { token, adminInfo, isLoggedIn, login, logout }
})
```

- [ ] **Step 2: 编写 app store**

```js
// src/stores/app.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return { sidebarCollapsed, toggleSidebar }
})
```

---

### Task 5: 路由配置

**Files:**
- Modify: `src/router/index.js`

- [ ] **Step 1: 编写路由文件（含导航守卫）**

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/dashboard/DashboardView.vue') },
      { path: 'admin', name: 'Admin', component: () => import('@/views/dashboard/AdminView.vue') },
      { path: 'user', name: 'User', component: () => import('@/views/dashboard/UserView.vue') },
      { path: 'category', name: 'Category', component: () => import('@/views/dashboard/CategoryView.vue') },
      { path: 'product', name: 'Product', component: () => import('@/views/dashboard/ProductView.vue') },
      { path: 'order', name: 'Order', component: () => import('@/views/dashboard/OrderView.vue') },
      { path: 'banner', name: 'Banner', component: () => import('@/views/dashboard/BannerView.vue') },
      { path: 'review', name: 'Review', component: () => import('@/views/dashboard/ReviewView.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 导航守卫
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth !== false && !token) {
    return '/login'
  }
  if (to.path === '/login' && token) {
    return '/dashboard'
  }
})

export default router
```

---

### Task 6: main.js 挂载

**Files:**
- Modify: `src/main.js`

- [ ] **Step 1: 配置入口文件**

```js
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')
```

- [ ] **Step 2: 编写全局样式**

```css
/* src/style.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #303133;
  background-color: #f5f7fa;
}

a {
  text-decoration: none;
  color: inherit;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #d4d7de;
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}
```

---

## Chunk 3: 布局组件

### Task 7: 侧边菜单 SideMenu.vue

**Files:**
- Modify: `src/components/layout/SideMenu.vue`

- [ ] **Step 1: 编写侧边菜单组件**

```vue
<!-- src/components/layout/SideMenu.vue -->
<template>
  <div class="side-menu" :class="{ collapsed: appStore.sidebarCollapsed }">
    <!-- Logo 区域 -->
    <div class="logo">
      <el-icon class="logo-icon"><Shop /></el-icon>
      <span v-if="!appStore.sidebarCollapsed" class="logo-text">商城管理系统</span>
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      router
      :collapse="appStore.sidebarCollapsed"
      background-color="#1a2744"
      text-color="rgba(255,255,255,0.75)"
      active-text-color="#ffffff"
      :collapse-transition="false"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.path"
        :index="item.path"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const appStore = useAppStore()

const activeMenu = computed(() => '/' + route.path.split('/')[1])

const menuItems = [
  { path: '/dashboard', title: '首页', icon: 'Odometer' },
  { path: '/admin',     title: '管理员管理', icon: 'Avatar' },
  { path: '/user',      title: '用户管理', icon: 'User' },
  { path: '/category',  title: '商品分类', icon: 'Grid' },
  { path: '/product',   title: '商品管理', icon: 'Goods' },
  { path: '/order',     title: '订单管理', icon: 'List' },
  { path: '/banner',    title: '轮播图管理', icon: 'Picture' },
  { path: '/review',    title: '评价管理', icon: 'ChatDotRound' },
]
</script>

<style scoped>
.side-menu {
  width: 220px;
  min-height: 100vh;
  background-color: #1a2744;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  flex-shrink: 0;
}

.side-menu.collapsed {
  width: 64px;
}

.logo {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  white-space: nowrap;
}

.logo-icon {
  font-size: 22px;
  color: #1a6fba;
  flex-shrink: 0;
}

.logo-text {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.el-menu {
  border-right: none;
  flex: 1;
}

.el-menu-item {
  height: 46px;
  line-height: 46px;
  margin: 2px 8px;
  border-radius: 6px;
}

.el-menu-item.is-active {
  background-color: #1a6fba !important;
}

.el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
}
</style>
```

---

### Task 8: 顶部导航栏 TopHeader.vue

**Files:**
- Modify: `src/components/layout/TopHeader.vue`

- [ ] **Step 1: 编写顶部导航栏**

```vue
<!-- src/components/layout/TopHeader.vue -->
<template>
  <div class="top-header">
    <!-- 左侧：折叠按钮 + 面包屑 -->
    <div class="header-left">
      <el-icon class="collapse-btn" @click="appStore.toggleSidebar">
        <Fold v-if="!appStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentTitle !== '首页'">{{ currentTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧：管理员信息 -->
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <div class="admin-info">
          <el-avatar :size="30" :src="authStore.adminInfo?.avatar || ''" icon="UserFilled" />
          <span class="admin-name">{{ authStore.adminInfo?.nickname || 'Admin' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

const titleMap = {
  dashboard: '首页',
  admin: '管理员管理',
  user: '用户管理',
  category: '商品分类',
  product: '商品管理',
  order: '订单管理',
  banner: '轮播图管理',
  review: '评价管理',
}

const currentTitle = computed(() => {
  const seg = route.path.split('/')[1]
  return titleMap[seg] || '首页'
})

const handleCommand = (cmd) => {
  if (cmd === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.top-header {
  height: 56px;
  background: #ffffff;
  border-bottom: 1px solid #e8edf3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  transition: color 0.2s;
}

.collapse-btn:hover {
  color: #1a6fba;
}

.header-right {
  display: flex;
  align-items: center;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #303133;
}

.admin-name {
  font-size: 14px;
}
</style>
```

---

### Task 9: 主布局框架 AppLayout.vue

**Files:**
- Modify: `src/components/layout/AppLayout.vue`

- [ ] **Step 1: 编写主布局**

```vue
<!-- src/components/layout/AppLayout.vue -->
<template>
  <div class="app-layout">
    <SideMenu />
    <div class="main-wrapper">
      <TopHeader />
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import SideMenu from './SideMenu.vue'
import TopHeader from './TopHeader.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.page-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
```

---

## Chunk 4: 登录页

### Task 10: 登录页 LoginView.vue

**Files:**
- Modify: `src/views/login/LoginView.vue`

- [ ] **Step 1: 编写登录页**

```vue
<!-- src/views/login/LoginView.vue -->
<template>
  <div class="login-page">
    <div class="login-card">
      <!-- 头部 -->
      <div class="login-header">
        <div class="login-logo">
          <el-icon><Shop /></el-icon>
        </div>
        <h1 class="login-title">商城管理系统</h1>
        <p class="login-subtitle">Admin Management System</p>
      </div>

      <!-- 测试提示 -->
      <el-alert
        title="测试模式：账号 admin，密码 123456"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 24px; border-radius: 6px;"
      />

      <!-- 表单 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="account">
          <el-input
            v-model="form.account"
            placeholder="请输入账号"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="width: 100%; height: 44px; font-size: 15px; border-radius: 6px;"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref()
const loading = ref(false)

const form = ref({
  account: 'admin',
  password: '123456',
})

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await authStore.login(form.value.account, form.value.password)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (e) {
    ElMessage.error(e.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2744 0%, #1a6fba 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 420px;
  background: #ffffff;
  border-radius: 12px;
  padding: 48px 40px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 56px;
  height: 56px;
  background: #1a6fba;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.login-logo .el-icon {
  font-size: 28px;
  color: #ffffff;
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a2744;
  margin-bottom: 6px;
}

.login-subtitle {
  font-size: 13px;
  color: #909399;
  letter-spacing: 1px;
}
</style>
```

---

## Chunk 5: 首页与管理页面

### Task 11: 首页 DashboardView.vue

**Files:**
- Modify: `src/views/dashboard/DashboardView.vue`

- [ ] **Step 1: 编写首页（统计卡片 + 近期订单表格）**

```vue
<!-- src/views/dashboard/DashboardView.vue -->
<template>
  <div>
    <div class="page-title">数据概览</div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" style="margin-bottom: 24px;">
      <el-col :span="6" v-for="card in statCards" :key="card.label">
        <div class="stat-card">
          <div class="stat-icon" :style="{ background: card.color + '1a', color: card.color }">
            <el-icon :size="24"><component :is="card.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 近期订单 -->
    <el-card shadow="never">
      <template #header>
        <span class="card-header-title">近期订单</span>
      </template>
      <el-table :data="recentOrders" stripe>
        <el-table-column prop="orderNo" label="订单编号" min-width="180" />
        <el-table-column prop="contactName" label="联系人" width="100" />
        <el-table-column prop="payAmount" label="实付金额" width="110">
          <template #default="{ row }">
            <span style="color: #e6a23c; font-weight: 600;">¥{{ row.payAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="orderStatusMap[row.status]?.type" size="small">
              {{ orderStatusMap[row.status]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
const statCards = [
  { label: '注册用户', value: '1,286', icon: 'User', color: '#1a6fba' },
  { label: '商品总数', value: '342', icon: 'Goods', color: '#67c23a' },
  { label: '订单总数', value: '5,021', icon: 'List', color: '#e6a23c' },
  { label: '今日销售额', value: '¥12,480', icon: 'TrendCharts', color: '#f56c6c' },
]

const orderStatusMap = {
  0: { label: '待支付', type: 'info' },
  1: { label: '待发货', type: 'warning' },
  2: { label: '待收货', type: 'primary' },
  3: { label: '已完成', type: 'success' },
  4: { label: '退款/售后', type: 'danger' },
}

const recentOrders = [
  { orderNo: 'ORD20260310001', contactName: '张三', payAmount: '199.00', status: 1, createTime: '2026-03-10 10:23:45' },
  { orderNo: 'ORD20260310002', contactName: '李四', payAmount: '89.90', status: 2, createTime: '2026-03-10 09:15:30' },
  { orderNo: 'ORD20260310003', contactName: '王五', payAmount: '356.00', status: 3, createTime: '2026-03-10 08:44:12' },
  { orderNo: 'ORD20260309001', contactName: '赵六', payAmount: '128.50', status: 0, createTime: '2026-03-09 17:32:08' },
  { orderNo: 'ORD20260309002', contactName: '孙七', payAmount: '45.00', status: 4, createTime: '2026-03-09 15:20:00' },
]
</script>

<style scoped>
.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a2744;
  margin-bottom: 20px;
}

.stat-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #1a2744;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.card-header-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a2744;
}
</style>
```

---

### Task 12: 管理员管理 AdminView.vue

**Files:**
- Modify: `src/views/dashboard/AdminView.vue`

- [ ] **Step 1: 编写管理员管理页**

```vue
<!-- src/views/dashboard/AdminView.vue -->
<template>
  <div>
    <div class="page-header">
      <span class="page-title">管理员管理</span>
      <el-button type="primary" :icon="Plus">新增管理员</el-button>
    </div>

    <el-card shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input v-model="searchText" placeholder="搜索账号/昵称" clearable style="width: 220px;" :prefix-icon="Search" />
        <el-select v-model="searchRole" placeholder="角色筛选" clearable style="width: 150px;">
          <el-option label="超级管理员" value="super_admin" />
          <el-option label="管理员" value="admin" />
        </el-select>
        <el-button type="primary" :icon="Search">搜索</el-button>
        <el-button :icon="RefreshRight">重置</el-button>
      </div>

      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="头像" width="70">
          <template #default="{ row }">
            <el-avatar :size="36" :src="row.avatar" icon="UserFilled" />
          </template>
        </el-table-column>
        <el-table-column prop="account" label="账号" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'super_admin' ? 'danger' : 'primary'" size="small">
              {{ row.role === 'super_admin' ? '超级管理员' : '管理员' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default>
            <el-button type="primary" link>编辑</el-button>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination layout="total, prev, pager, next" :total="50" :page-size="10" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Search, RefreshRight } from '@element-plus/icons-vue'

const searchText = ref('')
const searchRole = ref('')

const tableData = [
  { id: 1, account: 'admin', nickname: '超级管理员', role: 'super_admin', avatar: '', createTime: '2026-01-01 00:00:00' },
  { id: 2, account: 'manager01', nickname: '运营主管', role: 'admin', avatar: '', createTime: '2026-01-15 09:30:00' },
  { id: 3, account: 'editor01', nickname: '内容编辑', role: 'admin', avatar: '', createTime: '2026-02-01 10:00:00' },
]
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a2744;
}
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
```

---

### Task 13: 用户管理 UserView.vue

**Files:**
- Modify: `src/views/dashboard/UserView.vue`

- [ ] **Step 1: 编写用户管理页**

```vue
<!-- src/views/dashboard/UserView.vue -->
<template>
  <div>
    <div class="page-header">
      <span class="page-title">用户管理</span>
    </div>

    <el-card shadow="never">
      <div class="search-bar">
        <el-input v-model="searchText" placeholder="搜索账号/昵称" clearable style="width: 220px;" :prefix-icon="Search" />
        <el-button type="primary" :icon="Search">搜索</el-button>
        <el-button :icon="RefreshRight">重置</el-button>
      </div>

      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="头像" width="70">
          <template #default="{ row }">
            <el-avatar :size="36" :src="row.avatar" icon="UserFilled" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="account" label="账号" min-width="130" />
        <el-table-column prop="openid" label="微信 OpenID" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="注册时间" min-width="160" />
        <el-table-column label="操作" width="90" fixed="right">
          <template #default>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination layout="total, prev, pager, next" :total="1286" :page-size="10" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'

const searchText = ref('')

const tableData = [
  { id: 1, avatar: '', nickname: '小明', account: 'user001', openid: 'oXXXX_abc123def456', createTime: '2026-03-01 08:30:00' },
  { id: 2, avatar: '', nickname: '小红', account: null, openid: 'oXXXX_xyz789uvw012', createTime: '2026-03-02 14:20:00' },
  { id: 3, avatar: '', nickname: '小强', account: 'user003', openid: null, createTime: '2026-03-03 19:10:00' },
]
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-size: 18px; font-weight: 600; color: #1a2744; }
.search-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pagination { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
```

---

### Task 14: 商品分类 CategoryView.vue

**Files:**
- Modify: `src/views/dashboard/CategoryView.vue`

- [ ] **Step 1: 编写商品分类页**

```vue
<!-- src/views/dashboard/CategoryView.vue -->
<template>
  <div>
    <div class="page-header">
      <span class="page-title">商品分类</span>
      <el-button type="primary" :icon="Plus">新增分类</el-button>
    </div>

    <el-card shadow="never">
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="分类图片" width="90">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              style="width: 44px; height: 44px; border-radius: 6px;"
              fit="cover"
            >
              <template #error>
                <div style="width:44px;height:44px;background:#f5f7fa;border-radius:6px;display:flex;align-items:center;justify-content:center;">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" min-width="140" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="showOnHome" label="首页展示" width="100">
          <template #default="{ row }">
            <el-tag :type="row.showOnHome ? 'success' : 'info'" size="small">
              {{ row.showOnHome ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default>
            <el-button type="primary" link>编辑</el-button>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'

const tableData = [
  { id: 1, name: '手机数码', image: '', sort: 1, showOnHome: true, createTime: '2026-01-01 00:00:00' },
  { id: 2, name: '服装服饰', image: '', sort: 2, showOnHome: true, createTime: '2026-01-01 00:00:00' },
  { id: 3, name: '食品生鲜', image: '', sort: 3, showOnHome: false, createTime: '2026-01-02 10:00:00' },
  { id: 4, name: '家居用品', image: '', sort: 4, showOnHome: true, createTime: '2026-01-03 09:00:00' },
]
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-size: 18px; font-weight: 600; color: #1a2744; }
</style>
```

---

### Task 15: 商品管理 ProductView.vue

**Files:**
- Modify: `src/views/dashboard/ProductView.vue`

- [ ] **Step 1: 编写商品管理页**

```vue
<!-- src/views/dashboard/ProductView.vue -->
<template>
  <div>
    <div class="page-header">
      <span class="page-title">商品管理</span>
      <el-button type="primary" :icon="Plus">新增商品</el-button>
    </div>

    <el-card shadow="never">
      <div class="search-bar">
        <el-input v-model="searchText" placeholder="搜索商品名称" clearable style="width: 220px;" :prefix-icon="Search" />
        <el-select v-model="searchStatus" placeholder="上架状态" clearable style="width: 130px;">
          <el-option label="上架" :value="1" />
          <el-option label="下架" :value="0" />
        </el-select>
        <el-select v-model="searchCategory" placeholder="商品分类" clearable style="width: 130px;">
          <el-option label="手机数码" :value="1" />
          <el-option label="服装服饰" :value="2" />
          <el-option label="食品生鲜" :value="3" />
        </el-select>
        <el-button type="primary" :icon="Search">搜索</el-button>
        <el-button :icon="RefreshRight">重置</el-button>
      </div>

      <el-table :data="tableData" stripe>
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
        <el-table-column prop="name" label="商品名称" min-width="180" show-overflow-tooltip />
        <el-table-column label="价格" width="130">
          <template #default="{ row }">
            <div>
              <span style="color:#f56c6c;font-weight:600;">¥{{ row.price }}</span>
              <span v-if="row.originPrice" style="color:#c0c4cc;font-size:12px;text-decoration:line-through;margin-left:4px;">¥{{ row.originPrice }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="sales" label="销量" width="80" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? '上架' : '下架' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isRecommend" label="推荐" width="80">
          <template #default="{ row }">
            <el-tag :type="row.isRecommend ? 'warning' : ''" size="small">{{ row.isRecommend ? '推荐' : '-' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default>
            <el-button type="primary" link>编辑</el-button>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination layout="total, prev, pager, next" :total="342" :page-size="10" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Search, RefreshRight } from '@element-plus/icons-vue'

const searchText = ref('')
const searchStatus = ref(null)
const searchCategory = ref(null)

const tableData = [
  { id: 1, cover: '', name: 'iPhone 15 Pro 256G 深空黑', price: '8999.00', originPrice: '9499.00', stock: 58, sales: 120, status: 1, isRecommend: 1 },
  { id: 2, cover: '', name: '小米14 Ultra 512G', price: '6499.00', originPrice: null, stock: 33, sales: 89, status: 1, isRecommend: 0 },
  { id: 3, cover: '', name: '耐克 Air Max 270 运动鞋', price: '799.00', originPrice: '999.00', stock: 200, sales: 456, status: 1, isRecommend: 1 },
  { id: 4, cover: '', name: '进口澳洲牛排 300g', price: '89.90', originPrice: null, stock: 0, sales: 1200, status: 0, isRecommend: 0 },
]
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-size: 18px; font-weight: 600; color: #1a2744; }
.search-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pagination { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
```

---

### Task 16: 订单管理 OrderView.vue

**Files:**
- Modify: `src/views/dashboard/OrderView.vue`

- [ ] **Step 1: 编写订单管理页**

```vue
<!-- src/views/dashboard/OrderView.vue -->
<template>
  <div>
    <div class="page-header">
      <span class="page-title">订单管理</span>
    </div>

    <el-card shadow="never">
      <div class="search-bar">
        <el-input v-model="searchOrderNo" placeholder="搜索订单编号" clearable style="width: 220px;" :prefix-icon="Search" />
        <el-select v-model="searchStatus" placeholder="订单状态" clearable style="width: 140px;">
          <el-option label="待支付" :value="0" />
          <el-option label="待发货" :value="1" />
          <el-option label="待收货" :value="2" />
          <el-option label="已完成" :value="3" />
          <el-option label="退款/售后" :value="4" />
        </el-select>
        <el-button type="primary" :icon="Search">搜索</el-button>
        <el-button :icon="RefreshRight">重置</el-button>
      </div>

      <el-table :data="tableData" stripe>
        <el-table-column prop="orderNo" label="订单编号" min-width="190" />
        <el-table-column prop="contactName" label="联系人" width="90" />
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
        <el-table-column prop="address" label="收货地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="90" fixed="right">
          <template #default>
            <el-button type="primary" link>详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination layout="total, prev, pager, next" :total="5021" :page-size="10" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'

const searchOrderNo = ref('')
const searchStatus = ref(null)

const statusMap = {
  0: { label: '待支付', type: 'info' },
  1: { label: '待发货', type: 'warning' },
  2: { label: '待收货', type: 'primary' },
  3: { label: '已完成', type: 'success' },
  4: { label: '退款/售后', type: 'danger' },
}

const tableData = [
  { orderNo: 'ORD20260310001', contactName: '张三', contactPhone: '13800138001', totalAmount: '299.00', discountAmount: '100.00', payAmount: '199.00', status: 1, address: '北京市朝阳区建国路88号', createTime: '2026-03-10 10:23:45' },
  { orderNo: 'ORD20260310002', contactName: '李四', contactPhone: '13900139002', totalAmount: '89.90', discountAmount: '0.00', payAmount: '89.90', status: 2, address: '上海市浦东新区张江路100号', createTime: '2026-03-10 09:15:30' },
  { orderNo: 'ORD20260310003', contactName: '王五', contactPhone: '13700137003', totalAmount: '356.00', discountAmount: '0.00', payAmount: '356.00', status: 3, address: '广州市天河区天河路385号', createTime: '2026-03-10 08:44:12' },
  { orderNo: 'ORD20260309001', contactName: '赵六', contactPhone: '13600136004', totalAmount: '128.50', discountAmount: '0.00', payAmount: '128.50', status: 0, address: '深圳市南山区科技园路1号', createTime: '2026-03-09 17:32:08' },
]
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-size: 18px; font-weight: 600; color: #1a2744; }
.search-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pagination { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
```

---

### Task 17: 轮播图管理 BannerView.vue

**Files:**
- Modify: `src/views/dashboard/BannerView.vue`

- [ ] **Step 1: 编写轮播图管理页**

```vue
<!-- src/views/dashboard/BannerView.vue -->
<template>
  <div>
    <div class="page-header">
      <span class="page-title">轮播图管理</span>
      <el-button type="primary" :icon="Plus">新增轮播图</el-button>
    </div>

    <el-card shadow="never">
      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="封面图" width="130">
          <template #default="{ row }">
            <el-image :src="row.cover" style="width:100px;height:50px;border-radius:4px;" fit="cover">
              <template #error>
                <div style="width:100px;height:50px;background:#f5f7fa;border-radius:4px;display:flex;align-items:center;justify-content:center;">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="180" />
        <el-table-column prop="productId" label="关联商品ID" width="120">
          <template #default="{ row }">
            <span>{{ row.productId || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default>
            <el-button type="primary" link>编辑</el-button>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'

const tableData = [
  { id: 1, cover: '', title: '春季新品大促', productId: null, createTime: '2026-03-01 10:00:00' },
  { id: 2, cover: '', title: 'iPhone 15 Pro 特惠', productId: 1, createTime: '2026-03-05 14:00:00' },
  { id: 3, cover: '', title: '品牌运动鞋专场', productId: 3, createTime: '2026-03-08 09:00:00' },
]
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-size: 18px; font-weight: 600; color: #1a2744; }
</style>
```

---

### Task 18: 评价管理 ReviewView.vue

**Files:**
- Modify: `src/views/dashboard/ReviewView.vue`

- [ ] **Step 1: 编写评价管理页**

```vue
<!-- src/views/dashboard/ReviewView.vue -->
<template>
  <div>
    <div class="page-header">
      <span class="page-title">评价管理</span>
    </div>

    <el-card shadow="never">
      <div class="search-bar">
        <el-select v-model="searchRating" placeholder="评分筛选" clearable style="width: 140px;">
          <el-option v-for="n in 5" :key="n" :label="`${n} 星`" :value="n" />
        </el-select>
        <el-button type="primary" :icon="Search">搜索</el-button>
        <el-button :icon="RefreshRight">重置</el-button>
      </div>

      <el-table :data="tableData" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="userId" label="用户ID" width="90" />
        <el-table-column prop="productId" label="商品ID" width="90" />
        <el-table-column prop="orderId" label="订单ID" width="90" />
        <el-table-column prop="rating" label="评分" width="120">
          <template #default="{ row }">
            <el-rate :model-value="row.rating" disabled size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容" min-width="220" show-overflow-tooltip />
        <el-table-column label="评价图片" width="100">
          <template #default="{ row }">
            <span v-if="!row.images || row.images.length === 0" style="color:#c0c4cc;">无</span>
            <el-tag v-else size="small">{{ row.images.length }} 张</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="评价时间" min-width="160" />
        <el-table-column label="操作" width="90" fixed="right">
          <template #default>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination layout="total, prev, pager, next" :total="200" :page-size="10" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'

const searchRating = ref(null)

const tableData = [
  { id: 1, userId: 1, productId: 1, orderId: 3, rating: 5, content: '手机质量非常好，拍照效果很棒！物流也很快，很满意这次购物。', images: ['img1.jpg', 'img2.jpg'], createTime: '2026-03-10 11:00:00' },
  { id: 2, userId: 2, productId: 3, orderId: 2, rating: 4, content: '鞋子款式好看，尺码偏小建议买大一码。', images: [], createTime: '2026-03-10 09:30:00' },
  { id: 3, userId: 3, productId: 2, orderId: 1, rating: 3, content: '还行，没有惊喜。', images: null, createTime: '2026-03-09 16:45:00' },
]
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-size: 18px; font-weight: 600; color: #1a2744; }
.search-bar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.pagination { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
```

---

## Chunk 6: 验证与收尾

### Task 19: 启动验证

- [ ] **Step 1: 启动开发服务器验证**

```bash
cd /Users/hyang/code/learn/projects/shopMal/web-code
npm run dev
```

Expected: 控制台无报错，访问 `http://localhost:3100` 自动跳转到登录页。

- [ ] **Step 2: 逐页验证清单**

按顺序访问以下页面，确认无报错、布局正常、数据展示正确：

| 检查项 | URL |
|--------|-----|
| 登录页（含测试模式提示） | `http://localhost:3100/login` |
| admin/123456 登录跳转首页 | 点击登录按钮 |
| 首页统计卡片 + 近期订单 | `/dashboard` |
| 管理员管理列表 | `/admin` |
| 用户管理列表 | `/user` |
| 商品分类列表 | `/category` |
| 商品管理列表 | `/product` |
| 订单管理列表 | `/order` |
| 轮播图管理 | `/banner` |
| 评价管理 | `/review` |
| 侧栏折叠/展开 | 点击顶栏折叠按钮 |
| 退出登录跳回登录页 | 点击右上角退出 |

- [ ] **Step 3: 运行构建确认无编译错误**

```bash
npm run build
```

Expected: `dist/` 目录生成，无 error 输出。
