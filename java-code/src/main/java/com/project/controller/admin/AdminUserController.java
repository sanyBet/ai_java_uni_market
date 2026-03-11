package com.project.controller.admin;

import com.project.common.result.PageResult;
import com.project.common.result.Result;
import com.project.service.IUserService;
import com.project.vo.admin.AdminUserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final IUserService userService;

    @GetMapping
    public Result<PageResult<AdminUserVO>> list(@RequestParam(required = false) String keyword,
                                                @RequestParam(defaultValue = "1") Integer page,
                                                @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(userService.listUsers(keyword, page, pageSize));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.removeById(id);
        return Result.success();
    }
}
