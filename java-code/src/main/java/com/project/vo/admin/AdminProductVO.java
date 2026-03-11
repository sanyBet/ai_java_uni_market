package com.project.vo.admin;

import lombok.Data;

@Data
public class AdminProductVO {

    private Long id;

    private String name;

    private String cover;

    private String price;

    private String originPrice;

    private Integer stock;

    private Integer sales;

    private Integer views;

    private Integer status;

    private Integer isRecommend;

    private Long categoryId;

    private String createTime;
}
