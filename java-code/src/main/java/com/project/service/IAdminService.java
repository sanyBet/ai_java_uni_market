package com.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.project.common.result.PageResult;
import com.project.dto.admin.*;
import com.project.entity.Admin;
import com.project.vo.admin.AdminInfoVO;
import com.project.vo.admin.AdminLoginVO;

public interface IAdminService extends IService<Admin> {

    AdminLoginVO login(AdminLoginDTO dto);

    AdminInfoVO getAdminInfo(Long adminId);

    PageResult<AdminInfoVO> listAdmins(String keyword, String role, Integer page, Integer pageSize);

    Long createAdmin(AdminCreateDTO dto);

    void updateAdmin(Long id, AdminUpdateDTO dto);

    void deleteAdmin(Long id, Long currentAdminId);

    void resetPassword(Long id, AdminResetPasswordDTO dto);
}
