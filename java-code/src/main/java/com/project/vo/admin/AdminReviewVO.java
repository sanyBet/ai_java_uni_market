package com.project.vo.admin;

import lombok.Data;

import java.util.List;

@Data
public class AdminReviewVO {

    private Long id;

    private Long userId;

    private Long productId;

    private Long orderId;

    private Integer rating;

    private String content;

    private List<String> images;

    private String createTime;
}
