package com.project.controller.mini;

import com.project.common.result.PageResult;
import com.project.common.result.Result;
import com.project.service.IProductService;
import com.project.vo.mini.MiniProductDetailVO;
import com.project.vo.mini.MiniProductListVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mini/products")
@RequiredArgsConstructor
public class MiniProductController {

    private final IProductService productService;

    @GetMapping("/search")
    public Result<PageResult<MiniProductListVO>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "default") String sort,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        return Result.success(productService.searchProducts(keyword, sort, page, pageSize));
    }

    @GetMapping("/hot-keywords")
    public Result<List<String>> getHotKeywords() {
        return Result.success(productService.getHotKeywords());
    }

    @GetMapping("/{id}")
    public Result<MiniProductDetailVO> getDetail(@PathVariable Long id) {
        return Result.success(productService.getMiniProductDetail(id));
    }
}
