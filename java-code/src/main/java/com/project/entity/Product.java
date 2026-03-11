package com.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@TableName(value = "product", autoResultMap = true)
public class Product {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String cover;

    /** JSON array of image URLs */
    private String detailImgs;

    private BigDecimal price;

    private BigDecimal originPrice;

    private Integer stock;

    private Integer sales;

    private Integer views;

    /** 0 off-shelf / 1 on-shelf */
    private Integer status;

    /** 0 no / 1 yes */
    private Integer isRecommend;

    private String description;

    private Long categoryId;

    /** JSON object: {"颜色":["黑","白"]} */
    @TableField(typeHandler = JacksonTypeHandler.class)
    private Map<String, List<String>> specs;

    @TableLogic
    private Integer isDeleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
