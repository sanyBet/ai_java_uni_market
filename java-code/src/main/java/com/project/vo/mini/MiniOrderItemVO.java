package com.project.vo.mini;

import lombok.Data;

@Data
public class MiniOrderItemVO {
    private Long productId;
    private String productName;
    private String cover;
    private String spec;
    private String price;
    private Integer quantity;
}
