package com.project.vo.admin;

import lombok.Data;

@Data
public class AdminLoginVO {

    private String token;

    private AdminInfoVO adminInfo;
}
