# ShopMal — 全栈多端商城系统

一个基于 Spring Boot 3 + Vue 3 + UniApp 的全栈多端商城系统，包含后台管理端和移动端，适合学习全栈开发。

## 技术栈

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| Java | 17 | 开发语言 |
| Spring Boot | 3.5.11 | 核心框架 |
| Spring Security | — | 认证与授权 |
| MyBatis-Plus | 3.5.15 | ORM 增强框架 |
| MySQL | 8.x | 关系型数据库 |
| Druid | 1.2.24 | 数据库连接池 |
| JJWT | 0.12.6 | JWT Token 生成与解析 |
| Lombok | — | 简化 Java 代码 |
| 腾讯云 COS | 5.6.227 | 对象存储（文件上传） |

### 前端（PC 后台管理）

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.25 | 前端框架 |
| Vite | 7.3.1 | 构建工具 |
| Element Plus | 2.13.5 | UI 组件库 |
| Pinia | 3.0.4 | 状态管理 |
| Vue Router | 4.6.4 | 路由管理 |
| Axios | 1.13.6 | HTTP 请求 |
| ECharts | 6.0.0 | 数据可视化 |

### 移动端

| 技术 | 版本 | 说明 |
|------|------|------|
| UniApp | — | 跨平台框架（小程序/APP） |
| uni-ui | 1.5.11 | UI 组件库 |
| Pinia | 2.1.7 | 状态管理 |


## 核心功能

### 后台管理端

| 模块 | 功能 |
|------|------|
| 仪表盘 | 数据统计概览（用户数、订单数、销售额等） |
| 管理员管理 | 管理员账号的增删改查、密码重置 |
| 用户管理 | 查看用户列表、禁用/启用用户 |
| 分类管理 | 商品分类的增删改查、排序、首页展示控制 |
| 商品管理 | 商品的增删改查、上下架、图片上传、规格管理 |
| 订单管理 | 订单列表、订单详情、状态流转（待付款→待发货→已发货→已完成） |
| 轮播图管理 | 首页轮播图的增删改查、关联商品 |
| 评价管理 | 用户评价的查看与管理 |

### 移动端

- 用户注册与登录
- 首页展示（轮播图、推荐商品、分类导航）
- 商品浏览与搜索
- 下单与订单管理
- 商品评价

### 通用特性

- **JWT 认证**：基于 Bearer Token 的无状态认证
- **统一响应格式**：`{ code, message, data }`，分页 `{ list, total, page, pageSize }`
- **软删除**：逻辑删除，数据可追溯
- **自动填充**：`createTime` / `updateTime` 自动维护
- **全局异常处理**：业务异常统一捕获与返回

## 环境要求

- JDK 17+
- Node.js 18+
- MySQL 8.x
- Maven 3.8+（或使用项目内置的 `mvnw`）

## 配置与启动

### 1. 初始化数据库

```bash
# 创建数据库并导入初始数据
mysql -u root -p < database.sql
```

该脚本会自动创建 `ai_java_uniapp_market` 数据库，建表并插入示例数据（3 个管理员、5 个用户、5 个商品等）。

默认管理员账号：`admin` / `123456`

### 2. 启动后端

```bash
cd java-code/

# 修改数据库连接配置（如需要）
# vim src/main/resources/application.properties

# 启动服务（默认端口 8080）
./mvnw spring-boot:run
```

主要配置项（`application.properties`）：

| 配置 | 说明 | 默认值 |
|------|------|--------|
| `spring.datasource.url` | 数据库连接地址 | `jdbc:mysql://localhost:3306/ai_java_uniapp_market` |
| `spring.datasource.username` | 数据库用户名 | `navicat` |
| `spring.datasource.password` | 数据库密码 | `navicat123` |
| `jwt.secret` | JWT 签名密钥 | 内置默认值 |
| `jwt.expiration` | Token 过期时间（毫秒） | `86400000`（24 小时） |

### 3. 启动前端

```bash
cd web-code/

# 安装依赖
npm install

# 启动开发服务器（端口 3100，自动代理 /api → localhost:8080）
npm run dev
```

启动后访问 http://localhost:3100 即可进入后台管理系统。

### 4. 构建部署

```bash
# 后端打包
cd java-code/
./mvnw clean package -DskipTests

# 前端打包
cd web-code/
npm run build
```

## API 文档

完整的接口文档请参阅 [API.md](API.md)，涵盖所有后台管理端和移动端接口的请求/响应说明。
