# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build
./mvnw clean package -DskipTests

# Run
./mvnw spring-boot:run

# Test (all)
./mvnw test

# Test (single class)
./mvnw test -Dtest=JavaCodeApplicationTests

# Code generation (MyBatis-Plus generator)
./mvnw test -Dtest=CodeGenerator
```

## Architecture

Spring Boot 3.5.11 + Java 17 REST API for a mall (电商) backend. Serves two client types:

- **Admin panel** (`/api/admin/**`) — requires JWT authentication
- **Mini program / frontend** (`/api/mini/**`) — public access

### Layer structure

```
controller/
  admin/      → AdminXxxController  (authenticated)
  mini/       → (public APIs, currently placeholder)
service/
  IXxxService + impl/XxxServiceImpl extends ServiceImpl<Mapper, Entity>
mapper/       → XxxMapper extends BaseMapper<Entity>
entity/       → database tables (MyBatis-Plus annotations)
dto/admin/    → request bodies (input)
vo/admin/     → response bodies (output)
common/
  result/     → Result<T>, PageResult<T>
  exception/  → BusinessException, GlobalExceptionHandler
  util/       → JwtUtil
config/       → SecurityConfig, JwtFilter, MybatisPlusConfig, MyMetaObjectHandler
```

### Key conventions

**Response wrapping** — all endpoints return `Result<T>` (code/message/data). Paginated endpoints return `Result<PageResult<T>>`.

**Error handling** — throw `BusinessException(code, message)` for business errors. `GlobalExceptionHandler` catches `BusinessException`, `MethodArgumentNotValidException`, and `Exception`.

**Authentication** — `JwtFilter` parses `Authorization: Bearer <token>`, sets `adminId` (Long) as `Authentication.principal`. Retrieve in controllers via `SecurityContextHolder.getContext().getAuthentication().getPrincipal()`.

**Entities** — use `@TableLogic` on `isDeleted` field (MyBatis-Plus soft delete). `createTime` / `updateTime` auto-filled by `MyMetaObjectHandler`.

**Pagination** — use `Page<T>` from MyBatis-Plus; wrap result in `PageResult.of(list, total, page, pageSize)`.

**Services** — extend `ServiceImpl<Mapper, Entity>` to get `lambdaQuery()`, `page()`, `save()`, `updateById()`, `removeById()` etc.

### Database

MySQL, database name: `ai_java_uniapp_market`. Config in `application.properties` (Druid pool).

### File uploads

Stored on Tencent Cloud COS. Config in `application.properties` under `cos.*`.
