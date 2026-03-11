package com.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.common.exception.BusinessException;
import com.project.common.result.PageResult;
import com.project.dto.mini.MiniReviewCreateDTO;
import com.project.entity.Order;
import com.project.entity.Review;
import com.project.entity.User;
import com.project.mapper.ReviewMapper;
import com.project.service.IOrderService;
import com.project.service.IReviewService;
import com.project.service.IUserService;
import com.project.vo.admin.AdminReviewVO;
import com.project.vo.mini.MiniReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl extends ServiceImpl<ReviewMapper, Review> implements IReviewService {

    private final ObjectMapper objectMapper;
    @Lazy
    private final IUserService userService;
    @Lazy
    private final IOrderService orderService;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public PageResult<AdminReviewVO> listReviews(Integer rating, Long productId, Integer page, Integer pageSize) {
        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        if (rating != null) {
            wrapper.eq(Review::getRating, rating);
        }
        if (productId != null) {
            wrapper.eq(Review::getProductId, productId);
        }
        wrapper.orderByDesc(Review::getCreateTime);
        Page<Review> result = page(new Page<>(page, pageSize), wrapper);
        List<AdminReviewVO> list = result.getRecords().stream().map(this::toVO).toList();
        return PageResult.of(list, result.getTotal(), page, pageSize);
    }

    @Override
    public PageResult<MiniReviewVO> listMiniReviews(Long productId, Integer page, Integer pageSize) {
        LambdaQueryWrapper<Review> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Review::getProductId, productId);
        wrapper.orderByDesc(Review::getCreateTime);
        Page<Review> result = page(new Page<>(page, pageSize), wrapper);
        List<MiniReviewVO> list = result.getRecords().stream().map(this::toMiniVO).toList();
        return PageResult.of(list, result.getTotal(), page, pageSize);
    }

    @Override
    public Long createReview(Long userId, MiniReviewCreateDTO dto) {
        // Verify order belongs to user and is completed
        Order order = orderService.getById(dto.getOrderId());
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException(404, "订单不存在");
        }
        if (order.getStatus() != 3) {
            throw new BusinessException(400, "仅已完成订单可评价");
        }
        // Check duplicate review
        long count = lambdaQuery()
                .eq(Review::getUserId, userId)
                .eq(Review::getOrderId, dto.getOrderId())
                .eq(Review::getProductId, dto.getProductId())
                .count();
        if (count > 0) {
            throw new BusinessException(400, "该商品已评价，不可重复评价");
        }
        Review review = new Review();
        review.setUserId(userId);
        review.setOrderId(dto.getOrderId());
        review.setProductId(dto.getProductId());
        review.setRating(dto.getRating());
        review.setContent(dto.getContent());
        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            try {
                review.setImages(objectMapper.writeValueAsString(dto.getImages()));
            } catch (JsonProcessingException e) {
                throw new BusinessException("JSON serialization failed");
            }
        }
        save(review);
        return review.getId();
    }

    private MiniReviewVO toMiniVO(Review r) {
        MiniReviewVO vo = new MiniReviewVO();
        vo.setId(r.getId());
        vo.setUserId(r.getUserId());
        vo.setRating(r.getRating());
        vo.setContent(r.getContent());
        vo.setCreateTime(r.getCreateTime() != null ? r.getCreateTime().format(FMT) : null);
        // Fetch user info for nickname and avatar
        User user = userService.getById(r.getUserId());
        if (user != null) {
            vo.setNickname(user.getNickname());
            vo.setAvatar(user.getAvatar());
        }
        try {
            if (StringUtils.hasText(r.getImages())) {
                vo.setImages(objectMapper.readValue(r.getImages(), new TypeReference<List<String>>() {}));
            } else {
                vo.setImages(Collections.emptyList());
            }
        } catch (JsonProcessingException e) {
            vo.setImages(Collections.emptyList());
        }
        return vo;
    }

    private AdminReviewVO toVO(Review r) {
        AdminReviewVO vo = new AdminReviewVO();
        vo.setId(r.getId());
        vo.setUserId(r.getUserId());
        vo.setProductId(r.getProductId());
        vo.setOrderId(r.getOrderId());
        vo.setRating(r.getRating());
        vo.setContent(r.getContent());
        vo.setCreateTime(r.getCreateTime() != null ? r.getCreateTime().format(FMT) : null);
        try {
            if (StringUtils.hasText(r.getImages())) {
                vo.setImages(objectMapper.readValue(r.getImages(), new TypeReference<List<String>>() {}));
            } else {
                vo.setImages(Collections.emptyList());
            }
        } catch (JsonProcessingException e) {
            vo.setImages(Collections.emptyList());
        }
        return vo;
    }
}
