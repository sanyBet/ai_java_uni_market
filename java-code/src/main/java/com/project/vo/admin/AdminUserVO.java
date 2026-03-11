package com.project.vo.admin;

import lombok.Data;

@Data
public class AdminUserVO {

    private Long id;

    private String avatar;

    private String nickname;

    private String account;

    private String openid;

    private String createTime;
}
