package com.project.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.project.common.exception.BusinessException;
import com.project.dto.admin.AdminBannerDTO;
import com.project.entity.Banner;
import com.project.mapper.BannerMapper;
import com.project.service.IBannerService;
import com.project.vo.admin.AdminBannerVO;
import com.project.vo.mini.MiniHomeDataVO;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class BannerServiceImpl extends ServiceImpl<BannerMapper, Banner> implements IBannerService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public List<AdminBannerVO> listBanners() {
        List<Banner> banners = lambdaQuery().orderByDesc(Banner::getCreateTime).list();
        return banners.stream().map(this::toVO).toList();
    }

    @Override
    public Long createBanner(AdminBannerDTO dto) {
        Banner banner = new Banner();
        banner.setTitle(dto.getTitle());
        banner.setCover(dto.getCover());
        banner.setProductId(dto.getProductId());
        save(banner);
        return banner.getId();
    }

    @Override
    public void updateBanner(Long id, AdminBannerDTO dto) {
        Banner banner = getById(id);
        if (banner == null) {
            throw new BusinessException(404, "轮播图不存在");
        }
        banner.setTitle(dto.getTitle());
        banner.setCover(dto.getCover());
        banner.setProductId(dto.getProductId());
        updateById(banner);
    }

    @Override
    public List<MiniHomeDataVO.BannerItem> listMiniBanners() {
        List<Banner> banners = lambdaQuery().orderByDesc(Banner::getCreateTime).list();
        return banners.stream().map(b -> {
            MiniHomeDataVO.BannerItem item = new MiniHomeDataVO.BannerItem();
            item.setId(b.getId());
            item.setTitle(b.getTitle());
            item.setCover(b.getCover());
            item.setProductId(b.getProductId());
            return item;
        }).toList();
    }

    private AdminBannerVO toVO(Banner b) {
        AdminBannerVO vo = new AdminBannerVO();
        vo.setId(b.getId());
        vo.setTitle(b.getTitle());
        vo.setCover(b.getCover());
        vo.setProductId(b.getProductId());
        vo.setCreateTime(b.getCreateTime() != null ? b.getCreateTime().format(FMT) : null);
        return vo;
    }
}
