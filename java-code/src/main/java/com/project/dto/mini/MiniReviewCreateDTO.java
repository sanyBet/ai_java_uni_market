package com.project.dto.mini;

import lombok.Data;

import java.util.List;

@Data
public class MiniReviewCreateDTO {
    private Long orderId;
    private Long productId;
    private Integer rating;
    private String content;
    private List<String> images;
}
