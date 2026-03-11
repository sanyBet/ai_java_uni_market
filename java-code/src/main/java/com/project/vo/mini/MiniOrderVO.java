package com.project.vo.mini;

import lombok.Data;

import java.util.List;

@Data
public class MiniOrderVO {
    private Long id;
    private String orderNo;
    private Integer status;
    private String payAmount;
    private String createTime;
    private List<MiniOrderItemVO> orderItems;
}
