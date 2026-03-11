package com.project.controller.mini;

import com.project.common.result.PageResult;
import com.project.common.result.Result;
import com.project.dto.mini.MiniOrderCreateDTO;
import com.project.service.IOrderService;
import com.project.vo.mini.MiniOrderCreateVO;
import com.project.vo.mini.MiniOrderDetailVO;
import com.project.vo.mini.MiniOrderVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mini/orders")
@RequiredArgsConstructor
public class MiniOrderController {

    private final IOrderService orderService;

    @PostMapping
    public Result<MiniOrderCreateVO> createOrder(@RequestBody MiniOrderCreateDTO dto) {
        return Result.success(orderService.createOrder(getCurrentUserId(), dto));
    }

    @GetMapping
    public Result<PageResult<MiniOrderVO>> listOrders(
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(orderService.listMiniOrders(getCurrentUserId(), status, page, pageSize));
    }

    @GetMapping("/{id}")
    public Result<MiniOrderDetailVO> getOrderDetail(@PathVariable Long id) {
        return Result.success(orderService.getMiniOrderDetail(getCurrentUserId(), id));
    }

    @PutMapping("/{id}/cancel")
    public Result<Void> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(getCurrentUserId(), id);
        return Result.success();
    }

    @PutMapping("/{id}/pay")
    public Result<Void> payOrder(@PathVariable Long id) {
        orderService.payOrder(getCurrentUserId(), id);
        return Result.success();
    }

    @PutMapping("/{id}/refund")
    public Result<Void> applyRefund(@PathVariable Long id) {
        orderService.applyRefund(getCurrentUserId(), id);
        return Result.success();
    }

    @PutMapping("/{id}/confirm")
    public Result<Void> confirmOrder(@PathVariable Long id) {
        orderService.confirmOrder(getCurrentUserId(), id);
        return Result.success();
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Long) auth.getPrincipal();
    }
}
