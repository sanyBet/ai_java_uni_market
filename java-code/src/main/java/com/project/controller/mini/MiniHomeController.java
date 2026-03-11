package com.project.controller.mini;

import com.project.common.result.Result;
import com.project.service.IBannerService;
import com.project.service.ICategoryService;
import com.project.service.IProductService;
import com.project.vo.mini.MiniHomeDataVO;
import com.project.vo.mini.MiniProductListVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mini/home")
@RequiredArgsConstructor
public class MiniHomeController {

    private final IBannerService bannerService;
    private final ICategoryService categoryService;
    private final IProductService productService;

    @GetMapping("/data")
    public Result<MiniHomeDataVO> getHomeData() {
        MiniHomeDataVO vo = new MiniHomeDataVO();
        vo.setBanners(bannerService.listMiniBanners());
        vo.setCategories(categoryService.listHomeCategories());
        vo.setRecommendProducts(productService.listRecommendProducts());
        return Result.success(vo);
    }
}
