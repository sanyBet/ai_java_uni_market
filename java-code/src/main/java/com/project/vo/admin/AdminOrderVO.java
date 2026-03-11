package com.project.vo.admin;

import lombok.Data;

@Data
public class AdminOrderVO {

    private Long id;

    private Long userId;

    private String orderNo;

    private String contactName;

    private String contactPhone;

    private String totalAmount;

    private String discountAmount;

    private String payAmount;

    private Integer status;

    private String address;

    private String remark;

    private String createTime;
}
