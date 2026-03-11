package com.project.vo.admin;

import lombok.Data;

@Data
public class AdminBannerVO {

    private Long id;

    private String title;

    private String cover;

    private Long productId;

    private String createTime;
}
