# UniApp 移动端页面开发设计文档

**创建时间**：2026-03-11
**项目**：shopMal / uni-code
**目标**：一比一复刻 ui-figma 原型图中的所有前端页面

---

## 一、项目背景

ui-figma 目录包含完整的 React + Tailwind CSS 原型（12 个页面），uni-code 目前仅有一个占位页。本次任务是在 UniApp（Vue 3）工程中完整复刻所有原型页面，使用纯 CSS、Vue 3 Composition API（`<script setup>`）、Pinia 状态管理。

---

## 二、技术约定

| 项目 | 约定 |
|------|------|
| 样式 | 纯 CSS，在 `<style>` 标签内，使用 CSS 变量定义主题色 |
| API 风格 | Vue 3 `<script setup>` 组合式 API |
| Vue 导入 | `ref`, `computed`, `onMounted`, `watch` 从 `'vue'` 导入 |
| UniApp 生命周期 | `onLoad`, `onShow`, `onHide`, `onPullDownRefresh` 等从 `'@dcloudio/uni-app'` 导入 |
| 按钮 | 优先用 `<view>` 实现，避免 `<button>` |
| 导航栏 | 全部使用 `pages.json` 配置的系统原生导航栏 |
| Mock 数据 | 字段与 database.sql 一致，采用驼峰命名 |
| 状态管理 | Pinia |
| 主色调 | `#EF4444`（红色） |

### CSS 变量（全局）

```css
:root {
  --primary: #EF4444;
  --primary-light: #FEF2F2;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  --bg-page: #f9fafb;
  --bg-card: #ffffff;
  --border: #e5e7eb;
}
```

---

## 三、目录结构

```
uni-code/
├── pages/
│   ├── home/home.vue              # 首页（TabBar）
│   ├── category/category.vue      # 分类（TabBar）
│   ├── cart/cart.vue              # 购物车（TabBar）
│   ├── profile/profile.vue        # 我的（TabBar）
│   ├── product/detail.vue         # 商品详情
│   ├── checkout/checkout.vue      # 确认订单
│   ├── orders/orders.vue          # 订单列表
│   ├── order-success/index.vue    # 支付成功
│   ├── profile-info/index.vue     # 个人信息
│   ├── address/address.vue        # 地址管理
│   ├── login/login.vue            # 登录注册
│   └── support/support.vue        # 客服支持
├── stores/
│   ├── auth.js                    # 认证状态
│   ├── cart.js                    # 购物车状态
│   └── order.js                   # 订单临时状态
├── utils/
│   └── format.js                  # 价格格式化等工具函数
├── static/
│   └── tabbar/                    # TabBar 图标（8张 PNG）
│       ├── home.png / home-active.png
│       ├── category.png / category-active.png
│       ├── cart.png / cart-active.png
│       └── profile.png / profile-active.png
├── App.vue
├── main.js
└── pages.json
```

---

## 四、pages.json 配置

### 页面路由（12个页面）

| 页面 | 路径 | 导航栏标题 | 备注 |
|------|------|-----------|------|
| 首页 | `pages/home/home` | 首页 | TabBar |
| 分类 | `pages/category/category` | 分类 | TabBar |
| 购物车 | `pages/cart/cart` | 购物车 | TabBar |
| 我的 | `pages/profile/profile` | 我的 | TabBar |
| 商品详情 | `pages/product/detail` | 商品详情 | 普通页 |
| 确认订单 | `pages/checkout/checkout` | 确认订单 | 普通页 |
| 订单列表 | `pages/orders/orders` | 我的订单 | 普通页 |
| 支付成功 | `pages/order-success/index` | 支付成功 | 普通页 |
| 个人信息 | `pages/profile-info/index` | 个人信息 | 普通页 |
| 地址管理 | `pages/address/address` | 收货地址 | 普通页 |
| 登录注册 | `pages/login/login` | 登录 | 普通页 |
| 客服支持 | `pages/support/support` | 客服支持 | 普通页 |

### TabBar 配置

```json
"tabBar": {
  "color": "#6b7280",
  "selectedColor": "#EF4444",
  "backgroundColor": "#ffffff",
  "borderStyle": "black",
  "list": [
    { "pagePath": "pages/home/home", "text": "首页", "iconPath": "static/tabbar/home.png", "selectedIconPath": "static/tabbar/home-active.png" },
    { "pagePath": "pages/category/category", "text": "分类", "iconPath": "static/tabbar/category.png", "selectedIconPath": "static/tabbar/category-active.png" },
    { "pagePath": "pages/cart/cart", "text": "购物车", "iconPath": "static/tabbar/cart.png", "selectedIconPath": "static/tabbar/cart-active.png" },
    { "pagePath": "pages/profile/profile", "text": "我的", "iconPath": "static/tabbar/profile.png", "selectedIconPath": "static/tabbar/profile-active.png" }
  ]
}
```

---

## 五、Pinia Store 设计

### auth.js

```js
// 状态
token: null          // JWT token（string | null）
userInfo: null       // { id, nickname, avatar, account, createTime }
                     // avatar 为空时页面展示占位头像（灰色圆形）

// Actions
login(account, password)             // 模拟登录，写入 token + userInfo（含 createTime）
register(account, nickname, password) // 模拟注册，注册成功后自动登录
logout()                             // 清除 token 和 userInfo
updateProfile(data)                  // 更新 nickname/avatar

// Getters
isLoggedIn    // boolean，token !== null
```

### cart.js

```js
// 状态
cartList: []   // [{ id, productId, productName, cover, price, spec, quantity, selected }]
               // spec: string，例如 "黑色 / M"

// Actions
addToCart(product, spec, quantity)   // 已存在相同 productId+spec 则累加数量
removeFromCart(id)
updateQuantity(id, delta)            // delta: +1 或 -1，最小为 1
toggleSelect(id)
toggleSelectAll()
clearSelected()                      // 清除已选中的商品（结算后调用）
clearCart()                          // 清空全部

// Getters
cartCount     // cartList 所有 quantity 之和，用于 TabBar 徽标
selectedItems // 已选中商品列表
totalPrice    // 已选中商品总价（保留两位小数）
allSelected   // 是否全选（cartList 全为 selected）
```

**购物车徽标更新策略：**
- 在每个 TabBar 页面的 `onShow` 生命周期中，监听 `cartStore.cartCount` 并调用 `uni.setTabBarBadge({ index: 2, text: String(count) })`
- `count === 0` 时调用 `uni.removeTabBarBadge({ index: 2 })`
- H5 端 `uni.setTabBarBadge` 不支持，降级策略：H5 端不显示徽标（可接受，学习项目）

### order.js

```js
// 状态
currentOrder: null   // 结算页临时订单数据
  // {
  //   items: [],          // 来自 cart.selectedItems
  //   totalAmount: 0,     // 小计金额
  //   discountAmount: 0,  // 优惠金额（固定模拟为 0）
  //   payAmount: 0,       // 实付 = total - discount + shipping
  //   address: null,      // 当前选中的收货地址（见下方结构）
  //   payMethod: 'wechat' // 'wechat' | 'alipay' | 'balance'
  // }

// address 对象结构（与 order 表 contact_* 字段对应）
// {
//   id: number,
//   contactName: string,   // 联系人
//   contactPhone: string,  // 电话
//   province: string,      // 省
//   city: string,          // 市
//   district: string,      // 区
//   detail: string,        // 详细地址
//   isDefault: boolean
// }

// Actions
setCurrentOrder(data)       // 从结算页初始化订单数据
setAddress(address)         // 地址选择页返回后更新地址
setPayMethod(method)        // 切换支付方式
clearCurrentOrder()         // 支付成功后清空
```

---

## 六、各页面设计

### 1. 首页（home）

**布局：**
- 搜索栏（灰色背景，非跳转，仅展示 UI）
- Banner 轮播（swiper 组件，自动播放 3s，圆点指示器）
- 快捷入口（4列：秒杀 / 优惠券 / 新品 / 热卖）— **纯静态硬编码 UI，无数据绑定，无跳转交互**
- 推荐商品（2列 Grid，每项：封面图 + 名称 + 价格 + 原价 + 销量）

**Mock 数据字段（product 表驼峰映射）：**
- `id`, `name`, `cover`, `price`, `originPrice`（← origin_price）, `sales`, `isRecommend`（← is_recommend）

**交互：** 点击商品卡片 → `uni.navigateTo` 到商品详情页（携带 id）

---

### 2. 分类页（category）

**布局：**
- 左侧栏（固定宽度 80px）：分类列表，选中项显示红色左边框
- 右侧内容区（滚动）：2列商品列表

**规格弹窗（底部抽屉）：**
- 商品图片 + 价格预览
- 颜色选择（pill 按钮组）
- 尺码选择（方形按钮组）
- 数量控制（- 数字 +）
- 加入购物车 / 立即购买 按钮

**Mock 数据字段（category 表）：** id, name, image；product 中附带 specs JSON

---

### 3. 商品详情（product/detail）

**布局：**
- 顶部图片轮播（swiper）
- 价格区：红色现价 + 删除线原价 + 销量 + 评分
- 规格选择区（灰色区块，点击打开底部弹窗）
- 评价列表（头像 + 昵称 + 星级 + 内容 + 图片）
- 商品描述（展开/收起）
- 底部固定操作栏：加入购物车 + 立即购买

**Mock 数据字段（product 表驼峰映射）：**
- `id`, `name`, `cover`, `detailImgs`（← detail_imgs，JSON数组）, `price`, `originPrice`（← origin_price）
- `stock`, `status`, `isRecommend`（← is_recommend）, `sales`, `views`, `description`
- `categoryId`（← category_id）, `specs`（JSON对象，含颜色/尺码等）

**Mock 数据字段（review 表驼峰映射）：**
- `id`, `userId`（← user_id）, `orderId`（← order_id）, `productId`（← product_id）
- `rating`, `content`, `images`（JSON数组）, `createTime`（← create_time）
- 附带用户 `nickname` 和 `avatar`（关联 user 表）

---

### 4. 购物车（cart）

**布局：**
- 商品列表：复选框 + 图片 + 名称规格 + 价格 + 数量控制 + 删除
- 空购物车提示（未登录 / 无商品两种状态）
- 底部固定栏：全选复选框 + 合计价格 + 结算按钮

**登录检查：** 未登录时展示引导登录提示，不显示购物车内容

---

### 5. 结算页（checkout）

**布局：**
- 收货地址选择区（红色图标，点击 → 地址管理/选择模式）
- 商品清单（图片 + 名称 + 规格 + 价格 × 数量）
- 价格明细（小计 / 运费 / 优惠 / 实付）
- 支付方式（微信 / 支付宝 / 余额，单选）
- 底部固定：实付金额 + 提交订单按钮

**提交后：** 清空已结算商品，跳转到支付成功页

---

### 6. 订单列表（orders）

**布局：**
- Tab 横向滚动切换（全部 / 待发货 / 待收货 / 已完成 / 退款售后）
- 订单卡片：订单号 + 状态（颜色区分）+ 商品列表 + 时间 + 总价 + 操作按钮

**Tab 列表与 status 枚举对应关系：**
- 全部（无过滤）
- 待发货（status=1）— 注：status=0（待支付）归入"全部"Tab，不单独设 Tab
- 待收货（status=2）
- 已完成（status=3）
- 退款售后（status=4）

**状态颜色：**
- 待支付（status=0）：#f97316（橙）— 仅在"全部"Tab 中展示
- 待发货（status=1）：#3b82f6（蓝）
- 待收货（status=2）：#3b82f6（蓝）
- 已完成（status=3）：#22c55e（绿）
- 退款售后（status=4）：#ef4444（红）

**Mock 数据字段（order 表驼峰映射）：**
- `id`, `userId`（← user_id）, `orderNo`（← order_no）, `orderItems`（← order_items，JSON数组）
- `remark`, `status`, `totalAmount`（← total_amount）, `discountAmount`（← discount_amount）
- `payAmount`（← pay_amount）, `contactName`（← contact_name）, `contactPhone`（← contact_phone）
- `address`, `createTime`（← create_time）

**orderItems 数组元素字段：** `productId`, `productName`, `price`, `quantity`, `cover`

---

### 7. 支付成功（order-success）

**布局：** 居中卡片
- 绿色圆形图标（✓）
- 「支付成功」大标题
- 副标题文字
- 「查看订单」按钮（红色实心）
- 「返回首页」按钮（灰色描边）

---

### 8. 我的（profile）

**布局：**
- 红色渐变头部（头像 + 昵称 + 会员等级）
- 订单状态卡片（-mt-16 叠在头部之上）：待付款 / 待发货 / 待收货 / 已完成 各一个图标+数量
- 菜单列表：个人信息 / 我的订单 / 收货地址 / 客服支持 / 设置（占位）
- 退出登录按钮（描边红色）

**未登录状态：** 显示头像占位 + 「点击登录」提示

---

### 9. 个人信息（profile-info）

**布局：**
- 头像（可点击，模拟修改）
- 信息列表（账号 / 昵称 / 用户ID / 注册时间）
- 昵称可编辑（点击编辑按钮进入编辑模式，输入框底部红线）

---

### 10. 地址管理（address）

**双模式：**
- **管理模式**（默认）：地址列表 + 编辑/删除/设默认操作 + 底部新增按钮
- **选择模式**（从结算页进入，`?select=true`）：列表可点击选中，返回时传回选中地址

**新增/编辑表单（底部抽屉）：** 姓名 / 电话 / 省市区（3个选择器）/ 详细地址 / 设为默认开关

---

### 11. 登录注册（login）

**布局：**
- Tab 切换：账号登录 / 注册账号
- 账号登录：账号输入框 + 密码输入框 + 登录按钮
- 注册：账号 + 昵称 + 密码 + 注册按钮
- 表单验证（密码至少6位）

**登录成功后：** 跳回上一页或首页

---

### 12. 客服支持（support）

**布局：**
- 顶部图标 + 「联系客服」标题
- 联系方式列表（电话客服 / 在线客服 / 帮助中心）
- 工作时间说明

---

## 七、pages.json 全局配置说明

- `uniIdRouter`: `{}` — 保留（UniApp 框架默认配置，不删除）
- `globalStyle`:
  - `navigationBarBackgroundColor`: `"#ffffff"`（白色背景，统一所有页面）
  - `navigationBarTextStyle`: `"black"`（黑色标题文字）
  - `navigationBarTitleText`: `"shopMal"`（全局默认，各页面自行覆盖）
  - `backgroundColor`: `"#f9fafb"`（页面背景色）
- 下拉刷新：仅首页和订单列表页在各自的 `style` 中开启 `"enablePullDownRefresh": true`

---

## 八、实现顺序

1. **基础设施**：`main.js`（Pinia 初始化）、`stores/`（3个 Store）、`utils/format.js`、TabBar 图标
2. **pages.json**：完整路由 + TabBar 配置
3. **4个 TabBar 页面**：home → category → cart → profile
4. **商品详情**：product/detail
5. **购物流程**：checkout → order-success
6. **订单中心**：orders
7. **用户中心**：login → profile-info → address → support

---

## 九、main.js 变更

UniApp Vue 3 项目需在 `createApp()` 内挂载 Pinia：

```js
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  return { app }
}
```

---

## 十、注意事项

1. **TabBar 图标**：必须是本地图片文件（不能使用网络图片或 SVG），需在 `static/tabbar/` 目录存放 8 张 PNG（40×40px 推荐）
2. **购物车徽标**：在每个 TabBar 页面的 `onShow` 中调用 `uni.setTabBarBadge`；H5 端不支持此 API，不做降级处理（学习项目可接受）
3. **页面跳转**：Tab 页之间用 `uni.switchTab`，普通页用 `uni.navigateTo`，返回用 `uni.navigateBack`
4. **地址管理选择模式**：通过 `onLoad` 接收 `options.select === '1'` 判断；地址选中后调用 `orderStore.setAddress(address)` 并 `uni.navigateBack()`
5. **结算页数据**：通过 `order.js` Store 中转（避免 URL 参数过长）
6. **Pinia 持久化**：Store 状态不持久化（关闭 App 后清空，学习项目可接受）；如需持久化 token，在 `auth.js` 的 action 中额外调用 `uni.setStorageSync('token', token)`
