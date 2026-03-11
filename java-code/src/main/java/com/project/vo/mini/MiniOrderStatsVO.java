package com.project.vo.mini;

import lombok.Data;

@Data
public class MiniOrderStatsVO {
    private Integer pendingPayment;
    private Integer pendingDelivery;
    private Integer pendingReceive;
    private Integer completed;
    private Integer refunding;
}
