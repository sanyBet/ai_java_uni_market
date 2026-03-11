package com.project.controller.admin;

import com.project.common.result.Result;
import com.project.dto.admin.AdminBannerDTO;
import com.project.service.IBannerService;
import com.project.vo.admin.AdminBannerVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/banners")
@RequiredArgsConstructor
public class AdminBannerController {

    private final IBannerService bannerService;

    @GetMapping
    public Result<List<AdminBannerVO>> list() {
        return Result.success(bannerService.listBanners());
    }

    @PostMapping
    public Result<Map<String, Long>> create(@RequestBody AdminBannerDTO dto) {
        Long id = bannerService.createBanner(dto);
        return Result.success(Map.of("id", id));
    }

    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @RequestBody AdminBannerDTO dto) {
        bannerService.updateBanner(id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        bannerService.removeById(id);
        return Result.success();
    }
}
