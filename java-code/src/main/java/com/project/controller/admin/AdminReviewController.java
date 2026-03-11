package com.project.controller.admin;

import com.project.common.result.PageResult;
import com.project.common.result.Result;
import com.project.service.IReviewService;
import com.project.vo.admin.AdminReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final IReviewService reviewService;

    @GetMapping
    public Result<PageResult<AdminReviewVO>> list(@RequestParam(required = false) Integer rating,
                                                  @RequestParam(required = false) Long productId,
                                                  @RequestParam(defaultValue = "1") Integer page,
                                                  @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(reviewService.listReviews(rating, productId, page, pageSize));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        reviewService.removeById(id);
        return Result.success();
    }
}
