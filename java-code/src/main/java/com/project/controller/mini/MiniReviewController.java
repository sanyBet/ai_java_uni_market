package com.project.controller.mini;

import com.project.common.result.PageResult;
import com.project.common.result.Result;
import com.project.dto.mini.MiniReviewCreateDTO;
import com.project.service.IReviewService;
import com.project.vo.mini.MiniReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mini/reviews")
@RequiredArgsConstructor
public class MiniReviewController {

    private final IReviewService reviewService;

    @GetMapping
    public Result<PageResult<MiniReviewVO>> listReviews(
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "5") Integer pageSize) {
        return Result.success(reviewService.listMiniReviews(productId, page, pageSize));
    }

    @PostMapping
    public Result<Map<String, Long>> createReview(@RequestBody MiniReviewCreateDTO dto) {
        Long id = reviewService.createReview(getCurrentUserId(), dto);
        return Result.success(Map.of("id", id));
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Long) auth.getPrincipal();
    }
}
