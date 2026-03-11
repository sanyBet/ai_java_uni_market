# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

全栈多端商城系统（学习项目），包含三个子模块：

| 目录 | 说明 | 技术栈 |
|------|------|--------|
| `java-code/` | 后端 REST API | Spring Boot 3 + MyBatis-Plus + JWT |
| `web-code/` | PC 后台管理前端 | Vue 3 + Element Plus + Pinia + Vite |
| `uni-code/` | 移动端小程序/APP | UniApp（待开发） |

数据库初始化脚本：`database.sql`
接口文档：`API.md`

## 各模块命令

### 后端（java-code/）

```bash
./mvnw spring-boot:run          # 启动（默认 8080 端口）
./mvnw clean package -DskipTests # 打包
./mvnw test                     # 所有测试
./mvnw test -Dtest=ClassName    # 单个测试类
./mvnw test -Dtest=CodeGenerator # MyBatis-Plus 代码生成
```

### 前端（web-code/）

```bash
npm run dev      # 启动开发服务器（端口 3100，代理 /api → localhost:8080）
npm run build    # 生产构建
```

## 架构说明

### API 路由约定

- `/api/admin/**` — 后台管理端，需 JWT 认证（`Authorization: Bearer <token>`）
- `/api/mini/**` — 移动端，部分公开

统一响应格式：`{ code, message, data }`，分页数据：`{ list, total, page, pageSize }`

### 后端层次结构

```
controller/admin/  → AdminXxxController（认证）
controller/mini/   → 公开 API
service/           → IXxxService + impl/XxxServiceImpl extends ServiceImpl<Mapper, Entity>
mapper/            → XxxMapper extends BaseMapper<Entity>
entity/            → 数据库实体（MyBatis-Plus 注解）
dto/admin/         → 请求体
vo/admin/          → 响应体
common/result/     → Result<T>, PageResult<T>
common/exception/  → BusinessException, GlobalExceptionHandler
config/            → SecurityConfig, JwtFilter, MybatisPlusConfig
```

关键约定：
- 业务错误抛 `BusinessException(code, message)`
- 软删除用 `@TableLogic` 的 `isDeleted` 字段
- `createTime`/`updateTime` 由 `MyMetaObjectHandler` 自动填充
- 分页用 MyBatis-Plus 的 `Page<T>`，结果包装为 `PageResult.of(...)`

### 前端结构

```
src/api/        → 按业务域拆分的 Axios 模块
src/stores/     → auth.js（token + adminInfo）、app.js（侧边栏状态）
src/router/     → 路由 + 导航守卫（无 token → /login）
src/views/      → 页面（login/ + dashboard/ 等 8 个业务页面）
src/components/ → 布局组件（AppLayout, SideMenu, TopHeader）
```

Vue API 和 Element Plus 组件均已配置自动导入，无需手动 `import`。

### 数据库

MySQL，数据库名：`ai_java_uniapp_market`。主要表：`user`、`admin`、`category`、`product`、`order` 等（完整结构见 `database.sql`）。文件上传路径：`/Users/hyang/code/learn/projects/shopMal/data`，访问路径 `/uploads/**`。
