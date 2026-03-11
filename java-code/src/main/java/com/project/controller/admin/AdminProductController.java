package com.project.controller.admin;

import com.project.common.result.PageResult;
import com.project.common.result.Result;
import com.project.dto.admin.AdminProductDTO;
import com.project.service.IProductService;
import com.project.vo.admin.AdminProductDetailVO;
import com.project.vo.admin.AdminProductVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final IProductService productService;

    @GetMapping
    public Result<PageResult<AdminProductVO>> list(@RequestParam(required = false) String keyword,
                                                   @RequestParam(required = false) Integer status,
                                                   @RequestParam(required = false) Long categoryId,
                                                   @RequestParam(defaultValue = "1") Integer page,
                                                   @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(productService.listProducts(keyword, status, categoryId, page, pageSize));
    }

    @GetMapping("/{id}")
    public Result<AdminProductDetailVO> detail(@PathVariable Long id) {
        return Result.success(productService.getProductDetail(id));
    }

    @PostMapping
    public Result<Map<String, Long>> create(@RequestBody AdminProductDTO dto) {
        Long id = productService.createProduct(dto);
        return Result.success(Map.of("id", id));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody AdminProductDTO dto) {
        productService.updateProduct(id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return Result.success();
    }
}
