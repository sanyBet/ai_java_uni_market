package com.project.vo.mini;

import lombok.Data;

import java.util.List;

@Data
public class MiniHomeDataVO {
    private List<BannerItem> banners;
    private List<CategoryItem> categories;
    private List<MiniProductListVO> recommendProducts;

    @Data
    public static class BannerItem {
        private Long id;
        private String title;
        private String cover;
        private Long productId;
    }

    @Data
    public static class CategoryItem {
        private Long id;
        private String name;
        private String image;
    }
}
