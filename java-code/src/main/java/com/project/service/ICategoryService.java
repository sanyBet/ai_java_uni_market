package com.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.project.dto.admin.AdminCategoryDTO;
import com.project.entity.Category;
import com.project.common.result.PageResult;
import com.project.vo.admin.AdminCategoryVO;
import com.project.vo.mini.MiniCategoryVO;
import com.project.vo.mini.MiniHomeDataVO;
import com.project.vo.mini.MiniProductListVO;

import java.util.List;

public interface ICategoryService extends IService<Category> {

    List<AdminCategoryVO> listCategories();

    Long createCategory(AdminCategoryDTO dto);

    void updateCategory(Long id, AdminCategoryDTO dto);

    void deleteCategory(Long id);

    List<MiniHomeDataVO.CategoryItem> listHomeCategories();

    List<MiniCategoryVO> listMiniCategories();

    PageResult<MiniProductListVO> listCategoryProducts(Long categoryId, Integer page, Integer pageSize);
}
