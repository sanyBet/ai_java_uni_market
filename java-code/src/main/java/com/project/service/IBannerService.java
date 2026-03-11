package com.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.project.dto.admin.AdminBannerDTO;
import com.project.entity.Banner;
import com.project.vo.admin.AdminBannerVO;
import com.project.vo.mini.MiniHomeDataVO;

import java.util.List;

public interface IBannerService extends IService<Banner> {

    List<AdminBannerVO> listBanners();

    Long createBanner(AdminBannerDTO dto);

    void updateBanner(Long id, AdminBannerDTO dto);

    List<MiniHomeDataVO.BannerItem> listMiniBanners();
}
