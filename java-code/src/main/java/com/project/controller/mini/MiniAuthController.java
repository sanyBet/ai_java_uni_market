package com.project.controller.mini;

import com.project.common.result.Result;
import com.project.dto.mini.MiniLoginDTO;
import com.project.dto.mini.MiniRegisterDTO;
import com.project.service.IUserService;
import com.project.vo.mini.MiniLoginVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mini/auth")
@RequiredArgsConstructor
public class MiniAuthController {

    private final IUserService userService;

    @PostMapping("/login")
    public Result<MiniLoginVO> login(@RequestBody MiniLoginDTO dto) {
        return Result.success(userService.miniLogin(dto));
    }

    @PostMapping("/register")
    public Result<MiniLoginVO> register(@RequestBody MiniRegisterDTO dto) {
        return Result.success(userService.miniRegister(dto));
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        return Result.success();
    }
}
