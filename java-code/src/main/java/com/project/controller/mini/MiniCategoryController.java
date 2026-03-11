package com.project.controller.mini;

import com.project.common.result.PageResult;
import com.project.common.result.Result;
import com.project.service.ICategoryService;
import com.project.vo.mini.MiniCategoryVO;
import com.project.vo.mini.MiniProductListVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mini/categories")
@RequiredArgsConstructor
public class MiniCategoryController {

    private final ICategoryService categoryService;

    @GetMapping
    public Result<List<MiniCategoryVO>> getCategories() {
        return Result.success(categoryService.listMiniCategories());
    }

    @GetMapping("/{id}/products")
    public Result<PageResult<MiniProductListVO>> getCategoryProducts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(categoryService.listCategoryProducts(id, page, pageSize));
    }
}
