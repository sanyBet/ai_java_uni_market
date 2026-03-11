package com.project.dto.admin;

import lombok.Data;

@Data
public class AdminCategoryDTO {

    private String name;

    private String image;

    private Integer sort;

    private Boolean showOnHome;
}
