package com.project.controller.admin;

import com.project.common.result.Result;
import com.project.dto.admin.AdminCategoryDTO;
import com.project.service.ICategoryService;
import com.project.vo.admin.AdminCategoryVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final ICategoryService categoryService;

    @GetMapping
    public Result<List<AdminCategoryVO>> list() {
        return Result.success(categoryService.listCategories());
    }

    @PostMapping
    public Result<Map<String, Long>> create(@RequestBody AdminCategoryDTO dto) {
        Long id = categoryService.createCategory(dto);
        return Result.success(Map.of("id", id));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody AdminCategoryDTO dto) {
        categoryService.updateCategory(id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return Result.success();
    }
}
