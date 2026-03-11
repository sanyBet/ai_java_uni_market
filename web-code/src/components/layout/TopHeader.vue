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
  admin:     '管理员管理',
  user:      '用户管理',
  category:  '商品分类',
  product:   '商品管理',
  order:     '订单管理',
  banner:    '轮播图管理',
  review:    '评价管理',
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
  outline: none;
}

.admin-name {
  font-size: 14px;
}
</style>
