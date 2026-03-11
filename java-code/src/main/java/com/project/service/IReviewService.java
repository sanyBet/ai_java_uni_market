package com.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.project.common.result.PageResult;
import com.project.dto.mini.MiniReviewCreateDTO;
import com.project.entity.Review;
import com.project.vo.admin.AdminReviewVO;
import com.project.vo.mini.MiniReviewVO;

public interface IReviewService extends IService<Review> {

    PageResult<AdminReviewVO> listReviews(Integer rating, Long productId, Integer page, Integer pageSize);

    PageResult<MiniReviewVO> listMiniReviews(Long productId, Integer page, Integer pageSize);

    Long createReview(Long userId, MiniReviewCreateDTO dto);
}
