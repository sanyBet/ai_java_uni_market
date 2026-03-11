package com.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.project.common.result.PageResult;
import com.project.dto.mini.MiniOrderCreateDTO;
import com.project.entity.Order;
import com.project.vo.admin.AdminDashboardVO;
import com.project.vo.admin.AdminOrderDetailVO;
import com.project.vo.admin.AdminOrderVO;
import com.project.vo.mini.MiniOrderCreateVO;
import com.project.vo.mini.MiniOrderDetailVO;
import com.project.vo.mini.MiniOrderVO;

import java.util.List;

public interface IOrderService extends IService<Order> {

    PageResult<AdminOrderVO> listOrders(String orderNo, Integer status, Integer page, Integer pageSize);

    AdminOrderDetailVO getOrderDetail(Long id);

    void updateStatus(Long id, Integer status);

    String getTodaySales();

    List<AdminDashboardVO.OrderTrend> getOrderTrend();

    List<AdminDashboardVO.SalesTrend> getSalesTrend();

    List<AdminDashboardVO.RecentOrder> getRecentOrders();

    MiniOrderCreateVO createOrder(Long userId, MiniOrderCreateDTO dto);

    PageResult<MiniOrderVO> listMiniOrders(Long userId, Integer status, Integer page, Integer pageSize);

    MiniOrderDetailVO getMiniOrderDetail(Long userId, Long orderId);

    void cancelOrder(Long userId, Long orderId);

    void payOrder(Long userId, Long orderId);

    void confirmOrder(Long userId, Long orderId);

    void applyRefund(Long userId, Long orderId);
}
