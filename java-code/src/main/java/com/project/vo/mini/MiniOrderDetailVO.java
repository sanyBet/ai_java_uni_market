package com.project.vo.mini;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class MiniOrderDetailVO extends MiniOrderVO {
    private String contactName;
    private String contactPhone;
    private String address;
    private String totalAmount;
    private String discountAmount;
    private String remark;
}
