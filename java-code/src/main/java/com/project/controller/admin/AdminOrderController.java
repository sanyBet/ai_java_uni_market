package com.project.controller.admin;

import com.project.common.result.PageResult;
import com.project.common.result.Result;
import com.project.dto.admin.AdminOrderStatusDTO;
import com.project.service.IOrderService;
import com.project.vo.admin.AdminOrderDetailVO;
import com.project.vo.admin.AdminOrderVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final IOrderService orderService;

    @GetMapping
    public Result<PageResult<AdminOrderVO>> list(@RequestParam(required = false) String orderNo,
                                                 @RequestParam(required = false) Integer status,
                                                 @RequestParam(defaultValue = "1") Integer page,
                                                 @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(orderService.listOrders(orderNo, status, page, pageSize));
    }

    @GetMapping("/{id}")
    public Result<AdminOrderDetailVO> detail(@PathVariable Long id) {
        return Result.success(orderService.getOrderDetail(id));
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestBody AdminOrderStatusDTO dto) {
        orderService.updateStatus(id, dto.getStatus());
        return Result.success();
    }
}
