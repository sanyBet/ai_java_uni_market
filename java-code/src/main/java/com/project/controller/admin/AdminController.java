package com.project.controller.admin;

import com.project.common.result.PageResult;
import com.project.common.result.Result;
import com.project.dto.admin.AdminCreateDTO;
import com.project.dto.admin.AdminResetPasswordDTO;
import com.project.dto.admin.AdminUpdateDTO;
import com.project.service.IAdminService;
import com.project.vo.admin.AdminInfoVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/admins")
@RequiredArgsConstructor
public class AdminController {

    private final IAdminService adminService;

    @GetMapping
    public Result<PageResult<AdminInfoVO>> list(@RequestParam(required = false) String keyword,
                                                @RequestParam(required = false) String role,
                                                @RequestParam(defaultValue = "1") Integer page,
                                                @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(adminService.listAdmins(keyword, role, page, pageSize));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Result<Map<String, Long>> create(@RequestBody AdminCreateDTO dto) {
        Long id = adminService.createAdmin(dto);
        return Result.success(Map.of("id", id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Result<Void> update(@PathVariable Long id, @RequestBody AdminUpdateDTO dto) {
        adminService.updateAdmin(id, dto);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Result<Void> delete(@PathVariable Long id) {
        Long currentAdminId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        adminService.deleteAdmin(id, currentAdminId);
        return Result.success();
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public Result<Void> resetPassword(@PathVariable Long id, @RequestBody AdminResetPasswordDTO dto) {
        adminService.resetPassword(id, dto);
        return Result.success();
    }
}
