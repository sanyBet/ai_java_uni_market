package com.project.vo.mini;

import lombok.Data;

import java.util.List;

@Data
public class MiniReviewVO {
    private Long id;
    private Long userId;
    private String nickname;
    private String avatar;
    private Integer rating;
    private String content;
    private List<String> images;
    private String createTime;
}
