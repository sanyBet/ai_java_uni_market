# ShopMal 后端服务（java-code）

> 全栈多端商城系统的后端 REST API 模块，基于 Spring Boot 3 构建，作为学习 Java 全栈开发的实践项目。

---

## 项目简介

本项目是一个电商后台管理系统的后端服务，为管理端（PC 后台）和移动端（小程序/APP）提供统一的 REST API 接口。功能涵盖管理员认证、用户管理、商品管理、分类管理、订单管理、评论管理、轮播图管理和数据看板等。

---

## 技术栈

| 分类 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 核心框架 | Spring Boot | 3.5.11 | 应用容器与自动配置 |
| 编程语言 | Java | 17 | LTS 版本 |
| ORM 框架 | MyBatis-Plus | 3.5.15 | 增强版 MyBatis，提供 CRUD、分页、逻辑删除 |
| 安全框架 | Spring Security | 随 Boot | 认证与授权过滤链 |
| 认证方案 | JJWT | 0.12.6 | JWT Token 生成与校验 |
| 数据库 | MySQL | 8.x | 关系型数据库 |
| 连接池 | Druid | 1.2.24 | 阿里巴巴高性能连接池 |
| 对象存储 | 腾讯云 COS | 5.6.x | 图片/文件上传存储 |
| 简化代码 | Lombok | — | 注解自动生成 getter/setter/构造器 |
| 构建工具 | Maven Wrapper | — | 无需本地安装 Maven |

---

## 快速开始

### 前置条件

- JDK 17+
- MySQL 8.x（数据库名：`ai_java_uniapp_market`）
- 执行项目根目录的 `database.sql` 初始化表结构

### 配置文件

编辑 `src/main/resources/application.properties`，修改数据库连接信息：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ai_java_uniapp_market?...
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 运行命令

```bash
# 启动服务（默认端口 8080）
./mvnw spring-boot:run

# 打包（跳过测试）
./mvnw clean package -DskipTests

# 运行全部测试
./mvnw test

# 运行单个测试类
./mvnw test -Dtest=JavaCodeApplicationTests

# 使用 MyBatis-Plus Generator 生成代码
./mvnw test -Dtest=CodeGenerator
```

---

## 项目结构

```
java-code/
├── src/
│   ├── main/
│   │   ├── java/com/project/
│   │   │   ├── JavaCodeApplication.java          # 启动入口
│   │   │   │
│   │   │   ├── controller/                       # 控制器层
│   │   │   │   ├── admin/                        # 后台管理 API（需认证）
│   │   │   │   │   ├── AdminAuthController.java  # 登录/登出
│   │   │   │   │   ├── AdminController.java      # 管理员 CRUD
│   │   │   │   │   ├── AdminUserController.java  # 用户管理
│   │   │   │   │   ├── AdminCategoryController.java
│   │   │   │   │   ├── AdminProductController.java
│   │   │   │   │   ├── AdminBannerController.java
│   │   │   │   │   ├── AdminOrderController.java
│   │   │   │   │   ├── AdminReviewController.java
│   │   │   │   │   ├── AdminDashboardController.java
│   │   │   │   │   └── AdminUploadController.java
│   │   │   │   └── mini/                         # 移动端公开 API（待实现）
│   │   │   │
│   │   │   ├── service/                          # 业务逻辑层
│   │   │   │   ├── IAdminService.java
│   │   │   │   ├── IUserService.java
│   │   │   │   ├── ICategoryService.java
│   │   │   │   ├── IProductService.java
│   │   │   │   ├── IBannerService.java
│   │   │   │   ├── IOrderService.java
│   │   │   │   ├── IReviewService.java
│   │   │   │   ├── FileService.java              # 文件上传服务（本地/COS）
│   │   │   │   └── impl/                         # 接口实现类
│   │   │   │
│   │   │   ├── mapper/                           # 数据访问层（继承 BaseMapper）
│   │   │   │   ├── AdminMapper.java
│   │   │   │   ├── UserMapper.java
│   │   │   │   ├── CategoryMapper.java
│   │   │   │   ├── ProductMapper.java
│   │   │   │   ├── BannerMapper.java
│   │   │   │   ├── OrderMapper.java
│   │   │   │   ├── OrderItemMapper.java
│   │   │   │   └── ReviewMapper.java
│   │   │   │
│   │   │   ├── entity/                           # 数据库实体（对应表结构）
│   │   │   │   ├── Admin.java
│   │   │   │   ├── User.java
│   │   │   │   ├── Category.java
│   │   │   │   ├── Product.java
│   │   │   │   ├── Banner.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── OrderItem.java
│   │   │   │   └── Review.java
│   │   │   │
│   │   │   ├── dto/admin/                        # 请求参数 DTO
│   │   │   │   ├── AdminLoginDTO.java
│   │   │   │   ├── AdminCreateDTO.java
│   │   │   │   ├── AdminUpdateDTO.java
│   │   │   │   ├── AdminResetPasswordDTO.java
│   │   │   │   ├── AdminCategoryDTO.java
│   │   │   │   ├── AdminProductDTO.java
│   │   │   │   ├── AdminBannerDTO.java
│   │   │   │   └── AdminOrderStatusDTO.java
│   │   │   │
│   │   │   ├── vo/admin/                         # 响应体 VO
│   │   │   │   ├── AdminLoginVO.java             # 登录返回（token + 用户信息）
│   │   │   │   ├── AdminInfoVO.java
│   │   │   │   ├── AdminUserVO.java
│   │   │   │   ├── AdminCategoryVO.java
│   │   │   │   ├── AdminProductVO.java / AdminProductDetailVO.java
│   │   │   │   ├── AdminBannerVO.java
│   │   │   │   ├── AdminOrderVO.java / AdminOrderDetailVO.java
│   │   │   │   ├── AdminReviewVO.java
│   │   │   │   └── AdminDashboardVO.java
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── result/
│   │   │   │   │   ├── Result.java               # 统一响应封装 {code, message, data}
│   │   │   │   │   └── PageResult.java           # 分页响应 {list, total, page, pageSize}
│   │   │   │   ├── exception/
│   │   │   │   │   ├── BusinessException.java    # 业务异常
│   │   │   │   │   └── GlobalExceptionHandler.java # 全局异常处理器
│   │   │   │   └── util/
│   │   │   │       └── JwtUtil.java              # JWT 工具类
│   │   │   │
│   │   │   └── config/
│   │   │       ├── SecurityConfig.java           # Spring Security 配置
│   │   │       ├── JwtFilter.java                # JWT 认证过滤器
│   │   │       ├── MybatisPlusConfig.java        # 分页插件配置
│   │   │       └── MyMetaObjectHandler.java      # 自动填充 createTime/updateTime
│   │   │
│   │   └── resources/
│   │       ├── application.properties            # 应用配置
│   │       └── mapper/                           # MyBatis XML 映射文件（如有）
│   │
│   └── test/                                     # 测试类（含代码生成器）
│
└── pom.xml                                       # Maven 依赖管理
```

---

## 核心设计

### 1. API 路由规范

所有接口统一以 `/api` 为前缀：

| 路径前缀 | 用途 | 是否需要认证 |
|----------|------|-------------|
| `/api/admin/auth/**` | 登录接口 | 否（公开） |
| `/api/admin/**` | 后台管理接口 | 是（JWT） |
| `/api/mini/**` | 移动端接口 | 否（公开） |

### 2. 统一响应格式

所有接口均返回统一格式的 JSON：

```json
// 成功
{ "code": 200, "message": "success", "data": { ... } }

// 分页数据
{ "code": 200, "message": "success", "data": { "list": [...], "total": 100, "page": 1, "pageSize": 10 } }

// 失败
{ "code": 401, "message": "未登录或 Token 已失效", "data": null }
{ "code": 500, "message": "业务错误描述", "data": null }
```

### 3. JWT 认证流程

```
客户端登录 → POST /api/admin/auth/login
         ↓
    后端验证账号密码（BCrypt）
         ↓
    生成 JWT（包含 adminId + role，有效期 24 小时）
         ↓
    返回 token 给客户端
         ↓
    后续请求携带 Header: Authorization: Bearer <token>
         ↓
    JwtFilter 解析 token，注入 SecurityContext
         ↓
    Controller 通过 SecurityContextHolder 获取 adminId
```

**关键代码：**

```java
// JwtFilter 中获取 adminId
Long adminId = Long.valueOf(claims.getSubject());

// Controller 中获取当前登录管理员 ID
Long adminId = (Long) SecurityContextHolder.getContext()
                     .getAuthentication().getPrincipal();
```

### 4. MyBatis-Plus 核心特性使用

**软删除**：实体类加 `@TableLogic` 注解，删除操作自动转为 `UPDATE set is_deleted=1`

```java
@TableLogic
private Integer isDeleted;
```

**自动填充时间**：`MyMetaObjectHandler` 实现在 insert/update 时自动写入 `createTime`/`updateTime`

**Lambda 查询**（类型安全，无 SQL 字符串）：

```java
// 示例：条件查询 + 分页
Page<Product> page = lambdaQuery()
    .like(StringUtils.hasText(keyword), Product::getName, keyword)
    .eq(categoryId != null, Product::getCategoryId, categoryId)
    .orderByDesc(Product::getCreateTime)
    .page(new Page<>(pageNum, pageSize));
return PageResult.of(page.getRecords(), page.getTotal(), pageNum, pageSize);
```

**Service 继承 ServiceImpl**：直接继承即可获得 `save()`、`updateById()`、`removeById()`、`page()` 等通用方法

```java
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product>
        implements IProductService { ... }
```

### 5. 分层职责

| 层 | 职责 | 规范 |
|----|------|------|
| **Controller** | 接收请求，参数校验，调用 Service，返回 Result | 不写业务逻辑 |
| **Service** | 核心业务逻辑，事务控制 | 业务错误抛 `BusinessException` |
| **Mapper** | 数据库操作，继承 `BaseMapper` | 复杂查询写 XML |
| **Entity** | 与数据库表一一对应 | MyBatis-Plus 注解 |
| **DTO** | 接收前端传参（请求体） | 可加 `@Valid` 校验注解 |
| **VO** | 返回给前端的数据结构 | 按需组装，不暴露敏感字段 |

### 6. 异常处理机制

```
业务逻辑出错 → throw new BusinessException(code, message)
                        ↓
              GlobalExceptionHandler 统一捕获
                        ↓
              返回对应 code 的 Result.fail(...)
```

`GlobalExceptionHandler` 捕获三类异常：
- `BusinessException` → 返回自定义 code 和 message
- `MethodArgumentNotValidException` → 返回 400 参数校验错误
- `Exception` → 返回 500 服务器内部错误

---

## 数据库结构

数据库名：`ai_java_uniapp_market`，主要数据表：

| 表名 | 说明 |
|------|------|
| `admin` | 管理员账户 |
| `user` | 用户账户 |
| `category` | 商品分类（支持多级） |
| `product` | 商品信息 |
| `banner` | 首页轮播图 |
| `order` | 订单主表 |
| `order_item` | 订单商品明细 |
| `review` | 商品评论 |

所有表均含 `create_time`、`update_time`、`is_deleted` 字段，支持软删除。

完整 DDL 见项目根目录 `database.sql`。

---

## 整体系统架构

本模块是 ShopMal 全栈项目的后端部分，整体系统由三个子模块组成：

```
shopMal/
├── java-code/    # 本模块：Spring Boot 后端 API（端口 8080）
├── web-code/     # PC 后台管理前端，Vue 3 + Element Plus（端口 3100）
└── uni-code/     # 移动端小程序/APP，UniApp（待开发）
```

前端通过 Vite 开发代理将 `/api` 请求转发至后端 `localhost:8080`，生产环境通过 Nginx 反向代理配置。

---

## 学习要点总结

通过本项目可以学习到以下核心知识点：

1. **Spring Boot 3 + Spring Security 6** 的整合方式，无状态 JWT 认证配置
2. **MyBatis-Plus** 的 Lambda 查询、自动填充、分页插件、逻辑删除、代码生成器
3. **分层架构**设计（Controller → Service → Mapper），各层职责分离
4. **统一响应封装**和**全局异常处理**的实现模式
5. **DTO/VO 设计模式**：请求参数与响应体与实体类解耦
6. **Druid 连接池**的基本配置
7. **腾讯云 COS** 对象存储的文件上传集成
