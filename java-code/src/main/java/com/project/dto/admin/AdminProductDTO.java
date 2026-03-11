package com.project.dto.admin;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class AdminProductDTO {

    private String name;

    private String cover;

    private BigDecimal price;

    private BigDecimal originPrice;

    private Integer stock;

    private String description;

    private Long categoryId;

    private List<String> detailImgs;

    /** 规格信息 JSON，如 {"颜色":["黑","白"]} */
    private Map<String, List<String>> specs;

    /** 0 下架 / 1 上架 */
    private Integer status;

    /** 0 否 / 1 是 */
    private Integer isRecommend;
}
