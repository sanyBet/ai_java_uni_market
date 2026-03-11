package com.project.vo.mini;

import lombok.Data;

@Data
public class MiniLoginVO {
    private String token;
    private MiniUserInfoVO userInfo;
}
