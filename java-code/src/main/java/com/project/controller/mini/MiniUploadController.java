package com.project.controller.mini;

import com.project.common.result.Result;
import com.project.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/mini/upload")
@RequiredArgsConstructor
public class MiniUploadController {

    private final FileService fileService;

    @PostMapping
    public Result<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        String url = fileService.upload(file);
        return Result.success(Map.of("url", url));
    }
}
