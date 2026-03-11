# 商城后台管理系统前端设计文档

**创建日期**：2026-03-10
**项目路径**：`web-code/`
**技术栈**：Vue 3 + Vue Router + Pinia + Element Plus + Axios + Vite

---

## 1. 视觉设计规范

| 属性 | 值 |
|------|----|
| 主色调 | `#1a6fba` |
| 侧边栏背景 | `#1a2744`（深海蓝） |
| 页面背景 | `#f5f7fa` |
| 卡片背景 | `#ffffff` |
| 顶栏背景 | `#ffffff` |
| 设计风格 | 扁平化，简洁精致 |

---

## 2. 项目结构

```
web-code/
├── public/
├── src/
│   ├── api/                    # API 接口层
│   │   ├── index.js            # axios 实例 + 请求/响应拦截器
│   │   ├── admin.js
│   │   ├── user.js
│   │   ├── category.js
│   │   ├── product.js
│   │   ├── order.js
│   │   ├── banner.js
│   │   └── review.js
│   ├── assets/
│   ├── components/
│   │   └── layout/
│   │       ├── AppLayout.vue   # 主布局框架（侧栏 + 顶栏 + 内容区）
│   │       ├── SideMenu.vue    # 左侧菜单栏
│   │       └── TopHeader.vue  # 顶部导航栏
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   ├── auth.js             # 登录态、用户信息
│   │   └── app.js              # 菜单折叠等全局 UI 状态
│   ├── views/
│   │   ├── login/
│   │   │   └── LoginView.vue
│   │   └── dashboard/
│   │       ├── DashboardView.vue
│   │       ├── AdminView.vue
│   │       ├── UserView.vue
│   │       ├── CategoryView.vue
│   │       ├── ProductView.vue
│   │       ├── OrderView.vue
│   │       ├── BannerView.vue
│   │       └── ReviewView.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```

---

## 3. 路由设计

| 路径 | 组件 | 说明 |
|------|------|------|
| `/login` | LoginView | 登录页，无需鉴权 |
| `/` | AppLayout > DashboardView | 首页（重定向到 /dashboard） |
| `/dashboard` | DashboardView | 数据概览 |
| `/admin` | AdminView | 管理员管理 |
| `/user` | UserView | 用户管理 |
| `/category` | CategoryView | 商品分类 |
| `/product` | ProductView | 商品管理 |
| `/order` | OrderView | 订单管理 |
| `/banner` | BannerView | 轮播图管理 |
| `/review` | ReviewView | 评价管理 |

路由守卫：未登录访问任意需鉴权路由时，重定向到 `/login`。

---

## 4. 状态管理

### auth store
```js
state: {
  token: localStorage.getItem('token') || null,
  adminInfo: { account, nickname, role, avatar }
}
actions: login(account, password), logout()
```
测试模式：`account === 'admin' && password === '123456'` 时直接写入 mock token，跳过 API。

### app store
```js
state: {
  sidebarCollapsed: false
}
```

---

## 5. 页面字段规范（与数据库对应，驼峰命名）

### 管理员管理（admin）
`id` · `account` · `nickname` · `role` · `avatar` · `createTime` · `updateTime` · `isDeleted`

### 用户管理（user）
`id` · `avatar` · `nickname` · `account` · `openid` · `createTime`

### 商品分类（category）
`id` · `name` · `image` · `sort` · `showOnHome` · `createTime`

### 商品管理（product）
`id` · `name` · `cover` · `detailImgs` · `price` · `originPrice` · `stock` · `status` · `isRecommend` · `sales` · `views` · `description` · `categoryId` · `specs`

### 订单管理（order）
`id` · `userId` · `orderNo` · `orderItems` · `remark` · `status` · `totalAmount` · `discountAmount` · `payAmount` · `contactName` · `contactPhone` · `address` · `createTime`

### 轮播图（banner）
`id` · `title` · `cover` · `productId` · `createTime`

### 评价（review）
`id` · `userId` · `orderId` · `productId` · `rating` · `content` · `images` · `createTime`

---

## 6. API 层规范

- `src/api/index.js`：创建 axios 实例，baseURL 读取 `import.meta.env.VITE_API_BASE_URL`，统一请求头注入 token，响应拦截处理 401 跳转登录
- 各模块文件仅导出对应实体的 CRUD 函数，命名如 `getAdminList`、`createAdmin`、`updateAdmin`、`deleteAdmin`

---

## 7. 布局规范

- 侧栏宽度：220px（展开） / 64px（折叠）
- 顶栏高度：56px
- 内容区：`padding: 24px`
- 卡片：`border-radius: 6px`，`box-shadow: 0 1px 4px rgba(0,0,0,0.08)`
- 表格操作列：编辑（蓝色文字按钮） + 删除（红色文字按钮）

---

## 8. 首页（Dashboard）卡片

| 卡片 | 图标颜色 | Mock 数据 |
|------|---------|-----------|
| 注册用户 | `#1a6fba` | 1,286 |
| 商品总数 | `#67c23a` | 342 |
| 订单总数 | `#e6a23c` | 5,021 |
| 今日销售额 | `#f56c6c` | ¥12,480 |

首页底部：最近 10 条订单表格（orderNo、contactName、payAmount、status、createTime）
