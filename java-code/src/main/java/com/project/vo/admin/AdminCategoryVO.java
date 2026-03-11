package com.project.vo.admin;

import lombok.Data;

@Data
public class AdminCategoryVO {

    private Long id;

    private String name;

    private String image;

    private Integer sort;

    private Boolean showOnHome;

    private String createTime;
}
