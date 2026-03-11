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
