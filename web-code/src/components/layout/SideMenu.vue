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
  { path: '/dashboard', title: '首页',       icon: 'Odometer' },
  { path: '/admin',     title: '管理员管理', icon: 'Avatar' },
  { path: '/user',      title: '用户管理',   icon: 'User' },
  { path: '/category',  title: '商品分类',   icon: 'Grid' },
  { path: '/product',   title: '商品管理',   icon: 'Goods' },
  { path: '/order',     title: '订单管理',   icon: 'List' },
  { path: '/banner',    title: '轮播图管理', icon: 'Picture' },
  { path: '/review',    title: '评价管理',   icon: 'ChatDotRound' },
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

:deep(.el-menu-item) {
  height: 46px;
  line-height: 46px;
  margin: 2px 8px;
  border-radius: 6px;
  width: calc(100% - 16px);
}

:deep(.el-menu-item.is-active) {
  background-color: #1a6fba !important;
}

:deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

:deep(.el-menu--collapse .el-menu-item) {
  margin: 2px 4px;
  width: calc(100% - 8px);
}
</style>
