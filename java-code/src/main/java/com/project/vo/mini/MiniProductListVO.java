package com.project.vo.mini;

import lombok.Data;

@Data
public class MiniProductListVO {
    private Long id;
    private String name;
    private String cover;
    private String price;
    private String originPrice;
    private Integer sales;
    private Integer isRecommend;
}
