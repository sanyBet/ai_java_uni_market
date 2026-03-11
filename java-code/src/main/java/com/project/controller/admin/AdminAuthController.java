package com.project.controller.admin;

import com.project.common.result.Result;
import com.project.dto.admin.AdminLoginDTO;
import com.project.service.IAdminService;
import com.project.vo.admin.AdminInfoVO;
import com.project.vo.admin.AdminLoginVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final IAdminService adminService;

    @PostMapping("/login")
    public Result<AdminLoginVO> login(@RequestBody AdminLoginDTO dto) {
        return Result.success(adminService.login(dto));
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        return Result.success();
    }

    @GetMapping("/me")
    public Result<AdminInfoVO> me() {
        Long adminId = getCurrentAdminId();
        return Result.success(adminService.getAdminInfo(adminId));
    }

    private Long getCurrentAdminId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Long) auth.getPrincipal();
    }
}
