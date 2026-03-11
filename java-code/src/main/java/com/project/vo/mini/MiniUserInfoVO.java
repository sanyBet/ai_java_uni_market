package com.project.vo.mini;

import lombok.Data;

@Data
public class MiniUserInfoVO {
    private Long id;
    private String account;
    private String nickname;
    private String avatar;
    private String createTime;
    private String memberLevel;
}
