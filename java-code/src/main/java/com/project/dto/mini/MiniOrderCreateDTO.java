package com.project.dto.mini;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class MiniOrderCreateDTO {
    private String contactName;
    private String contactPhone;
    private String address;
    private String remark;
    private List<Item> items;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal payAmount;

    @Data
    public static class Item {
        private Long productId;
        private String spec;
        private Integer quantity;
        private BigDecimal price;
    }
}
