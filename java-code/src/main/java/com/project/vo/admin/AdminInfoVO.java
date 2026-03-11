package com.project.vo.admin;

import lombok.Data;

@Data
public class AdminInfoVO {

    private Long id;

    private String account;

    private String nickname;

    private String role;

    private String avatar;

    private String createTime;
}
