package com.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("`order`")
public class Order {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String orderNo;

    private String contactName;

    private String contactPhone;

    private BigDecimal totalAmount;

    private BigDecimal discountAmount;

    private BigDecimal payAmount;

    /**
     * 0 待支付 / 1 待发货 / 2 待收货 / 3 已完成 / 4 退款售后 / 5 已取消
     */
    private Integer status;

    private String address;

    private String remark;

    /** 订单商品信息（JSON Array） */
    private String orderItems;

    @TableLogic
    private Integer isDeleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
