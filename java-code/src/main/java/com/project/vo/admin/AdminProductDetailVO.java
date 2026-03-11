package com.project.vo.admin;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AdminProductDetailVO {

    private Long id;

    private String name;

    private String cover;

    private List<String> detailImgs;

    private String price;

    private String originPrice;

    private Integer stock;

    private Integer sales;

    private Integer views;

    private Integer status;

    private Integer isRecommend;

    private String description;

    private Long categoryId;

    private Map<String, List<String>> specs;

    private String createTime;

    private String updateTime;
}
