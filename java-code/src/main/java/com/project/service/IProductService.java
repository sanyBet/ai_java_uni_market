package com.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.project.common.result.PageResult;
import com.project.dto.admin.AdminProductDTO;
import com.project.entity.Product;
import com.project.vo.admin.AdminProductDetailVO;
import com.project.vo.admin.AdminProductVO;
import com.project.vo.mini.MiniProductListVO;
import com.project.vo.mini.MiniProductDetailVO;

import java.util.List;

public interface IProductService extends IService<Product> {

    PageResult<AdminProductVO> listProducts(String keyword, Integer status, Long categoryId, Integer page, Integer pageSize);

    AdminProductDetailVO getProductDetail(Long id);

    Long createProduct(AdminProductDTO dto);

    void updateProduct(Long id, AdminProductDTO dto);

    void deleteProduct(Long id);

    List<MiniProductListVO> listRecommendProducts();

    PageResult<MiniProductListVO> searchProducts(String keyword, String sort, Integer page, Integer pageSize);

    List<String> getHotKeywords();

    MiniProductDetailVO getMiniProductDetail(Long id);
}
