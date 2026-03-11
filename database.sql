-- =============================================
-- ai_java_uniapp_market 数据库初始化脚本
-- 创建时间: 2026-03-10
-- =============================================

CREATE DATABASE IF NOT EXISTS ai_java_uniapp_market DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ai_java_uniapp_market;

-- =============================================
-- 用户表
-- =============================================
CREATE TABLE `user` (
    `id`          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `avatar`      VARCHAR(500)              DEFAULT NULL    COMMENT '头像URL',
    `nickname`    VARCHAR(64)               DEFAULT NULL    COMMENT '昵称',
    `account`     VARCHAR(64)               DEFAULT NULL    COMMENT '账号',
    `password`    VARCHAR(255)              DEFAULT NULL    COMMENT '密码（加密存储）',
    `openid`      VARCHAR(128)              DEFAULT NULL    COMMENT '微信 OpenID',
    `create_time` DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted`  TINYINT(1)       NOT NULL DEFAULT 0       COMMENT '删除标记 0正常 1已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_account`  (`account`),
    UNIQUE KEY `uk_openid`   (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =============================================
-- 管理员表
-- =============================================
CREATE TABLE `admin` (
    `id`          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
    `account`     VARCHAR(64)      NOT NULL                COMMENT '账号',
    `password`    VARCHAR(255)     NOT NULL                COMMENT '密码（加密存储）',
    `nickname`    VARCHAR(64)               DEFAULT NULL   COMMENT '昵称',
    `role`        VARCHAR(32)      NOT NULL DEFAULT 'admin' COMMENT '角色 admin/super_admin',
    `avatar`      VARCHAR(500)              DEFAULT NULL   COMMENT '头像URL',
    `create_time` DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted`  TINYINT(1)       NOT NULL DEFAULT 0      COMMENT '删除标记 0正常 1已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_account` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- =============================================
-- 商品分类表
-- =============================================
CREATE TABLE `category` (
    `id`           BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    `name`         VARCHAR(64)      NOT NULL                COMMENT '分类名称',
    `image`        VARCHAR(500)              DEFAULT NULL   COMMENT '分类图片URL',
    `sort`         INT              NOT NULL DEFAULT 0      COMMENT '排序（升序）',
    `show_on_home` TINYINT(1)       NOT NULL DEFAULT 0      COMMENT '是否首页展示 0否 1是',
    `create_time`  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted`   TINYINT(1)       NOT NULL DEFAULT 0      COMMENT '删除标记 0正常 1已删除',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';

-- =============================================
-- 商品表
-- =============================================
CREATE TABLE `product` (
    `id`           BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT '商品ID',
    `name`         VARCHAR(128)     NOT NULL                COMMENT '商品名称',
    `cover`        VARCHAR(500)     NOT NULL                COMMENT '封面图URL',
    `detail_imgs`  TEXT                      DEFAULT NULL   COMMENT '详情图列表（JSON Array）',
    `price`        DECIMAL(10, 2)   NOT NULL                COMMENT '现价',
    `origin_price` DECIMAL(10, 2)            DEFAULT NULL   COMMENT '原价',
    `stock`        INT              NOT NULL DEFAULT 0      COMMENT '库存',
    `status`       TINYINT(1)       NOT NULL DEFAULT 1      COMMENT '状态 0下架 1上架',
    `is_recommend` TINYINT(1)       NOT NULL DEFAULT 0      COMMENT '是否推荐 0否 1是',
    `sales`        INT              NOT NULL DEFAULT 0      COMMENT '销量',
    `views`        INT              NOT NULL DEFAULT 0      COMMENT '浏览量',
    `description`  TEXT                      DEFAULT NULL   COMMENT '商品描述',
    `category_id`  BIGINT UNSIGNED           DEFAULT NULL   COMMENT '分类ID',
    `specs`        JSON                      DEFAULT NULL   COMMENT '规格信息（JSON Object）',
    `create_time`  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted`   TINYINT(1)       NOT NULL DEFAULT 0      COMMENT '删除标记 0正常 1已删除',
    PRIMARY KEY (`id`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_status`      (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- =============================================
-- 订单表
-- =============================================
CREATE TABLE `order` (
    `id`             BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT '订单ID',
    `user_id`        BIGINT UNSIGNED  NOT NULL                COMMENT '用户ID',
    `order_no`       VARCHAR(64)      NOT NULL                COMMENT '订单编号',
    `order_items`    TEXT             NOT NULL                COMMENT '订单商品信息（JSON Array）',
    `remark`         VARCHAR(255)              DEFAULT NULL   COMMENT '订单备注',
    `status`         TINYINT(1)       NOT NULL DEFAULT 0      COMMENT '订单状态 0待支付 1待发货 2待收货 3已完成 4退款/售后 5已取消',
    `total_amount`   DECIMAL(10, 2)   NOT NULL                COMMENT '订单原始金额',
    `discount_amount` DECIMAL(10, 2)  NOT NULL DEFAULT 0.00  COMMENT '优惠金额',
    `pay_amount`     DECIMAL(10, 2)   NOT NULL                COMMENT '实际支付金额',
    `contact_name`   VARCHAR(64)      NOT NULL                COMMENT '联系人',
    `contact_phone`  VARCHAR(20)      NOT NULL                COMMENT '联系电话',
    `address`        VARCHAR(500)     NOT NULL                COMMENT '收货地址',
    `create_time`    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted`     TINYINT(1)       NOT NULL DEFAULT 0      COMMENT '删除标记 0正常 1已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_order_no` (`order_no`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status`  (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- =============================================
-- 轮播图表
-- =============================================
CREATE TABLE `banner` (
    `id`          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT '轮播图ID',
    `title`       VARCHAR(128)     NOT NULL                COMMENT '标题',
    `cover`       VARCHAR(500)     NOT NULL                COMMENT '封面图URL',
    `product_id`  BIGINT UNSIGNED           DEFAULT NULL   COMMENT '关联商品ID',
    `create_time` DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted`  TINYINT(1)       NOT NULL DEFAULT 0      COMMENT '删除标记 0正常 1已删除',
    PRIMARY KEY (`id`),
    KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='轮播图表';

-- =============================================
-- 评价表
-- =============================================
CREATE TABLE `review` (
    `id`          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT COMMENT '评价ID',
    `user_id`     BIGINT UNSIGNED  NOT NULL                COMMENT '用户ID',
    `order_id`    BIGINT UNSIGNED  NOT NULL                COMMENT '订单ID',
    `product_id`  BIGINT UNSIGNED  NOT NULL                COMMENT '商品ID',
    `rating`      TINYINT(1)       NOT NULL DEFAULT 5      COMMENT '评分 1-5',
    `content`     TEXT                      DEFAULT NULL   COMMENT '评价内容',
    `images`      TEXT                      DEFAULT NULL   COMMENT '评价图片列表（JSON Array）',
    `create_time` DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `is_deleted`  TINYINT(1)       NOT NULL DEFAULT 0      COMMENT '删除标记 0正常 1已删除',
    PRIMARY KEY (`id`),
    KEY `idx_user_id`    (`user_id`),
    KEY `idx_order_id`   (`order_id`),
    KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评价表';

-- =============================================
-- 模拟数据
-- =============================================

-- 用户表
INSERT INTO `user` (`avatar`, `nickname`, `account`, `password`, `openid`) VALUES
('https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', '张小明', 'zhangxiaoming', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL),
('https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', '李小红', 'lixiaohong',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL),
('https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', '王大力', 'wangdali',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ox_openid_001'),
('https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', '赵云飞', 'zhaoyunfei',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ox_openid_002'),
('https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', '陈美丽', 'chenmeili',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ox_openid_003');

-- 管理员表（密码均为 123456）
INSERT INTO `admin` (`account`, `password`, `nickname`, `role`, `avatar`) VALUES
('admin',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '超级管理员', 'super_admin', 'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg'),
('operator1',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '运营专员一', 'admin',       'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg'),
('operator2',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '运营专员二', 'admin',       'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg');

-- 商品分类表
INSERT INTO `category` (`name`, `image`, `sort`, `show_on_home`) VALUES
('手机数码',   'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', 1, 1),
('服装鞋包',   'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', 2, 1),
('食品生鲜',   'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', 3, 1),
('家居百货',   'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', 4, 1),
('运动户外',   'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', 5, 0);

-- 商品表（category_id 对应上面分类 1-5）
INSERT INTO `product` (`name`, `cover`, `detail_imgs`, `price`, `origin_price`, `stock`, `status`, `is_recommend`, `sales`, `views`, `description`, `category_id`, `specs`) VALUES
('iPhone 16 Pro 256G 钛金属',
 'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg',
 '["https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg","https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"]',
 8999.00, 9999.00, 120, 1, 1, 356, 12800, 'Apple A18 Pro芯片，钛金属机身，超视网膜XDR显示屏', 1,
 '{"颜色":["黑色钛金属","白色钛金属","原色钛金属"],"存储":["256G","512G","1T"]}'),

('华为 Mate 70 Pro 512G',
 'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg',
 '["https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"]',
 6999.00, 7499.00, 80, 1, 1, 210, 8900, '麒麟芯片，超强影像，卫星通话', 1,
 '{"颜色":["雅丹黑","砚台青","白沙银"],"存储":["256G","512G"]}'),

('优衣库 男士基础款纯棉T恤',
 'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg',
 '["https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"]',
 79.00, 99.00, 500, 1, 0, 1200, 5600, '100%优质纯棉，透气舒适，多色可选', 2,
 '{"颜色":["白色","黑色","藏青色","灰色"],"尺码":["S","M","L","XL","XXL"]}'),

('新疆阿克苏苹果 5斤装',
 'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg',
 '["https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"]',
 39.90, 49.90, 300, 1, 1, 890, 3200, '产地直发，脆甜多汁，新鲜采摘', 3, NULL),

('无印良品 实木收纳架',
 'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg',
 '["https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"]',
 299.00, 399.00, 60, 1, 0, 145, 2100, '天然实木，简约北欧风，多功能收纳', 4,
 '{"颜色":["原木色","白色"],"规格":["小号","中号","大号"]}');

-- 订单表（user_id 1-5，引用商品1-5）
INSERT INTO `order` (`user_id`, `order_no`, `order_items`, `remark`, `status`, `total_amount`, `discount_amount`, `pay_amount`, `contact_name`, `contact_phone`, `address`) VALUES
(1, 'ORD20260311000001',
 '[{"productId":1,"productName":"iPhone 16 Pro 256G 钛金属","price":8999.00,"quantity":1,"cover":"https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"}]',
 NULL, 3, 8999.00, 100.00, 8899.00, '张小明', '13800000001', '北京市朝阳区望京街道1号楼101'),

(2, 'ORD20260311000002',
 '[{"productId":3,"productName":"优衣库 男士基础款纯棉T恤","price":79.00,"quantity":3,"cover":"https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"}]',
 '麻烦快点发货', 2, 237.00, 0.00, 237.00, '李小红', '13800000002', '上海市浦东新区张江高科技园区88号'),

(3, 'ORD20260311000003',
 '[{"productId":4,"productName":"新疆阿克苏苹果 5斤装","price":39.90,"quantity":2,"cover":"https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"},{"productId":5,"productName":"无印良品 实木收纳架","price":299.00,"quantity":1,"cover":"https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"}]',
 NULL, 1, 378.80, 20.00, 358.80, '王大力', '13800000003', '广州市天河区珠江新城花城大道100号'),

(4, 'ORD20260311000004',
 '[{"productId":2,"productName":"华为 Mate 70 Pro 512G","price":6999.00,"quantity":1,"cover":"https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"}]',
 '送礼用，请包装好', 0, 6999.00, 0.00, 6999.00, '赵云飞', '13800000004', '深圳市南山区科技园南区科园路10号'),

(5, 'ORD20260311000005',
 '[{"productId":5,"productName":"无印良品 实木收纳架","price":299.00,"quantity":2,"cover":"https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"}]',
 NULL, 4, 598.00, 50.00, 548.00, '陈美丽', '13800000005', '成都市武侯区天府大道北段1700号');

-- 轮播图表（关联商品1-5）
INSERT INTO `banner` (`title`, `cover`, `product_id`) VALUES
('iPhone 16 Pro 限时优惠', 'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', 1),
('华为新品发布',           'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', 2),
('春季服装上新',           'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', 3),
('新鲜水果 顺丰包邮',     'https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg', 4);

-- 评价表（已完成订单1、2、3；商品1、3、4）
INSERT INTO `review` (`user_id`, `order_id`, `product_id`, `rating`, `content`, `images`) VALUES
(1, 1, 1, 5, '手机很棒，拍照效果超级好，发货速度快，包装严实，非常满意！',
 '["https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"]'),
(2, 2, 3, 4, '质量不错，纯棉面料穿着舒服，就是颜色和图片稍微有点色差，其余都很好。',
 NULL),
(3, 3, 4, 5, '苹果又大又甜，口感脆爽，新鲜送达，下次还会回购！',
 '["https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg","https://ai-file-1311194876.cos.ap-shanghai.myqcloud.com/20260311/b280c29f61524ed0841ea813cec18191.jpg"]'),
(3, 3, 5, 4, '收纳架做工精细，实木质感好，组装也比较简单，家里放上去很好看。', NULL);
