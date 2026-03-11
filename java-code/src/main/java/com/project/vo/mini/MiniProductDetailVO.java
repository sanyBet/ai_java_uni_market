package com.project.vo.mini;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class MiniProductDetailVO {
    private Long id;
    private String name;
    private String cover;
    private List<String> detailImgs;
    private String price;
    private String originPrice;
    private Integer stock;
    private Integer sales;
    private String description;
    private Long categoryId;
    private Map<String, List<String>> specs;
    private Integer status;
    private Integer positiveRate;
    private Integer reviewCount;
}
