package com.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.project.common.result.PageResult;
import com.project.dto.mini.MiniLoginDTO;
import com.project.dto.mini.MiniRegisterDTO;
import com.project.dto.mini.MiniUserUpdateDTO;
import com.project.entity.User;
import com.project.vo.admin.AdminUserVO;
import com.project.vo.mini.MiniLoginVO;
import com.project.vo.mini.MiniUserInfoVO;
import com.project.vo.mini.MiniOrderStatsVO;

public interface IUserService extends IService<User> {

    PageResult<AdminUserVO> listUsers(String keyword, Integer page, Integer pageSize);

    MiniLoginVO miniLogin(MiniLoginDTO dto);

    MiniLoginVO miniRegister(MiniRegisterDTO dto);

    MiniUserInfoVO getMiniUserInfo(Long userId);

    void updateMiniUserInfo(Long userId, MiniUserUpdateDTO dto);

    MiniOrderStatsVO getOrderStats(Long userId);
}
