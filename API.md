# 商城系统接口文档

> **版本**：v1.0.0
> **基准 URL**：`https://your-domain.com`
> **编写日期**：2026-03-10
> **编写范围**：后台管理端（Admin）接口
> 移动端小程序接口见后续章节补充

---

## 目录

- [约定规范](#约定规范)
- [一、认证模块](#一认证模块)
- [二、数据概览模块](#二数据概览模块)
- [三、管理员模块](#三管理员模块)
- [四、用户模块](#四用户模块)
- [五、商品分类模块](#五商品分类模块)
- [六、商品模块](#六商品模块)
- [七、轮播图模块](#七轮播图模块)
- [八、订单模块](#八订单模块)
- [九、评价模块](#九评价模块)
- [十、文件上传模块](#十文件上传模块)

---

## 约定规范

### 接口路径前缀

| 端         | 前缀              |
|-----------|-----------------|
| 后台管理端     | `/api/admin`    |
| 移动端小程序    | `/api/mini`     |

### 认证方式

所有需要鉴权的接口，请求 Header 中携带：

```
Authorization: Bearer <token>
```

Token 通过登录接口获取，失效后服务端返回 `401`，客户端应跳转至登录页。

### 统一响应结构

```json
{
  "code":    200,
  "message": "success",
  "data":    {}
}
```

| 字段      | 类型     | 说明                        |
|---------|--------|-----------------------------|
| code    | int    | 业务状态码，200 表示成功             |
| message | string | 状态描述，失败时为错误信息             |
| data    | any    | 业务数据，成功时有值，失败时为 null       |

### 常见业务状态码

| code  | 含义               |
|-------|------------------|
| 200   | 成功               |
| 400   | 请求参数错误           |
| 401   | 未登录或 Token 已失效   |
| 403   | 无权限              |
| 404   | 资源不存在            |
| 500   | 服务器内部错误          |

### 分页响应结构

分页列表接口的 `data` 字段格式统一为：

```json
{
  "list":     [],
  "total":    100,
  "page":     1,
  "pageSize": 10
}
```

### 时间格式

所有时间字段均为字符串，格式：`yyyy-MM-dd HH:mm:ss`

---

## 一、认证模块

> 路径前缀：`/api/admin/auth`
> 鉴权要求：**登录接口无需鉴权，其余需要**

---

### 1.1 管理员登录

**接口名称**：管理员登录
**接口功能**：验证账号密码，成功后返回 JWT Token
**请求方式**：`POST`
**请求路径**：`/api/admin/auth/login`
**鉴权**：不需要

**请求体（application/json）**

| 参数名      | 类型     | 必填 | 说明   |
|----------|--------|----|------|
| account  | string | 是  | 管理员账号 |
| password | string | 是  | 密码（明文，传输层 HTTPS 加密） |

**响应数据**

| 字段            | 类型     | 说明               |
|---------------|--------|------------------|
| token         | string | JWT Token         |
| adminInfo     | object | 管理员基本信息          |
| adminInfo.id       | long   | 管理员 ID           |
| adminInfo.account  | string | 账号               |
| adminInfo.nickname | string | 昵称               |
| adminInfo.role     | string | 角色 admin/super_admin |
| adminInfo.avatar   | string | 头像 URL           |

**示例**

请求：
```http
POST /api/admin/auth/login
Content-Type: application/json

{
  "account": "admin",
  "password": "123456"
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "adminInfo": {
      "id": 1,
      "account": "admin",
      "nickname": "超级管理员",
      "role": "super_admin",
      "avatar": "https://cdn.example.com/avatars/1.png"
    }
  }
}
```

---

### 1.2 管理员注销

**接口名称**：管理员注销
**接口功能**：使当前 Token 失效，退出登录
**请求方式**：`POST`
**请求路径**：`/api/admin/auth/logout`
**鉴权**：需要

**请求体**：无

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
POST /api/admin/auth/logout
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

### 1.3 获取当前管理员信息

**接口名称**：获取当前管理员信息
**接口功能**：返回当前已登录管理员的详细信息，用于前端导航栏展示
**请求方式**：`GET`
**请求路径**：`/api/admin/auth/me`
**鉴权**：需要

**请求参数**：无

**响应数据**

| 字段       | 类型     | 说明               |
|----------|--------|------------------|
| id       | long   | 管理员 ID           |
| account  | string | 账号               |
| nickname | string | 昵称               |
| role     | string | 角色               |
| avatar   | string | 头像 URL           |
| createTime | string | 创建时间           |

**示例**

请求：
```http
GET /api/admin/auth/me
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "account": "admin",
    "nickname": "超级管理员",
    "role": "super_admin",
    "avatar": "",
    "createTime": "2026-01-01 00:00:00"
  }
}
```

---

## 二、数据概览模块

> 路径前缀：`/api/admin/dashboard`
> 鉴权要求：**所有接口需要鉴权**

---

### 2.1 获取数据概览统计

**接口名称**：数据概览统计
**接口功能**：返回注册用户数、商品总数、订单总数、今日销售额，以及近7天订单量和销售额趋势数据
**请求方式**：`GET`
**请求路径**：`/api/admin/dashboard/stats`
**鉴权**：需要

**请求参数**：无

**响应数据**

| 字段              | 类型     | 说明              |
|-----------------|--------|-----------------|
| userCount       | long   | 注册用户总数          |
| productCount    | long   | 商品总数            |
| orderCount      | long   | 订单总数            |
| todaySales      | string | 今日销售额（元，保留2位小数） |
| orderTrend      | array  | 近7天订单量趋势        |
| orderTrend[].date   | string | 日期 MM/dd       |
| orderTrend[].count  | int    | 当日订单量           |
| salesTrend      | array  | 近7天销售额趋势        |
| salesTrend[].date   | string | 日期 MM/dd       |
| salesTrend[].amount | string | 当日销售额（元）        |
| recentOrders    | array  | 最近5条订单列表        |
| recentOrders[].orderNo     | string | 订单编号   |
| recentOrders[].contactName | string | 联系人    |
| recentOrders[].payAmount   | string | 实付金额   |
| recentOrders[].status      | int    | 订单状态   |
| recentOrders[].createTime  | string | 创建时间   |

**示例**

请求：
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userCount": 1286,
    "productCount": 342,
    "orderCount": 5021,
    "todaySales": "12480.00",
    "orderTrend": [
      { "date": "3/4", "count": 128 },
      { "date": "3/5", "count": 156 },
      { "date": "3/6", "count": 143 },
      { "date": "3/7", "count": 201 },
      { "date": "3/8", "count": 189 },
      { "date": "3/9", "count": 234 },
      { "date": "3/10", "count": 178 }
    ],
    "salesTrend": [
      { "date": "3/4", "amount": "8820.00" },
      { "date": "3/10", "amount": "12480.00" }
    ],
    "recentOrders": [
      {
        "orderNo": "ORD20260310001",
        "contactName": "张三",
        "payAmount": "199.00",
        "status": 1,
        "createTime": "2026-03-10 10:23:45"
      }
    ]
  }
}
```

---

## 三、管理员模块

> 路径前缀：`/api/admin/admins`
> 鉴权要求：**所有接口需要鉴权，敏感操作（删除/改密）需 super_admin 角色**

---

### 3.1 获取管理员列表

**接口名称**：获取管理员列表
**接口功能**：支持账号/昵称关键字搜索和角色筛选，分页返回管理员列表
**请求方式**：`GET`
**请求路径**：`/api/admin/admins`
**鉴权**：需要

**Query 参数**

| 参数名      | 类型     | 必填 | 说明                           |
|----------|--------|----|------------------------------|
| keyword  | string | 否  | 搜索关键字，匹配账号或昵称                |
| role     | string | 否  | 角色筛选：`admin` / `super_admin` |
| page     | int    | 否  | 页码，默认 1                      |
| pageSize | int    | 否  | 每页条数，默认 10，最大 100            |

**响应数据**：分页格式，`list` 元素结构如下

| 字段         | 类型     | 说明               |
|------------|--------|------------------|
| id         | long   | 管理员 ID           |
| account    | string | 账号               |
| nickname   | string | 昵称               |
| role       | string | 角色               |
| avatar     | string | 头像 URL           |
| createTime | string | 创建时间             |

**示例**

请求：
```http
GET /api/admin/admins?keyword=admin&role=super_admin&page=1&pageSize=10
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "account": "admin",
        "nickname": "超级管理员",
        "role": "super_admin",
        "avatar": "",
        "createTime": "2026-01-01 00:00:00"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 3.2 新增管理员

**接口名称**：新增管理员
**接口功能**：创建一个新管理员账号
**请求方式**：`POST`
**请求路径**：`/api/admin/admins`
**鉴权**：需要（super_admin）

**请求体（application/json）**

| 参数名      | 类型     | 必填 | 说明                           |
|----------|--------|----|------------------------------|
| account  | string | 是  | 账号，唯一，4-32 位字母数字             |
| password | string | 是  | 初始密码，6-32 位                  |
| nickname | string | 否  | 昵称                           |
| role     | string | 是  | 角色：`admin` / `super_admin`   |
| avatar   | string | 否  | 头像 URL                       |

**响应数据**

| 字段 | 类型   | 说明         |
|----|------|------------|
| id | long | 新创建的管理员 ID |

**示例**

请求：
```http
POST /api/admin/admins
Authorization: Bearer <token>
Content-Type: application/json

{
  "account": "editor02",
  "password": "Abc@1234",
  "nickname": "内容编辑2",
  "role": "admin",
  "avatar": ""
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": { "id": 4 }
}
```

---

### 3.3 修改管理员信息

**接口名称**：修改管理员信息
**接口功能**：修改指定管理员的账号、昵称、头像、角色（不含密码）
**请求方式**：`PUT`
**请求路径**：`/api/admin/admins/{id}`
**鉴权**：需要（super_admin）

**路径参数**

| 参数名 | 类型   | 说明      |
|----|------|---------|
| id | long | 管理员 ID  |

**请求体（application/json）**

| 参数名      | 类型     | 必填 | 说明   |
|----------|--------|----|------|
| account  | string | 是  | 账号   |
| nickname | string | 否  | 昵称   |
| role     | string | 是  | 角色   |
| avatar   | string | 否  | 头像 URL |

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
PUT /api/admin/admins/2
Authorization: Bearer <token>
Content-Type: application/json

{
  "account": "manager01",
  "nickname": "运营总监",
  "role": "admin",
  "avatar": "https://cdn.example.com/avatars/2.png"
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

### 3.4 删除管理员

**接口名称**：删除管理员
**接口功能**：软删除指定管理员（is_deleted = 1），不可删除自身账号
**请求方式**：`DELETE`
**请求路径**：`/api/admin/admins/{id}`
**鉴权**：需要（super_admin）

**路径参数**

| 参数名 | 类型   | 说明     |
|----|------|--------|
| id | long | 管理员 ID |

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
DELETE /api/admin/admins/3
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

### 3.5 重置管理员密码

**接口名称**：重置管理员密码
**接口功能**：为指定管理员重置登录密码
**请求方式**：`PUT`
**请求路径**：`/api/admin/admins/{id}/password`
**鉴权**：需要（super_admin）

**路径参数**

| 参数名 | 类型   | 说明     |
|----|------|--------|
| id | long | 管理员 ID |

**请求体（application/json）**

| 参数名         | 类型     | 必填 | 说明          |
|-------------|--------|----|-------------|
| newPassword | string | 是  | 新密码，6-32 位  |

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
PUT /api/admin/admins/2/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "newPassword": "NewPass@2026"
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 四、用户模块

> 路径前缀：`/api/admin/users`
> 鉴权要求：**所有接口需要鉴权**

---

### 4.1 获取用户列表

**接口名称**：获取用户列表
**接口功能**：支持账号/昵称关键字搜索，分页返回注册用户列表
**请求方式**：`GET`
**请求路径**：`/api/admin/users`
**鉴权**：需要

**Query 参数**

| 参数名      | 类型     | 必填 | 说明                   |
|----------|--------|----|----------------------|
| keyword  | string | 否  | 搜索关键字，匹配账号或昵称        |
| page     | int    | 否  | 页码，默认 1              |
| pageSize | int    | 否  | 每页条数，默认 10，最大 100    |

**响应数据**：分页格式，`list` 元素结构如下

| 字段         | 类型     | 说明                |
|------------|--------|-------------------|
| id         | long   | 用户 ID             |
| avatar     | string | 头像 URL            |
| nickname   | string | 昵称                |
| account    | string | 账号，可为 null（微信用户）  |
| openid     | string | 微信 OpenID，可为 null |
| createTime | string | 注册时间              |

**示例**

请求：
```http
GET /api/admin/users?keyword=小明&page=1&pageSize=10
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "avatar": "https://cdn.example.com/avatars/u1.png",
        "nickname": "小明",
        "account": "user001",
        "openid": "oXXXX_abc123def456",
        "createTime": "2026-03-01 08:30:00"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 4.2 删除用户

**接口名称**：删除用户
**接口功能**：软删除指定用户（is_deleted = 1）
**请求方式**：`DELETE`
**请求路径**：`/api/admin/users/{id}`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 用户 ID |

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
DELETE /api/admin/users/2
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 五、商品分类模块

> 路径前缀：`/api/admin/categories`
> 鉴权要求：**所有接口需要鉴权**

---

### 5.1 获取分类列表

**接口名称**：获取商品分类列表
**接口功能**：返回全部分类，按 sort 升序排列
**请求方式**：`GET`
**请求路径**：`/api/admin/categories`
**鉴权**：需要

**请求参数**：无

**响应数据**：数组，元素结构如下

| 字段          | 类型      | 说明              |
|-------------|---------|-----------------|
| id          | long    | 分类 ID           |
| name        | string  | 分类名称            |
| image       | string  | 分类图片 URL        |
| sort        | int     | 排序值（升序）         |
| showOnHome  | boolean | 是否在首页展示         |
| createTime  | string  | 创建时间            |

**示例**

请求：
```http
GET /api/admin/categories
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "手机数码",
      "image": "https://cdn.example.com/cat/1.png",
      "sort": 1,
      "showOnHome": true,
      "createTime": "2026-01-01 00:00:00"
    }
  ]
}
```

---

### 5.2 新增分类

**接口名称**：新增商品分类
**接口功能**：创建一个新的商品分类
**请求方式**：`POST`
**请求路径**：`/api/admin/categories`
**鉴权**：需要

**请求体（application/json）**

| 参数名        | 类型      | 必填 | 说明       |
|------------|---------|----|----|
| name       | string  | 是  | 分类名称     |
| image      | string  | 否  | 分类图片 URL |
| sort       | int     | 否  | 排序值，默认 0 |
| showOnHome | boolean | 否  | 是否首页展示，默认 false |

**响应数据**

| 字段 | 类型   | 说明         |
|----|------|------------|
| id | long | 新创建的分类 ID  |

**示例**

请求：
```http
POST /api/admin/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "运动户外",
  "image": "https://cdn.example.com/cat/5.png",
  "sort": 5,
  "showOnHome": true
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": { "id": 5 }
}
```

---

### 5.3 修改分类

**接口名称**：修改商品分类
**接口功能**：修改指定分类的名称、图片、排序和首页展示状态
**请求方式**：`PUT`
**请求路径**：`/api/admin/categories/{id}`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 分类 ID |

**请求体（application/json）**

| 参数名        | 类型      | 必填 | 说明       |
|------------|---------|----|----|
| name       | string  | 是  | 分类名称     |
| image      | string  | 否  | 分类图片 URL |
| sort       | int     | 否  | 排序值       |
| showOnHome | boolean | 否  | 是否首页展示   |

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
PUT /api/admin/categories/3
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "食品生鲜",
  "image": "https://cdn.example.com/cat/3.png",
  "sort": 3,
  "showOnHome": true
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

### 5.4 删除分类

**接口名称**：删除商品分类
**接口功能**：软删除指定分类；若该分类下存在未下架商品，则拒绝删除
**请求方式**：`DELETE`
**请求路径**：`/api/admin/categories/{id}`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 分类 ID |

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
DELETE /api/admin/categories/4
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 六、商品模块

> 路径前缀：`/api/admin/products`
> 鉴权要求：**所有接口需要鉴权**

---

### 6.1 获取商品列表

**接口名称**：获取商品列表
**接口功能**：支持名称搜索、上架状态和分类筛选，分页返回商品列表
**请求方式**：`GET`
**请求路径**：`/api/admin/products`
**鉴权**：需要

**Query 参数**

| 参数名        | 类型     | 必填 | 说明                  |
|------------|--------|----|---------------------|
| keyword    | string | 否  | 搜索关键字，匹配商品名称        |
| status     | int    | 否  | 上架状态：`0` 下架 / `1` 上架 |
| categoryId | long   | 否  | 分类 ID 筛选            |
| page       | int    | 否  | 页码，默认 1             |
| pageSize   | int    | 否  | 每页条数，默认 10          |

**响应数据**：分页格式，`list` 元素结构如下

| 字段          | 类型     | 说明                 |
|-------------|--------|---------------------|
| id          | long   | 商品 ID               |
| name        | string | 商品名称               |
| cover       | string | 封面图 URL             |
| price       | string | 现价（元）              |
| originPrice | string | 原价（元），可为 null      |
| stock       | int    | 库存                  |
| sales       | int    | 销量                  |
| views       | int    | 浏览量                 |
| status      | int    | 状态：0 下架 / 1 上架     |
| isRecommend | int    | 是否推荐：0 否 / 1 是      |
| categoryId  | long   | 分类 ID，可为 null       |
| createTime  | string | 创建时间               |

**示例**

请求：
```http
GET /api/admin/products?keyword=iPhone&status=1&categoryId=1&page=1&pageSize=10
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "iPhone 15 Pro 256G 深空黑",
        "cover": "https://cdn.example.com/products/1.jpg",
        "price": "8999.00",
        "originPrice": "9499.00",
        "stock": 58,
        "sales": 120,
        "views": 3820,
        "status": 1,
        "isRecommend": 1,
        "categoryId": 1,
        "createTime": "2026-02-15 10:00:00"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 6.2 获取商品详情

**接口名称**：获取商品详情
**接口功能**：返回指定商品的完整信息，包含详情图列表和规格信息
**请求方式**：`GET`
**请求路径**：`/api/admin/products/{id}`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 商品 ID |

**响应数据**

| 字段          | 类型     | 说明                          |
|-------------|--------|------------------------------|
| id          | long   | 商品 ID                        |
| name        | string | 商品名称                        |
| cover       | string | 封面图 URL                      |
| detailImgs  | array  | 详情图 URL 列表                  |
| price       | string | 现价                           |
| originPrice | string | 原价，可为 null                   |
| stock       | int    | 库存                           |
| sales       | int    | 销量                           |
| views       | int    | 浏览量                          |
| status      | int    | 状态                           |
| isRecommend | int    | 是否推荐                         |
| description | string | 商品描述，可为 null                 |
| categoryId  | long   | 分类 ID，可为 null                |
| specs       | object | 规格信息，如 `{"颜色":["黑","白"]}` |
| createTime  | string | 创建时间                        |
| updateTime  | string | 更新时间                        |

**示例**

请求：
```http
GET /api/admin/products/1
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro 256G 深空黑",
    "cover": "https://cdn.example.com/products/1.jpg",
    "detailImgs": [
      "https://cdn.example.com/products/1_d1.jpg",
      "https://cdn.example.com/products/1_d2.jpg"
    ],
    "price": "8999.00",
    "originPrice": "9499.00",
    "stock": 58,
    "sales": 120,
    "views": 3820,
    "status": 1,
    "isRecommend": 1,
    "description": "最新款 iPhone，搭载 A17 Pro 芯片",
    "categoryId": 1,
    "specs": {
      "颜色": ["深空黑", "原色钛金属", "白色钛金属"],
      "容量": ["256G", "512G", "1T"]
    },
    "createTime": "2026-02-15 10:00:00",
    "updateTime": "2026-03-01 09:00:00"
  }
}
```

---

### 6.3 新增商品

**接口名称**：新增商品
**接口功能**：创建一个新商品
**请求方式**：`POST`
**请求路径**：`/api/admin/products`
**鉴权**：需要

**请求体（application/json）**

| 参数名         | 类型     | 必填 | 说明                            |
|-------------|--------|----|-------------------------------|
| name        | string | 是  | 商品名称                          |
| cover       | string | 是  | 封面图 URL                        |
| price       | number | 是  | 现价（元）                          |
| originPrice | number | 否  | 原价（元）                          |
| stock       | int    | 是  | 库存                             |
| description | string | 否  | 商品描述                          |
| categoryId  | long   | 否  | 分类 ID                          |
| detailImgs  | array  | 否  | 详情图 URL 列表                    |
| specs       | object | 否  | 规格信息 JSON，如 `{"颜色":["黑","白"]}` |
| status      | int    | 否  | 状态：0 下架 / 1 上架，默认 1           |
| isRecommend | int    | 否  | 是否推荐：0 / 1，默认 0               |

**响应数据**

| 字段 | 类型   | 说明         |
|----|------|------------|
| id | long | 新创建的商品 ID  |

**示例**

请求：
```http
POST /api/admin/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "华为 Mate 60 Pro 512G",
  "cover": "https://cdn.example.com/products/5.jpg",
  "price": 6999.00,
  "originPrice": 7499.00,
  "stock": 100,
  "description": "华为最新旗舰，支持卫星通话",
  "categoryId": 1,
  "detailImgs": ["https://cdn.example.com/products/5_d1.jpg"],
  "specs": { "颜色": ["黑色", "白色"], "容量": ["512G"] },
  "status": 1,
  "isRecommend": 1
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": { "id": 5 }
}
```

---

### 6.4 修改商品

**接口名称**：修改商品
**接口功能**：修改指定商品的所有可编辑字段
**请求方式**：`PUT`
**请求路径**：`/api/admin/products/{id}`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 商品 ID |

**请求体（application/json）**：字段同新增商品（除 `stock` 必填外，其余同新增）

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
PUT /api/admin/products/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro 256G 深空黑",
  "cover": "https://cdn.example.com/products/1.jpg",
  "price": 8799.00,
  "originPrice": 9499.00,
  "stock": 45,
  "status": 1,
  "isRecommend": 1,
  "categoryId": 1
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

### 6.5 删除商品

**接口名称**：删除商品
**接口功能**：软删除指定商品（自动下架）
**请求方式**：`DELETE`
**请求路径**：`/api/admin/products/{id}`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 商品 ID |

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
DELETE /api/admin/products/4
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 七、轮播图模块

> 路径前缀：`/api/admin/banners`
> 鉴权要求：**所有接口需要鉴权**

---

### 7.1 获取轮播图列表

**接口名称**：获取轮播图列表
**接口功能**：返回所有轮播图，按创建时间倒序
**请求方式**：`GET`
**请求路径**：`/api/admin/banners`
**鉴权**：需要

**请求参数**：无

**响应数据**：数组，元素结构如下

| 字段          | 类型     | 说明             |
|-------------|--------|----------------|
| id          | long   | 轮播图 ID         |
| title       | string | 标题             |
| cover       | string | 封面图 URL        |
| productId   | long   | 关联商品 ID，可为 null |
| createTime  | string | 创建时间           |

**示例**

请求：
```http
GET /api/admin/banners
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "春季新品大促",
      "cover": "https://cdn.example.com/banners/1.jpg",
      "productId": null,
      "createTime": "2026-03-01 10:00:00"
    },
    {
      "id": 2,
      "title": "iPhone 15 Pro 特惠",
      "cover": "https://cdn.example.com/banners/2.jpg",
      "productId": 1,
      "createTime": "2026-03-05 14:00:00"
    }
  ]
}
```

---

### 7.2 新增轮播图

**接口名称**：新增轮播图
**接口功能**：创建一条新的轮播图记录
**请求方式**：`POST`
**请求路径**：`/api/admin/banners`
**鉴权**：需要

**请求体（application/json）**

| 参数名       | 类型     | 必填 | 说明             |
|-----------|--------|----|----------------|
| title     | string | 是  | 标题             |
| cover     | string | 是  | 封面图 URL        |
| productId | long   | 否  | 关联商品 ID        |

**响应数据**

| 字段 | 类型   | 说明          |
|----|------|-------------|
| id | long | 新创建的轮播图 ID  |

**示例**

请求：
```http
POST /api/admin/banners
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "五一大促活动",
  "cover": "https://cdn.example.com/banners/4.jpg",
  "productId": null
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": { "id": 4 }
}
```

---

### 7.3 修改轮播图

**接口名称**：修改轮播图
**接口功能**：修改指定轮播图的标题、封面图和关联商品
**请求方式**：`PUT`
**请求路径**：`/api/admin/banners/{id}`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明     |
|----|------|--------|
| id | long | 轮播图 ID |

**请求体（application/json）**：字段同新增轮播图

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
PUT /api/admin/banners/2
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "iPhone 15 Pro 限时特惠",
  "cover": "https://cdn.example.com/banners/2_new.jpg",
  "productId": 1
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

### 7.4 删除轮播图

**接口名称**：删除轮播图
**接口功能**：软删除指定轮播图
**请求方式**：`DELETE`
**请求路径**：`/api/admin/banners/{id}`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明     |
|----|------|--------|
| id | long | 轮播图 ID |

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
DELETE /api/admin/banners/3
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 八、订单模块

> 路径前缀：`/api/admin/orders`
> 鉴权要求：**所有接口需要鉴权**

---

### 8.1 获取订单列表

**接口名称**：获取订单列表
**接口功能**：支持订单编号搜索和状态筛选，按创建时间倒序分页返回
**请求方式**：`GET`
**请求路径**：`/api/admin/orders`
**鉴权**：需要

**Query 参数**

| 参数名      | 类型     | 必填 | 说明                                          |
|----------|--------|----|---------------------------------------------|
| orderNo  | string | 否  | 订单编号（模糊匹配）                                  |
| status   | int    | 否  | 订单状态：0 待支付 / 1 待发货 / 2 待收货 / 3 已完成 / 4 退款售后 |
| page     | int    | 否  | 页码，默认 1                                      |
| pageSize | int    | 否  | 每页条数，默认 10                                   |

**响应数据**：分页格式，`list` 元素结构如下

| 字段             | 类型     | 说明             |
|----------------|--------|----------------|
| id             | long   | 订单 ID          |
| userId         | long   | 用户 ID          |
| orderNo        | string | 订单编号           |
| contactName    | string | 联系人            |
| contactPhone   | string | 联系电话           |
| totalAmount    | string | 订单原始金额（元）      |
| discountAmount | string | 优惠金额（元）        |
| payAmount      | string | 实付金额（元）        |
| status         | int    | 订单状态           |
| address        | string | 收货地址           |
| remark         | string | 订单备注，可为 null   |
| createTime     | string | 创建时间           |

**示例**

请求：
```http
GET /api/admin/orders?status=1&page=1&pageSize=10
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 1,
        "orderNo": "ORD20260310001",
        "contactName": "张三",
        "contactPhone": "13800138001",
        "totalAmount": "299.00",
        "discountAmount": "100.00",
        "payAmount": "199.00",
        "status": 1,
        "address": "北京市朝阳区建国路88号",
        "remark": "请尽快发货",
        "createTime": "2026-03-10 10:23:45"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 8.2 获取订单详情

**接口名称**：获取订单详情
**接口功能**：返回指定订单的完整信息，包含商品明细列表
**请求方式**：`GET`
**请求路径**：`/api/admin/orders/{id}`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 订单 ID |

**响应数据**

在列表字段基础上，额外包含：

| 字段                         | 类型     | 说明              |
|----------------------------|--------|-----------------|
| orderItems                 | array  | 商品明细列表          |
| orderItems[].name          | string | 商品名称            |
| orderItems[].spec          | string | 规格描述，可为 null    |
| orderItems[].price         | number | 单价（元）           |
| orderItems[].qty           | int    | 数量              |

**示例**

请求：
```http
GET /api/admin/orders/1
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "userId": 1,
    "orderNo": "ORD20260310001",
    "contactName": "张三",
    "contactPhone": "13800138001",
    "totalAmount": "299.00",
    "discountAmount": "100.00",
    "payAmount": "199.00",
    "status": 1,
    "address": "北京市朝阳区建国路88号",
    "remark": "请尽快发货",
    "createTime": "2026-03-10 10:23:45",
    "orderItems": [
      {
        "name": "iPhone 15 Pro 256G",
        "spec": "深空黑",
        "price": 299.00,
        "qty": 1
      }
    ]
  }
}
```

---

### 8.3 更新订单状态

**接口名称**：更新订单状态
**接口功能**：手动推进订单状态，如发货（1→2）、确认完成（2→3）、处理退款（→4）
**请求方式**：`PUT`
**请求路径**：`/api/admin/orders/{id}/status`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 订单 ID |

**请求体（application/json）**

| 参数名    | 类型  | 必填 | 说明                                         |
|--------|-----|----|----------------------------------------------|
| status | int | 是  | 目标状态：0 待支付 / 1 待发货 / 2 待收货 / 3 已完成 / 4 退款售后 |

**响应数据**：`data` 为 `null`

**示例**

请求（发货操作）：
```http
PUT /api/admin/orders/1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": 2
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 九、评价模块

> 路径前缀：`/api/admin/reviews`
> 鉴权要求：**所有接口需要鉴权**

---

### 9.1 获取评价列表

**接口名称**：获取评价列表
**接口功能**：支持评分筛选，按创建时间倒序分页返回评价列表
**请求方式**：`GET`
**请求路径**：`/api/admin/reviews`
**鉴权**：需要

**Query 参数**

| 参数名      | 类型   | 必填 | 说明              |
|----------|------|----|-----------------|
| rating   | int  | 否  | 评分筛选：1 ~ 5      |
| productId | long | 否  | 按商品 ID 筛选       |
| page     | int  | 否  | 页码，默认 1         |
| pageSize | int  | 否  | 每页条数，默认 10      |

**响应数据**：分页格式，`list` 元素结构如下

| 字段         | 类型     | 说明             |
|------------|--------|----------------|
| id         | long   | 评价 ID          |
| userId     | long   | 用户 ID          |
| productId  | long   | 商品 ID          |
| orderId    | long   | 订单 ID          |
| rating     | int    | 评分（1-5）        |
| content    | string | 评价内容，可为 null   |
| images     | array  | 评价图片 URL 列表    |
| createTime | string | 创建时间           |

**示例**

请求：
```http
GET /api/admin/reviews?rating=5&page=1&pageSize=10
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 1,
        "productId": 1,
        "orderId": 3,
        "rating": 5,
        "content": "手机质量非常好，拍照效果很棒！物流也很快，很满意这次购物。",
        "images": [
          "https://cdn.example.com/reviews/1_1.jpg",
          "https://cdn.example.com/reviews/1_2.jpg"
        ],
        "createTime": "2026-03-10 11:00:00"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 9.2 删除评价

**接口名称**：删除评价
**接口功能**：软删除指定评价（违规内容处理）
**请求方式**：`DELETE`
**请求路径**：`/api/admin/reviews/{id}`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 评价 ID |

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
DELETE /api/admin/reviews/3
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 十、文件上传模块

> 路径前缀：`/api/admin/upload`
> 鉴权要求：**需要鉴权**

---

### 10.1 上传文件

**接口名称**：上传文件
**接口功能**：上传图片等文件至腾讯云 COS，返回可访问的公网 URL
**请求方式**：`POST`
**请求路径**：`/api/admin/upload`
**鉴权**：需要

**请求体（multipart/form-data）**

| 参数名  | 类型   | 必填 | 说明                       |
|------|------|----|--------------------------|
| file | File | 是  | 上传的文件，支持 jpg/png/webp/gif，最大 10MB |

**响应数据**

| 字段  | 类型     | 说明              |
|-----|--------|-----------------|
| url | string | 文件公网访问 URL      |

**示例**

请求：
```http
POST /api/admin/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data; boundary=----FormBoundary

------FormBoundary
Content-Disposition: form-data; name="file"; filename="cover.jpg"
Content-Type: image/jpeg

<binary data>
------FormBoundary--
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260310/abc123def456abc.jpg"
  }
}
```

---

## 附录：接口汇总

| 序号 | 方法     | 路径                              | 功能            | 鉴权       |
|----|--------|----------------------------------|---------------|----------|
| 1  | POST   | /api/admin/auth/login            | 管理员登录         | ❌        |
| 2  | POST   | /api/admin/auth/logout           | 管理员注销         | ✅        |
| 3  | GET    | /api/admin/auth/me               | 获取当前管理员信息     | ✅        |
| 4  | GET    | /api/admin/dashboard/stats       | 数据概览统计        | ✅        |
| 5  | GET    | /api/admin/admins                | 获取管理员列表       | ✅        |
| 6  | POST   | /api/admin/admins                | 新增管理员         | ✅ super  |
| 7  | PUT    | /api/admin/admins/{id}           | 修改管理员信息       | ✅ super  |
| 8  | DELETE | /api/admin/admins/{id}           | 删除管理员         | ✅ super  |
| 9  | PUT    | /api/admin/admins/{id}/password  | 重置管理员密码       | ✅ super  |
| 10 | GET    | /api/admin/users                 | 获取用户列表        | ✅        |
| 11 | DELETE | /api/admin/users/{id}            | 删除用户          | ✅        |
| 12 | GET    | /api/admin/categories            | 获取分类列表        | ✅        |
| 13 | POST   | /api/admin/categories            | 新增分类          | ✅        |
| 14 | PUT    | /api/admin/categories/{id}       | 修改分类          | ✅        |
| 15 | DELETE | /api/admin/categories/{id}       | 删除分类          | ✅        |
| 16 | GET    | /api/admin/products              | 获取商品列表        | ✅        |
| 17 | GET    | /api/admin/products/{id}         | 获取商品详情        | ✅        |
| 18 | POST   | /api/admin/products              | 新增商品          | ✅        |
| 19 | PUT    | /api/admin/products/{id}         | 修改商品          | ✅        |
| 20 | DELETE | /api/admin/products/{id}         | 删除商品          | ✅        |
| 21 | GET    | /api/admin/banners               | 获取轮播图列表       | ✅        |
| 22 | POST   | /api/admin/banners               | 新增轮播图         | ✅        |
| 23 | PUT    | /api/admin/banners/{id}          | 修改轮播图         | ✅        |
| 24 | DELETE | /api/admin/banners/{id}          | 删除轮播图         | ✅        |
| 25 | GET    | /api/admin/orders                | 获取订单列表        | ✅        |
| 26 | GET    | /api/admin/orders/{id}           | 获取订单详情        | ✅        |
| 27 | PUT    | /api/admin/orders/{id}/status    | 更新订单状态        | ✅        |
| 28 | GET    | /api/admin/reviews               | 获取评价列表        | ✅        |
| 29 | DELETE | /api/admin/reviews/{id}          | 删除评价          | ✅        |
| 30 | POST   | /api/admin/upload                | 上传文件          | ✅        |

---
---

# 商城小程序移动端接口文档

> **版本**：v1.0.0
> **基准 URL**：`https://your-domain.com`
> **编写日期**：2026-03-11
> **编写范围**：移动端小程序（Mini）接口

---

## 目录

- [约定规范（移动端）](#约定规范移动端)
- [十一、认证模块](#十一认证模块)
- [十二、用户模块](#十二用户模块)
- [十三、首页模块](#十三首页模块)
- [十四、分类模块](#十四分类模块)
- [十五、商品模块](#十五商品模块)
- [十六、订单模块](#十六订单模块)
- [十七、评价模块](#十七评价模块)
- [十八、文件上传模块](#十八文件上传模块)

---

## 约定规范（移动端）

### 接口路径前缀

| 端       | 前缀          |
|----------|---------------|
| 移动端小程序 | `/api/mini`  |

### 认证方式

与后台管理端一致，需要鉴权的接口在请求 Header 中携带：

```
Authorization: Bearer <token>
```

Token 通过登录 / 注册接口获取。Token 失效后服务端返回 `401`，客户端应跳转至登录页。

### 统一响应结构

与后台管理端一致：

```json
{
  "code":    200,
  "message": "success",
  "data":    {}
}
```

### 分页响应结构

分页列表接口的 `data` 字段格式统一为：

```json
{
  "list":     [],
  "total":    100,
  "page":     1,
  "pageSize": 10
}
```

### 时间格式

所有时间字段均为字符串，格式：`yyyy-MM-dd HH:mm:ss`

### 购物车与地址管理说明

购物车数据和收货地址数据均通过客户端本地缓存（`uni.setStorageSync`）管理，**不提供后端接口**。

---

## 十一、认证模块

> 路径前缀：`/api/mini/auth`
> 鉴权要求：**登录和注册接口无需鉴权，其余需要**

---

### 11.1 用户登录

**接口名称**：用户登录
**接口功能**：验证账号密码，成功后返回 JWT Token 和用户信息
**请求方式**：`POST`
**请求路径**：`/api/mini/auth/login`
**鉴权**：不需要

**请求体（application/json）**

| 参数名     | 类型     | 必填 | 说明                       |
|----------|--------|----|--------------------------|
| account  | string | 是  | 用户账号                     |
| password | string | 是  | 密码（明文，传输层 HTTPS 加密）      |

**响应数据**

| 字段                | 类型     | 说明            |
|-------------------|--------|---------------|
| token             | string | JWT Token     |
| userInfo          | object | 用户基本信息        |
| userInfo.id       | long   | 用户 ID         |
| userInfo.account  | string | 账号            |
| userInfo.nickname | string | 昵称            |
| userInfo.avatar   | string | 头像 URL        |
| userInfo.createTime | string | 注册时间        |

**示例**

请求：
```http
POST /api/mini/auth/login
Content-Type: application/json

{
  "account": "user001",
  "password": "123456"
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "account": "user001",
      "nickname": "小明",
      "avatar": "https://cdn.example.com/avatars/u1.png",
      "createTime": "2026-03-01 08:30:00"
    }
  }
}
```

---

### 11.2 用户注册

**接口名称**：用户注册
**接口功能**：创建新用户账号，成功后自动登录并返回 JWT Token
**请求方式**：`POST`
**请求路径**：`/api/mini/auth/register`
**鉴权**：不需要

**请求体（application/json）**

| 参数名      | 类型     | 必填 | 说明                  |
|----------|--------|----|---------------------|
| account  | string | 是  | 账号，唯一，4-32 位字母数字    |
| nickname | string | 是  | 昵称，2-32 位           |
| password | string | 是  | 密码，6-32 位           |

**响应数据**

| 字段                | 类型     | 说明         |
|-------------------|--------|------------|
| token             | string | JWT Token  |
| userInfo          | object | 用户基本信息     |
| userInfo.id       | long   | 用户 ID      |
| userInfo.account  | string | 账号         |
| userInfo.nickname | string | 昵称         |
| userInfo.avatar   | string | 头像 URL     |
| userInfo.createTime | string | 注册时间     |

**示例**

请求：
```http
POST /api/mini/auth/register
Content-Type: application/json

{
  "account": "user002",
  "nickname": "小红",
  "password": "Abc@1234"
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 2,
      "account": "user002",
      "nickname": "小红",
      "avatar": "",
      "createTime": "2026-03-11 10:00:00"
    }
  }
}
```

---

### 11.3 用户登出

**接口名称**：用户登出
**接口功能**：使当前 Token 失效，退出登录
**请求方式**：`POST`
**请求路径**：`/api/mini/auth/logout`
**鉴权**：需要

**请求体**：无

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
POST /api/mini/auth/logout
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 十二、用户模块

> 路径前缀：`/api/mini/user`
> 鉴权要求：**所有接口需要鉴权**

---

### 12.1 获取当前用户信息

**接口名称**：获取当前用户信息
**接口功能**：返回当前已登录用户的详细信息，用于个人中心页展示
**请求方式**：`GET`
**请求路径**：`/api/mini/user/profile`
**鉴权**：需要

**请求参数**：无

**响应数据**

| 字段         | 类型     | 说明            |
|------------|--------|---------------|
| id         | long   | 用户 ID         |
| account    | string | 账号            |
| nickname   | string | 昵称            |
| avatar     | string | 头像 URL        |
| createTime | string | 注册时间          |

**示例**

请求：
```http
GET /api/mini/user/profile
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "account": "user001",
    "nickname": "小明",
    "avatar": "https://cdn.example.com/avatars/u1.png",
    "createTime": "2026-03-01 08:30:00"
  }
}
```

---

### 12.2 修改用户信息

**接口名称**：修改用户信息
**接口功能**：修改当前用户的昵称和头像
**请求方式**：`PUT`
**请求路径**：`/api/mini/user/profile`
**鉴权**：需要

**请求体（application/json）**

| 参数名      | 类型     | 必填 | 说明      |
|----------|--------|----|---------|
| nickname | string | 否  | 昵称      |
| avatar   | string | 否  | 头像 URL  |

**响应数据**：`data` 为 `null`

**示例**

请求：
```http
PUT /api/mini/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "nickname": "小明同学",
  "avatar": "https://cdn.example.com/avatars/u1_new.png"
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

### 12.3 获取用户订单统计

**接口名称**：获取用户订单统计
**接口功能**：返回当前用户各状态的订单数量，用于个人中心页订单入口角标展示
**请求方式**：`GET`
**请求路径**：`/api/mini/user/order-stats`
**鉴权**：需要

**请求参数**：无

**响应数据**

| 字段              | 类型  | 说明      |
|-----------------|-----|---------|
| pendingPayment  | int | 待支付数量   |
| pendingDelivery | int | 待发货数量   |
| pendingReceive  | int | 待收货数量   |
| completed       | int | 已完成数量   |
| refunding       | int | 退款售后数量  |

**示例**

请求：
```http
GET /api/mini/user/order-stats
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "pendingPayment": 0,
    "pendingDelivery": 2,
    "pendingReceive": 1,
    "completed": 15,
    "refunding": 0
  }
}
```

---

## 十三、首页模块

> 路径前缀：`/api/mini/home`
> 鉴权要求：**所有接口无需鉴权**

---

### 13.1 获取首页数据

**接口名称**：获取首页数据
**接口功能**：一次性返回首页所需的轮播图、分类导航和推荐商品列表，减少请求次数
**请求方式**：`GET`
**请求路径**：`/api/mini/home/data`
**鉴权**：不需要

**请求参数**：无

**响应数据**

| 字段                       | 类型      | 说明               |
|--------------------------|---------|------------------|
| banners                  | array   | 轮播图列表            |
| banners[].id             | long    | 轮播图 ID           |
| banners[].title          | string  | 标题               |
| banners[].cover          | string  | 图片 URL           |
| banners[].productId      | long    | 关联商品 ID，可为 null  |
| categories               | array   | 首页分类导航（showOnHome = true） |
| categories[].id          | long    | 分类 ID            |
| categories[].name        | string  | 分类名称             |
| categories[].image       | string  | 分类图标 URL         |
| recommendProducts        | array   | 推荐商品列表           |
| recommendProducts[].id          | long    | 商品 ID      |
| recommendProducts[].name        | string  | 商品名称       |
| recommendProducts[].cover       | string  | 封面图 URL    |
| recommendProducts[].price       | string  | 现价（元）      |
| recommendProducts[].originPrice | string  | 原价（元），可为 null |
| recommendProducts[].sales       | int     | 销量          |
| recommendProducts[].isRecommend | int     | 是否推荐：0 否 / 1 是 |

**示例**

请求：
```http
GET /api/mini/home/data
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "banners": [
      {
        "id": 1,
        "title": "春季新品大促",
        "cover": "https://cdn.example.com/banners/1.jpg",
        "productId": null
      },
      {
        "id": 2,
        "title": "iPhone 15 Pro 特惠",
        "cover": "https://cdn.example.com/banners/2.jpg",
        "productId": 1
      }
    ],
    "categories": [
      {
        "id": 1,
        "name": "手机数码",
        "image": "https://cdn.example.com/cat/1.png"
      },
      {
        "id": 2,
        "name": "电脑办公",
        "image": "https://cdn.example.com/cat/2.png"
      }
    ],
    "recommendProducts": [
      {
        "id": 1,
        "name": "iPhone 15 Pro 256G 深空黑",
        "cover": "https://cdn.example.com/products/1.jpg",
        "price": "8999.00",
        "originPrice": "9499.00",
        "sales": 120,
        "isRecommend": 1
      },
      {
        "id": 2,
        "name": "华为 Mate 60 Pro",
        "cover": "https://cdn.example.com/products/2.jpg",
        "price": "6999.00",
        "originPrice": null,
        "sales": 89,
        "isRecommend": 1
      }
    ]
  }
}
```

---

## 十四、分类模块

> 路径前缀：`/api/mini/categories`
> 鉴权要求：**所有接口无需鉴权**

---

### 14.1 获取分类列表

**接口名称**：获取分类列表
**接口功能**：返回全部商品分类，按 sort 升序排列，用于分类页左侧导航
**请求方式**：`GET`
**请求路径**：`/api/mini/categories`
**鉴权**：不需要

**请求参数**：无

**响应数据**：数组，元素结构如下

| 字段    | 类型     | 说明       |
|-------|--------|----------|
| id    | long   | 分类 ID    |
| name  | string | 分类名称     |
| image | string | 分类图标 URL |
| sort  | int    | 排序值（升序）  |

**示例**

请求：
```http
GET /api/mini/categories
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "手机数码",
      "image": "https://cdn.example.com/cat/1.png",
      "sort": 1
    },
    {
      "id": 2,
      "name": "电脑办公",
      "image": "https://cdn.example.com/cat/2.png",
      "sort": 2
    }
  ]
}
```

---

### 14.2 获取分类下商品列表

**接口名称**：获取分类下商品列表
**接口功能**：返回指定分类下的商品列表，支持分页，用于分类页右侧商品展示
**请求方式**：`GET`
**请求路径**：`/api/mini/categories/{id}/products`
**鉴权**：不需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 分类 ID |

**Query 参数**

| 参数名      | 类型  | 必填 | 说明             |
|----------|-----|----|----------------|
| page     | int | 否  | 页码，默认 1        |
| pageSize | int | 否  | 每页条数，默认 10     |

**响应数据**：分页格式，`list` 元素结构如下

| 字段          | 类型     | 说明              |
|-------------|--------|-----------------|
| id          | long   | 商品 ID           |
| name        | string | 商品名称            |
| cover       | string | 封面图 URL         |
| price       | string | 现价（元）           |
| originPrice | string | 原价（元），可为 null   |
| sales       | int    | 销量              |

**示例**

请求：
```http
GET /api/mini/categories/1/products?page=1&pageSize=10
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "iPhone 15 Pro 256G 深空黑",
        "cover": "https://cdn.example.com/products/1.jpg",
        "price": "8999.00",
        "originPrice": "9499.00",
        "sales": 120
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

---

## 十五、商品模块

> 路径前缀：`/api/mini/products`
> 鉴权要求：**所有接口无需鉴权**

---

### 15.1 搜索商品

**接口名称**：搜索商品
**接口功能**：根据关键词搜索商品，支持分页和排序，用于搜索页展示结果
**请求方式**：`GET`
**请求路径**：`/api/mini/products/search`
**鉴权**：不需要

**Query 参数**

| 参数名      | 类型     | 必填 | 说明                                  |
|----------|--------|----|-------------------------------------|
| keyword  | string | 是  | 搜索关键字，匹配商品名称                        |
| sort     | string | 否  | 排序方式：`default` 默认 / `sales` 销量优先 / `price_asc` 价格升序 / `price_desc` 价格降序 |
| page     | int    | 否  | 页码，默认 1                             |
| pageSize | int    | 否  | 每页条数，默认 20                          |

**响应数据**：分页格式，`list` 元素结构如下

| 字段          | 类型     | 说明              |
|-------------|--------|-----------------|
| id          | long   | 商品 ID           |
| name        | string | 商品名称            |
| cover       | string | 封面图 URL         |
| price       | string | 现价（元）           |
| originPrice | string | 原价（元），可为 null   |
| sales       | int    | 销量              |
| isRecommend | int    | 是否推荐：0 否 / 1 是  |

**示例**

请求：
```http
GET /api/mini/products/search?keyword=iPhone&sort=sales&page=1&pageSize=20
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "iPhone 15 Pro 256G 深空黑",
        "cover": "https://cdn.example.com/products/1.jpg",
        "price": "8999.00",
        "originPrice": "9499.00",
        "sales": 120,
        "isRecommend": 1
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20
  }
}
```

---

### 15.2 获取热门搜索词

**接口名称**：获取热门搜索词
**接口功能**：返回热门搜索关键词列表，用于搜索页展示热门标签
**请求方式**：`GET`
**请求路径**：`/api/mini/products/hot-keywords`
**鉴权**：不需要

**请求参数**：无

**响应数据**：字符串数组

**示例**

请求：
```http
GET /api/mini/products/hot-keywords
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": ["iPhone", "华为", "小米", "耳机", "平板", "笔记本", "手表", "相机"]
}
```

---

### 15.3 获取商品详情

**接口名称**：获取商品详情
**接口功能**：返回指定商品的完整信息，包含详情图列表和规格信息，用于商品详情页展示
**请求方式**：`GET`
**请求路径**：`/api/mini/products/{id}`
**鉴权**：不需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 商品 ID |

**响应数据**

| 字段          | 类型     | 说明                               |
|-------------|--------|----------------------------------|
| id          | long   | 商品 ID                            |
| name        | string | 商品名称                             |
| cover       | string | 封面图 URL                          |
| detailImgs  | array  | 详情图 URL 列表                       |
| price       | string | 现价（元）                            |
| originPrice | string | 原价（元），可为 null                    |
| stock       | int    | 库存                               |
| sales       | int    | 销量                               |
| description | string | 商品描述，可为 null                     |
| categoryId  | long   | 分类 ID，可为 null                    |
| specs       | object | 规格信息 JSON，如 `{"颜色":["黑","白"]}`  |
| status      | int    | 状态：0 下架 / 1 上架                   |

**示例**

请求：
```http
GET /api/mini/products/1
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro 256G 深空黑",
    "cover": "https://cdn.example.com/products/1.jpg",
    "detailImgs": [
      "https://cdn.example.com/products/1_d1.jpg",
      "https://cdn.example.com/products/1_d2.jpg"
    ],
    "price": "8999.00",
    "originPrice": "9499.00",
    "stock": 58,
    "sales": 120,
    "description": "最新款 iPhone，搭载 A17 Pro 芯片",
    "categoryId": 1,
    "specs": {
      "颜色": ["深空黑", "原色钛金属", "白色钛金属"],
      "容量": ["256G", "512G", "1T"]
    },
    "status": 1
  }
}
```

---

## 十六、订单模块

> 路径前缀：`/api/mini/orders`
> 鉴权要求：**所有接口需要鉴权**

---

### 16.1 提交订单

**接口名称**：提交订单
**接口功能**：用户提交购买订单，创建订单记录，扣减库存
**请求方式**：`POST`
**请求路径**：`/api/mini/orders`
**鉴权**：需要

**请求体（application/json）**

| 参数名                | 类型     | 必填 | 说明                                |
|--------------------|--------|----|-----------------------------------|
| contactName        | string | 是  | 收货人姓名                             |
| contactPhone       | string | 是  | 收货人电话                             |
| address            | string | 是  | 收货地址（完整地址字符串）                     |
| remark             | string | 否  | 订单备注                              |
| items              | array  | 是  | 商品明细列表                            |
| items[].productId  | long   | 是  | 商品 ID                             |
| items[].spec       | string | 否  | 规格描述，如 "深空黑 / 256G"               |
| items[].quantity   | int    | 是  | 购买数量                              |
| items[].price      | number | 是  | 商品单价（元）                           |
| totalAmount        | number | 是  | 订单总金额（元）                          |
| discountAmount     | number | 否  | 优惠金额（元），默认 0                      |
| payAmount          | number | 是  | 实付金额（元）                           |

**响应数据**

| 字段       | 类型     | 说明      |
|----------|--------|---------|
| orderId  | long   | 订单 ID   |
| orderNo  | string | 订单编号    |
| payAmount | string | 实付金额（元）|

**示例**

请求：
```http
POST /api/mini/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "contactName": "张三",
  "contactPhone": "13800138001",
  "address": "北京市朝阳区建国路88号",
  "remark": "请尽快发货",
  "items": [
    {
      "productId": 1,
      "spec": "深空黑 / 256G",
      "quantity": 1,
      "price": 8999.00
    }
  ],
  "totalAmount": 8999.00,
  "discountAmount": 200.00,
  "payAmount": 8799.00
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": 1,
    "orderNo": "ORD20260311001",
    "payAmount": "8799.00"
  }
}
```

---

### 16.2 获取订单列表

**接口名称**：获取订单列表
**接口功能**：获取当前用户的订单列表，支持按状态筛选，按创建时间倒序分页返回
**请求方式**：`GET`
**请求路径**：`/api/mini/orders`
**鉴权**：需要

**Query 参数**

| 参数名      | 类型  | 必填 | 说明                                          |
|----------|-----|----|---------------------------------------------|
| status   | int | 否  | 订单状态：0 待支付 / 1 待发货 / 2 待收货 / 3 已完成 / 4 退款售后；不传则查全部 |
| page     | int | 否  | 页码，默认 1                                      |
| pageSize | int | 否  | 每页条数，默认 10                                   |

**响应数据**：分页格式，`list` 元素结构如下

| 字段                          | 类型     | 说明           |
|-----------------------------|--------|--------------|
| id                          | long   | 订单 ID        |
| orderNo                     | string | 订单编号         |
| status                      | int    | 订单状态         |
| payAmount                   | string | 实付金额（元）      |
| createTime                  | string | 创建时间         |
| orderItems                  | array  | 商品明细列表       |
| orderItems[].productId      | long   | 商品 ID        |
| orderItems[].productName    | string | 商品名称         |
| orderItems[].cover          | string | 商品封面图 URL    |
| orderItems[].spec           | string | 规格描述，可为 null |
| orderItems[].price          | string | 单价（元）        |
| orderItems[].quantity       | int    | 数量           |

**示例**

请求：
```http
GET /api/mini/orders?status=1&page=1&pageSize=10
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "orderNo": "ORD20260311001",
        "status": 1,
        "payAmount": "8799.00",
        "createTime": "2026-03-11 10:23:45",
        "orderItems": [
          {
            "productId": 1,
            "productName": "iPhone 15 Pro 256G",
            "cover": "https://cdn.example.com/products/1.jpg",
            "spec": "深空黑 / 256G",
            "price": "8999.00",
            "quantity": 1
          }
        ]
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 16.3 获取订单详情

**接口名称**：获取订单详情
**接口功能**：返回指定订单的完整信息，包含商品明细和收货信息
**请求方式**：`GET`
**请求路径**：`/api/mini/orders/{id}`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 订单 ID |

**响应数据**

| 字段                          | 类型     | 说明              |
|-----------------------------|--------|-----------------|
| id                          | long   | 订单 ID           |
| orderNo                     | string | 订单编号            |
| status                      | int    | 订单状态            |
| contactName                 | string | 收货人             |
| contactPhone                | string | 联系电话            |
| address                     | string | 收货地址            |
| totalAmount                 | string | 订单总金额（元）        |
| discountAmount              | string | 优惠金额（元）         |
| payAmount                   | string | 实付金额（元）         |
| remark                      | string | 备注，可为 null      |
| createTime                  | string | 创建时间            |
| orderItems                  | array  | 商品明细列表          |
| orderItems[].productId      | long   | 商品 ID           |
| orderItems[].productName    | string | 商品名称            |
| orderItems[].cover          | string | 商品封面图 URL       |
| orderItems[].spec           | string | 规格描述，可为 null    |
| orderItems[].price          | string | 单价（元）           |
| orderItems[].quantity       | int    | 数量              |

**示例**

请求：
```http
GET /api/mini/orders/1
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "orderNo": "ORD20260311001",
    "status": 1,
    "contactName": "张三",
    "contactPhone": "13800138001",
    "address": "北京市朝阳区建国路88号",
    "totalAmount": "8999.00",
    "discountAmount": "200.00",
    "payAmount": "8799.00",
    "remark": "请尽快发货",
    "createTime": "2026-03-11 10:23:45",
    "orderItems": [
      {
        "productId": 1,
        "productName": "iPhone 15 Pro 256G",
        "cover": "https://cdn.example.com/products/1.jpg",
        "spec": "深空黑 / 256G",
        "price": "8999.00",
        "quantity": 1
      }
    ]
  }
}
```

---

### 16.4 取消订单

**接口名称**：取消订单
**接口功能**：取消待支付状态（status=0）的订单，恢复库存
**请求方式**：`PUT`
**请求路径**：`/api/mini/orders/{id}/cancel`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 订单 ID |

**请求体**：无

**响应数据**：`data` 为 `null`

**业务规则**：
- 仅待支付（status=0）的订单可取消
- 取消后恢复商品库存
- 非待支付状态的订单返回 `400` 错误

**示例**

请求：
```http
PUT /api/mini/orders/1/cancel
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

### 16.5 模拟支付

**接口名称**：模拟支付
**接口功能**：模拟订单支付操作，将待支付订单状态更新为待发货（学习项目，非真实支付）
**请求方式**：`PUT`
**请求路径**：`/api/mini/orders/{id}/pay`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 订单 ID |

**请求体**：无

**响应数据**：`data` 为 `null`

**业务规则**：
- 仅待支付（status=0）的订单可支付
- 支付成功后订单状态变更为待发货（status=1）

**示例**

请求：
```http
PUT /api/mini/orders/1/pay
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

### 16.6 确认收货

**接口名称**：确认收货
**接口功能**：用户确认收货，将待收货订单状态更新为已完成
**请求方式**：`PUT`
**请求路径**：`/api/mini/orders/{id}/confirm`
**鉴权**：需要

**路径参数**

| 参数名 | 类型   | 说明    |
|----|------|-------|
| id | long | 订单 ID |

**请求体**：无

**响应数据**：`data` 为 `null`

**业务规则**：
- 仅待收货（status=2）的订单可确认收货
- 确认后订单状态变更为已完成（status=3）

**示例**

请求：
```http
PUT /api/mini/orders/1/confirm
Authorization: Bearer <token>
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

---

## 十七、评价模块

> 路径前缀：`/api/mini/reviews`
> 鉴权要求：**查询无需鉴权，提交需要鉴权**

---

### 17.1 获取商品评价列表

**接口名称**：获取商品评价列表
**接口功能**：分页返回指定商品的用户评价，按创建时间倒序排列，用于商品详情页展示
**请求方式**：`GET`
**请求路径**：`/api/mini/reviews`
**鉴权**：不需要

**Query 参数**

| 参数名       | 类型   | 必填 | 说明             |
|-----------|------|----|----------------|
| productId | long | 是  | 商品 ID          |
| page      | int  | 否  | 页码，默认 1        |
| pageSize  | int  | 否  | 每页条数，默认 5      |

**响应数据**：分页格式，`list` 元素结构如下

| 字段         | 类型     | 说明             |
|------------|--------|----------------|
| id         | long   | 评价 ID          |
| userId     | long   | 用户 ID          |
| nickname   | string | 用户昵称           |
| avatar     | string | 用户头像 URL       |
| rating     | int    | 评分（1-5）        |
| content    | string | 评价内容，可为 null   |
| images     | array  | 评价图片 URL 列表    |
| createTime | string | 评价时间           |

**示例**

请求：
```http
GET /api/mini/reviews?productId=1&page=1&pageSize=5
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 1,
        "nickname": "小明",
        "avatar": "https://cdn.example.com/avatars/u1.png",
        "rating": 5,
        "content": "手机质量非常好，拍照效果很棒！",
        "images": [
          "https://cdn.example.com/reviews/1_1.jpg",
          "https://cdn.example.com/reviews/1_2.jpg"
        ],
        "createTime": "2026-03-10 11:00:00"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 5
  }
}
```

---

### 17.2 提交评价

**接口名称**：提交评价
**接口功能**：用户对已完成的订单中的商品提交评价
**请求方式**：`POST`
**请求路径**：`/api/mini/reviews`
**鉴权**：需要

**请求体（application/json）**

| 参数名       | 类型     | 必填 | 说明                  |
|-----------|--------|----|---------------------|
| orderId   | long   | 是  | 订单 ID               |
| productId | long   | 是  | 商品 ID               |
| rating    | int    | 是  | 评分，1-5 星            |
| content   | string | 否  | 评价文字内容              |
| images    | array  | 否  | 评价图片 URL 列表，最多 9 张 |

**响应数据**

| 字段 | 类型   | 说明      |
|----|------|---------|
| id | long | 评价 ID   |

**业务规则**：
- 仅已完成（status=3）的订单可评价
- 同一订单的同一商品不可重复评价

**示例**

请求：
```http
POST /api/mini/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": 3,
  "productId": 1,
  "rating": 5,
  "content": "手机质量非常好，拍照效果很棒！物流也很快，很满意这次购物。",
  "images": [
    "https://cdn.example.com/reviews/1_1.jpg",
    "https://cdn.example.com/reviews/1_2.jpg"
  ]
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": { "id": 1 }
}
```

---

## 十八、文件上传模块

> 路径前缀：`/api/mini/upload`
> 鉴权要求：**需要鉴权**

---

### 18.1 上传文件

**接口名称**：上传文件
**接口功能**：上传图片等文件至腾讯云 COS，返回可访问的公网 URL
**请求方式**：`POST`
**请求路径**：`/api/mini/upload`
**鉴权**：需要

**请求体（multipart/form-data）**

| 参数名  | 类型   | 必填 | 说明                              |
|------|------|----|---------------------------------|
| file | File | 是  | 上传的文件，支持 jpg/png/webp/gif，最大 10MB |

**响应数据**

| 字段  | 类型     | 说明           |
|-----|--------|--------------|
| url | string | 文件公网访问 URL   |

**示例**

请求：
```http
POST /api/mini/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data; boundary=----FormBoundary

------FormBoundary
Content-Disposition: form-data; name="file"; filename="review.jpg"
Content-Type: image/jpeg

<binary data>
------FormBoundary--
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/abc123def456.jpg"
  }
}
```

---

## 附录：移动端接口汇总

| 序号 | 方法   | 路径                                    | 功能           | 鉴权  |
|----|------|---------------------------------------|--------------|-----|
| 1  | POST | /api/mini/auth/login                  | 用户登录         | ❌   |
| 2  | POST | /api/mini/auth/register               | 用户注册         | ❌   |
| 3  | POST | /api/mini/auth/logout                 | 用户登出         | ✅   |
| 4  | GET  | /api/mini/user/profile                | 获取用户信息       | ✅   |
| 5  | PUT  | /api/mini/user/profile                | 修改用户信息       | ✅   |
| 6  | GET  | /api/mini/user/order-stats            | 获取订单统计       | ✅   |
| 7  | GET  | /api/mini/home/data                   | 获取首页数据       | ❌   |
| 8  | GET  | /api/mini/categories                  | 获取分类列表       | ❌   |
| 9  | GET  | /api/mini/categories/{id}/products    | 获取分类下商品      | ❌   |
| 10 | GET  | /api/mini/products/search             | 搜索商品         | ❌   |
| 11 | GET  | /api/mini/products/hot-keywords       | 获取热门搜索词      | ❌   |
| 12 | GET  | /api/mini/products/{id}               | 获取商品详情       | ❌   |
| 13 | POST | /api/mini/orders                      | 提交订单         | ✅   |
| 14 | GET  | /api/mini/orders                      | 获取订单列表       | ✅   |
| 15 | GET  | /api/mini/orders/{id}                 | 获取订单详情       | ✅   |
| 16 | PUT  | /api/mini/orders/{id}/cancel          | 取消订单         | ✅   |
| 17 | PUT  | /api/mini/orders/{id}/pay             | 模拟支付         | ✅   |
| 18 | PUT  | /api/mini/orders/{id}/confirm         | 确认收货         | ✅   |
| 19 | GET  | /api/mini/reviews                     | 获取商品评价列表     | ❌   |
| 20 | POST | /api/mini/reviews                     | 提交评价         | ✅   |
| 21 | POST | /api/mini/upload                      | 上传文件         | ✅   |
