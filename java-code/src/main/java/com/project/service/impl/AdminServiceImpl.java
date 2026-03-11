package com.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.project.common.exception.BusinessException;
import com.project.common.result.PageResult;
import com.project.common.util.JwtUtil;
import com.project.dto.admin.*;
import com.project.entity.Admin;
import com.project.mapper.AdminMapper;
import com.project.service.IAdminService;
import com.project.vo.admin.AdminInfoVO;
import com.project.vo.admin.AdminLoginVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl extends ServiceImpl<AdminMapper, Admin> implements IAdminService {

    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public AdminLoginVO login(AdminLoginDTO dto) {
        Admin admin = lambdaQuery().eq(Admin::getAccount, dto.getAccount()).one();
        if (admin == null || !passwordEncoder.matches(dto.getPassword(), admin.getPassword())) {
            throw new BusinessException(400, "账号或密码错误");
        }
        String token = jwtUtil.generateToken(admin.getId(), admin.getAccount(), admin.getRole());
        AdminLoginVO vo = new AdminLoginVO();
        vo.setToken(token);
        vo.setAdminInfo(toInfoVO(admin));
        return vo;
    }

    @Override
    public AdminInfoVO getAdminInfo(Long adminId) {
        Admin admin = getById(adminId);
        if (admin == null) {
            throw new BusinessException(404, "管理员不存在");
        }
        return toInfoVO(admin);
    }

    @Override
    public PageResult<AdminInfoVO> listAdmins(String keyword, String role, Integer page, Integer pageSize) {
        LambdaQueryWrapper<Admin> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Admin::getAccount, keyword).or().like(Admin::getNickname, keyword));
        }
        if (StringUtils.hasText(role)) {
            wrapper.eq(Admin::getRole, role);
        }
        wrapper.orderByDesc(Admin::getCreateTime);
        Page<Admin> result = page(new Page<>(page, pageSize), wrapper);
        List<AdminInfoVO> list = result.getRecords().stream().map(this::toInfoVO).toList();
        return PageResult.of(list, result.getTotal(), page, pageSize);
    }

    @Override
    public Long createAdmin(AdminCreateDTO dto) {
        long count = lambdaQuery().eq(Admin::getAccount, dto.getAccount()).count();
        if (count > 0) {
            throw new BusinessException(400, "账号已存在");
        }
        Admin admin = new Admin();
        admin.setAccount(dto.getAccount());
        admin.setPassword(passwordEncoder.encode(dto.getPassword()));
        admin.setNickname(dto.getNickname());
        admin.setRole(dto.getRole());
        admin.setAvatar(dto.getAvatar());
        save(admin);
        return admin.getId();
    }

    @Override
    public void updateAdmin(Long id, AdminUpdateDTO dto) {
        Admin admin = getById(id);
        if (admin == null) {
            throw new BusinessException(404, "管理员不存在");
        }
        long count = lambdaQuery().eq(Admin::getAccount, dto.getAccount()).ne(Admin::getId, id).count();
        if (count > 0) {
            throw new BusinessException(400, "账号已存在");
        }
        admin.setAccount(dto.getAccount());
        admin.setNickname(dto.getNickname());
        admin.setRole(dto.getRole());
        admin.setAvatar(dto.getAvatar());
        updateById(admin);
    }

    @Override
    public void deleteAdmin(Long id, Long currentAdminId) {
        if (id.equals(currentAdminId)) {
            throw new BusinessException(400, "不能删除自身账号");
        }
        if (getById(id) == null) {
            throw new BusinessException(404, "管理员不存在");
        }
        removeById(id);
    }

    @Override
    public void resetPassword(Long id, AdminResetPasswordDTO dto) {
        Admin admin = getById(id);
        if (admin == null) {
            throw new BusinessException(404, "管理员不存在");
        }
        admin.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        updateById(admin);
    }

    private AdminInfoVO toInfoVO(Admin admin) {
        AdminInfoVO vo = new AdminInfoVO();
        vo.setId(admin.getId());
        vo.setAccount(admin.getAccount());
        vo.setNickname(admin.getNickname());
        vo.setRole(admin.getRole());
        vo.setAvatar(admin.getAvatar());
        vo.setCreateTime(admin.getCreateTime() != null ? admin.getCreateTime().format(FMT) : null);
        return vo;
    }
}
