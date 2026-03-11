package com.project.dto.admin;

import lombok.Data;

@Data
public class AdminOrderStatusDTO {

    /** 目标状态：0 待支付 / 1 待发货 / 2 待收货 / 3 已完成 / 4 退款售后 */
    private Integer status;
}
