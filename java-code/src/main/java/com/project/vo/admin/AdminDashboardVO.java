package com.project.vo.admin;

import lombok.Data;

import java.util.List;

@Data
public class AdminDashboardVO {

    private Long userCount;

    private Long productCount;

    private Long orderCount;

    private String todaySales;

    private List<OrderTrend> orderTrend;

    private List<SalesTrend> salesTrend;

    private List<RecentOrder> recentOrders;

    @Data
    public static class OrderTrend {
        private String date;
        private Integer count;
    }

    @Data
    public static class SalesTrend {
        private String date;
        private String amount;
    }

    @Data
    public static class RecentOrder {
        private String orderNo;
        private String contactName;
        private String payAmount;
        private Integer status;
        private String createTime;
    }
}
