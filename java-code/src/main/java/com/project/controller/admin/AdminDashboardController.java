package com.project.controller.admin;

import com.project.common.result.Result;
import com.project.service.IOrderService;
import com.project.service.IProductService;
import com.project.service.IUserService;
import com.project.vo.admin.AdminDashboardVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final IUserService userService;
    private final IProductService productService;
    private final IOrderService orderService;

    @GetMapping("/stats")
    public Result<AdminDashboardVO> stats() {
        AdminDashboardVO vo = new AdminDashboardVO();
        vo.setUserCount(userService.count());
        vo.setProductCount(productService.count());
        vo.setOrderCount(orderService.count());
        vo.setTodaySales(orderService.getTodaySales());
        vo.setOrderTrend(orderService.getOrderTrend());
        vo.setSalesTrend(orderService.getSalesTrend());
        vo.setRecentOrders(orderService.getRecentOrders());
        return Result.success(vo);
    }
}
