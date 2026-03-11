package com.project.vo.admin;

import lombok.Data;

import java.util.List;

@Data
public class AdminOrderDetailVO extends AdminOrderVO {

    private List<OrderItemVO> orderItems;

    @Data
    public static class OrderItemVO {

        private String name;

        private String spec;

        private Double price;

        private Integer qty;
    }
}
