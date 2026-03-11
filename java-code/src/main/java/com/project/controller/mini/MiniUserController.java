package com.project.controller.mini;

import com.project.common.result.Result;
import com.project.dto.mini.MiniUserUpdateDTO;
import com.project.service.IUserService;
import com.project.vo.mini.MiniOrderStatsVO;
import com.project.vo.mini.MiniUserInfoVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mini/user")
@RequiredArgsConstructor
public class MiniUserController {

    private final IUserService userService;

    @GetMapping("/profile")
    public Result<MiniUserInfoVO> getProfile() {
        return Result.success(userService.getMiniUserInfo(getCurrentUserId()));
    }

    @PutMapping("/profile")
    public Result<Void> updateProfile(@RequestBody MiniUserUpdateDTO dto) {
        userService.updateMiniUserInfo(getCurrentUserId(), dto);
        return Result.success();
    }

    @GetMapping("/order-stats")
    public Result<MiniOrderStatsVO> getOrderStats() {
        return Result.success(userService.getOrderStats(getCurrentUserId()));
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Long) auth.getPrincipal();
    }
}
