package com.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.common.exception.BusinessException;
import com.project.common.result.PageResult;
import com.project.dto.admin.AdminProductDTO;
import com.project.entity.Product;
import com.project.mapper.ProductMapper;
import com.project.service.IProductService;
import com.project.service.IReviewService;
import com.project.entity.Review;
import com.project.vo.admin.AdminProductDetailVO;
import com.project.vo.admin.AdminProductVO;
import com.project.vo.mini.MiniProductListVO;
import com.project.vo.mini.MiniProductDetailVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Lazy;
import org.springframework.util.StringUtils;

import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements IProductService {

    private final ObjectMapper objectMapper;
    @Lazy
    private final IReviewService reviewService;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public PageResult<AdminProductVO> listProducts(String keyword, Integer status, Long categoryId,
                                                   Integer page, Integer pageSize) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.like(Product::getName, keyword);
        }
        if (status != null) {
            wrapper.eq(Product::getStatus, status);
        }
        if (categoryId != null) {
            wrapper.eq(Product::getCategoryId, categoryId);
        }
        wrapper.orderByDesc(Product::getCreateTime);
        Page<Product> result = page(new Page<>(page, pageSize), wrapper);
        List<AdminProductVO> list = result.getRecords().stream().map(this::toVO).toList();
        return PageResult.of(list, result.getTotal(), page, pageSize);
    }

    @Override
    public AdminProductDetailVO getProductDetail(Long id) {
        Product product = getById(id);
        if (product == null) {
            throw new BusinessException(404, "商品不存在");
        }
        return toDetailVO(product);
    }

    @Override
    public Long createProduct(AdminProductDTO dto) {
        Product product = new Product();
        copyDtoToEntity(dto, product);
        product.setSales(0);
        product.setViews(0);
        if (product.getStatus() == null) {
            product.setStatus(1);
        }
        if (product.getIsRecommend() == null) {
            product.setIsRecommend(0);
        }
        save(product);
        return product.getId();
    }

    @Override
    public void updateProduct(Long id, AdminProductDTO dto) {
        Product product = getById(id);
        if (product == null) {
            throw new BusinessException(404, "商品不存在");
        }
        copyDtoToEntity(dto, product);
        updateById(product);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = getById(id);
        if (product == null) {
            throw new BusinessException(404, "商品不存在");
        }
        product.setStatus(0);
        updateById(product);
        removeById(id);
    }

    private void copyDtoToEntity(AdminProductDTO dto, Product product) {
        product.setName(dto.getName());
        product.setCover(dto.getCover());
        product.setPrice(dto.getPrice());
        product.setOriginPrice(dto.getOriginPrice());
        product.setStock(dto.getStock());
        product.setDescription(dto.getDescription());
        product.setCategoryId(dto.getCategoryId());
        product.setStatus(dto.getStatus());
        product.setIsRecommend(dto.getIsRecommend());
        product.setSpecs(dto.getSpecs());
        try {
            if (dto.getDetailImgs() != null) {
                product.setDetailImgs(objectMapper.writeValueAsString(dto.getDetailImgs()));
            }
        } catch (JsonProcessingException e) {
            throw new BusinessException("JSON serialization failed");
        }
    }

    private AdminProductVO toVO(Product p) {
        AdminProductVO vo = new AdminProductVO();
        vo.setId(p.getId());
        vo.setName(p.getName());
        vo.setCover(p.getCover());
        vo.setPrice(p.getPrice() != null ? p.getPrice().toPlainString() : null);
        vo.setOriginPrice(p.getOriginPrice() != null ? p.getOriginPrice().toPlainString() : null);
        vo.setStock(p.getStock());
        vo.setSales(p.getSales());
        vo.setViews(p.getViews());
        vo.setStatus(p.getStatus());
        vo.setIsRecommend(p.getIsRecommend());
        vo.setCategoryId(p.getCategoryId());
        vo.setCreateTime(p.getCreateTime() != null ? p.getCreateTime().format(FMT) : null);
        return vo;
    }

    @Override
    public List<MiniProductListVO> listRecommendProducts() {
        List<Product> products = lambdaQuery()
                .eq(Product::getStatus, 1)
                .eq(Product::getIsRecommend, 1)
                .orderByDesc(Product::getSales)
                .list();
        return products.stream().map(this::toMiniListVO).toList();
    }

    @Override
    public PageResult<MiniProductListVO> searchProducts(String keyword, String sort, Integer page, Integer pageSize) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getStatus, 1);
        if (StringUtils.hasText(keyword)) {
            wrapper.like(Product::getName, keyword);
        }
        if ("sales".equals(sort)) {
            wrapper.orderByDesc(Product::getSales);
        } else if ("price_asc".equals(sort)) {
            wrapper.orderByAsc(Product::getPrice);
        } else if ("price_desc".equals(sort)) {
            wrapper.orderByDesc(Product::getPrice);
        } else {
            wrapper.orderByDesc(Product::getCreateTime);
        }
        Page<Product> result = page(new Page<>(page, pageSize), wrapper);
        List<MiniProductListVO> list = result.getRecords().stream().map(this::toMiniListVO).toList();
        return PageResult.of(list, result.getTotal(), page, pageSize);
    }

    @Override
    public List<String> getHotKeywords() {
        List<Product> products = lambdaQuery()
                .eq(Product::getStatus, 1)
                .orderByDesc(Product::getSales)
                .last("LIMIT 8")
                .list();
        return products.stream()
                .map(p -> {
                    String name = p.getName();
                    // Extract first meaningful keyword (before space or specific chars)
                    int idx = name.indexOf(' ');
                    return idx > 0 ? name.substring(0, idx) : name;
                })
                .distinct()
                .toList();
    }

    @Override
    public MiniProductDetailVO getMiniProductDetail(Long id) {
        Product product = getById(id);
        if (product == null) {
            throw new BusinessException(404, "商品不存在");
        }
        // Increment views
        product.setViews(product.getViews() + 1);
        updateById(product);

        MiniProductDetailVO vo = new MiniProductDetailVO();
        vo.setId(product.getId());
        vo.setName(product.getName());
        vo.setCover(product.getCover());
        vo.setPrice(product.getPrice() != null ? product.getPrice().toPlainString() : null);
        vo.setOriginPrice(product.getOriginPrice() != null ? product.getOriginPrice().toPlainString() : null);
        vo.setStock(product.getStock());
        vo.setSales(product.getSales());
        vo.setDescription(product.getDescription());
        vo.setCategoryId(product.getCategoryId());
        vo.setSpecs(product.getSpecs());
        vo.setStatus(product.getStatus());
        // Compute positive rate
        long totalReviews = reviewService.lambdaQuery().eq(Review::getProductId, id).count();
        vo.setReviewCount((int) totalReviews);
        if (totalReviews > 0) {
            long positiveReviews = reviewService.lambdaQuery().eq(Review::getProductId, id).ge(Review::getRating, 4).count();
            vo.setPositiveRate((int) (positiveReviews * 100 / totalReviews));
        }        try {
            if (StringUtils.hasText(product.getDetailImgs())) {
                vo.setDetailImgs(objectMapper.readValue(product.getDetailImgs(), new TypeReference<List<String>>() {}));
            } else {
                vo.setDetailImgs(Collections.emptyList());
            }
        } catch (JsonProcessingException e) {
            vo.setDetailImgs(Collections.emptyList());
        }
        return vo;
    }

    private MiniProductListVO toMiniListVO(Product p) {
        MiniProductListVO vo = new MiniProductListVO();
        vo.setId(p.getId());
        vo.setName(p.getName());
        vo.setCover(p.getCover());
        vo.setPrice(p.getPrice() != null ? p.getPrice().toPlainString() : null);
        vo.setOriginPrice(p.getOriginPrice() != null ? p.getOriginPrice().toPlainString() : null);
        vo.setSales(p.getSales());
        vo.setIsRecommend(p.getIsRecommend());
        return vo;
    }

    private AdminProductDetailVO toDetailVO(Product p) {
        AdminProductDetailVO vo = new AdminProductDetailVO();
        vo.setId(p.getId());
        vo.setName(p.getName());
        vo.setCover(p.getCover());
        vo.setPrice(p.getPrice() != null ? p.getPrice().toPlainString() : null);
        vo.setOriginPrice(p.getOriginPrice() != null ? p.getOriginPrice().toPlainString() : null);
        vo.setStock(p.getStock());
        vo.setSales(p.getSales());
        vo.setViews(p.getViews());
        vo.setStatus(p.getStatus());
        vo.setIsRecommend(p.getIsRecommend());
        vo.setDescription(p.getDescription());
        vo.setCategoryId(p.getCategoryId());
        vo.setCreateTime(p.getCreateTime() != null ? p.getCreateTime().format(FMT) : null);
        vo.setUpdateTime(p.getUpdateTime() != null ? p.getUpdateTime().format(FMT) : null);
        vo.setSpecs(p.getSpecs());
        try {
            if (StringUtils.hasText(p.getDetailImgs())) {
                vo.setDetailImgs(objectMapper.readValue(p.getDetailImgs(), new TypeReference<List<String>>() {}));
            } else {
                vo.setDetailImgs(Collections.emptyList());
            }
        } catch (JsonProcessingException e) {
            throw new BusinessException("JSON deserialization failed");
        }
        return vo;
    }
}
