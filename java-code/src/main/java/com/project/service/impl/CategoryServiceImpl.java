package com.project.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.project.common.exception.BusinessException;
import com.project.dto.admin.AdminCategoryDTO;
import com.project.entity.Category;
import com.project.entity.Product;
import com.project.mapper.CategoryMapper;
import com.project.service.ICategoryService;
import com.project.service.IProductService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.project.common.result.PageResult;
import com.project.vo.admin.AdminCategoryVO;
import com.project.vo.mini.MiniCategoryVO;
import com.project.vo.mini.MiniHomeDataVO;
import com.project.vo.mini.MiniProductListVO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements ICategoryService {

    @Lazy
    private final IProductService productService;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public List<AdminCategoryVO> listCategories() {
        List<Category> categories = lambdaQuery().orderByAsc(Category::getSort).list();
        return categories.stream().map(this::toVO).toList();
    }

    @Override
    public Long createCategory(AdminCategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setImage(dto.getImage());
        category.setSort(dto.getSort() != null ? dto.getSort() : 0);
        category.setShowOnHome(dto.getShowOnHome() != null ? dto.getShowOnHome() : false);
        save(category);
        return category.getId();
    }

    @Override
    public void updateCategory(Long id, AdminCategoryDTO dto) {
        Category category = getById(id);
        if (category == null) {
            throw new BusinessException(404, "分类不存在");
        }
        category.setName(dto.getName());
        category.setImage(dto.getImage());
        if (dto.getSort() != null) {
            category.setSort(dto.getSort());
        }
        if (dto.getShowOnHome() != null) {
            category.setShowOnHome(dto.getShowOnHome());
        }
        updateById(category);
    }

    @Override
    public void deleteCategory(Long id) {
        if (getById(id) == null) {
            throw new BusinessException(404, "分类不存在");
        }
        long productCount = productService.lambdaQuery()
                .eq(Product::getCategoryId, id)
                .eq(Product::getStatus, 1)
                .count();
        if (productCount > 0) {
            throw new BusinessException(400, "该分类下存在上架商品，无法删除");
        }
        removeById(id);
    }

    @Override
    public List<MiniHomeDataVO.CategoryItem> listHomeCategories() {
        List<Category> categories = lambdaQuery()
                .eq(Category::getShowOnHome, true)
                .orderByAsc(Category::getSort)
                .list();
        return categories.stream().map(c -> {
            MiniHomeDataVO.CategoryItem item = new MiniHomeDataVO.CategoryItem();
            item.setId(c.getId());
            item.setName(c.getName());
            item.setImage(c.getImage());
            return item;
        }).toList();
    }

    @Override
    public List<MiniCategoryVO> listMiniCategories() {
        List<Category> categories = lambdaQuery().orderByAsc(Category::getSort).list();
        return categories.stream().map(c -> {
            MiniCategoryVO vo = new MiniCategoryVO();
            vo.setId(c.getId());
            vo.setName(c.getName());
            vo.setImage(c.getImage());
            vo.setSort(c.getSort());
            return vo;
        }).toList();
    }

    @Override
    public PageResult<MiniProductListVO> listCategoryProducts(Long categoryId, Integer page, Integer pageSize) {
        Page<Product> result = productService.lambdaQuery()
                .eq(Product::getCategoryId, categoryId)
                .eq(Product::getStatus, 1)
                .orderByDesc(Product::getCreateTime)
                .page(new Page<>(page, pageSize));
        List<MiniProductListVO> list = result.getRecords().stream().map(this::toMiniProductVO).toList();
        return PageResult.of(list, result.getTotal(), page, pageSize);
    }

    private MiniProductListVO toMiniProductVO(Product p) {
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

    private AdminCategoryVO toVO(Category c) {
        AdminCategoryVO vo = new AdminCategoryVO();
        vo.setId(c.getId());
        vo.setName(c.getName());
        vo.setImage(c.getImage());
        vo.setSort(c.getSort());
        vo.setShowOnHome(c.getShowOnHome());
        vo.setCreateTime(c.getCreateTime() != null ? c.getCreateTime().format(FMT) : null);
        return vo;
    }
}
