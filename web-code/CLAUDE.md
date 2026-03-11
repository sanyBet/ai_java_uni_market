# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vue 3 + Element Plus 的电商后台管理系统（shopMal Admin）。

## 常用命令

```bash
npm run dev      # 启动开发服务器（端口 3100）
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

无 lint 或测试命令配置。

## 架构概述

### 技术栈

- **Vue 3** + **Vite** — 核心框架与构建工具
- **Pinia** — 状态管理
- **Vue Router 4** — 路由
- **Element Plus** — UI 组件库（中文语言包）
- **Axios** — HTTP 请求
- **ECharts** — 数据可视化（仅仪表板页面）

### 目录结构

```
src/
├── api/          # 按业务域拆分的 Axios 请求模块
├── stores/       # Pinia store（auth.js / app.js）
├── router/       # 路由定义 + 导航守卫
├── views/        # 页面组件（login/ + dashboard/）
├── components/   # 布局组件（AppLayout, SideMenu, TopHeader）
└── main.js       # 应用入口
```

### 路由结构

两级路由：
- `/login` — 登录页（不需要认证）
- `/` — 主布局（需要认证），包含 8 个子路由：dashboard / admin / user / category / product / order / banner / review

导航守卫：无 token → 重定向到 `/login`；有 token 访问 `/login` → 重定向到 `/dashboard`。

### API 层

`src/api/index.js` 创建单一 Axios 实例：
- `baseURL: /api`（由 Vite 代理到 `http://localhost:8080`）
- 请求拦截器：自动注入 `Authorization: Bearer <token>`
- 响应拦截器：401 时清除 token 并跳转登录

每个业务域一个 API 文件，统一导出 CRUD 函数。

### 状态管理

- `stores/auth.js` — token（持久化到 localStorage）、adminInfo、login/logout actions
- `stores/app.js` — 侧边栏折叠状态

### 页面模式

所有管理页面遵循统一模式：Element Plus Table（列表）+ Dialog + Form（新增/编辑）+ 分页 + 搜索。

## 开发注意事项

- Vite 代理：`/api` → `http://localhost:8080`，后端需在 8080 端口运行
- 路径别名：`@` → `./src`
- 自动导入：已配置 `unplugin-auto-import`（Vue API）和 `unplugin-vue-components`（Element Plus 组件），无需手动 import
