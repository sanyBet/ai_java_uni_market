package com.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.common.exception.BusinessException;
import com.project.common.result.PageResult;
import com.project.dto.mini.MiniOrderCreateDTO;
import com.project.entity.Order;
import com.project.entity.Product;
import com.project.mapper.OrderMapper;
import com.project.service.IOrderService;
import com.project.service.IProductService;
import com.project.vo.admin.AdminDashboardVO;
import com.project.vo.admin.AdminOrderDetailVO;
import com.project.vo.admin.AdminOrderVO;
import com.project.vo.mini.MiniOrderCreateVO;
import com.project.vo.mini.MiniOrderDetailVO;
import com.project.vo.mini.MiniOrderItemVO;
import com.project.vo.mini.MiniOrderVO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements IOrderService {

    private final ObjectMapper objectMapper;
    @Lazy
    private final IProductService productService;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("M/d");

    @Override
    public PageResult<AdminOrderVO> listOrders(String orderNo, Integer status, Integer page, Integer pageSize) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(orderNo)) {
            wrapper.like(Order::getOrderNo, orderNo);
        }
        if (status != null) {
            wrapper.eq(Order::getStatus, status);
        }
        wrapper.orderByDesc(Order::getCreateTime);
        Page<Order> result = page(new Page<>(page, pageSize), wrapper);
        List<AdminOrderVO> list = result.getRecords().stream().map(this::toVO).toList();
        return PageResult.of(list, result.getTotal(), page, pageSize);
    }

    @Override
    public AdminOrderDetailVO getOrderDetail(Long id) {
        Order order = getById(id);
        if (order == null) {
            throw new BusinessException(404, "订单不存在");
        }
        AdminOrderDetailVO vo = new AdminOrderDetailVO();
        copyToVO(order, vo);
        try {
            if (StringUtils.hasText(order.getOrderItems())) {
                List<AdminOrderDetailVO.OrderItemVO> items = objectMapper.readValue(
                        order.getOrderItems(), new TypeReference<>() {});
                vo.setOrderItems(items);
            } else {
                vo.setOrderItems(Collections.emptyList());
            }
        } catch (JsonProcessingException e) {
            throw new BusinessException("JSON deserialization failed");
        }
        return vo;
    }

    @Override
    public void updateStatus(Long id, Integer status) {
        Order order = getById(id);
        if (order == null) {
            throw new BusinessException(404, "订单不存在");
        }
        order.setStatus(status);
        updateById(order);
    }

    @Override
    public String getTodaySales() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        List<Order> orders = lambdaQuery()
                .ge(Order::getCreateTime, startOfDay)
                .le(Order::getCreateTime, endOfDay)
                .ne(Order::getStatus, 0)
                .list();
        BigDecimal total = orders.stream()
                .map(Order::getPayAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total.setScale(2).toPlainString();
    }

    @Override
    public List<AdminDashboardVO.OrderTrend> getOrderTrend() {
        List<AdminDashboardVO.OrderTrend> trends = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            long count = lambdaQuery()
                    .ge(Order::getCreateTime, date.atStartOfDay())
                    .le(Order::getCreateTime, date.atTime(LocalTime.MAX))
                    .count();
            AdminDashboardVO.OrderTrend trend = new AdminDashboardVO.OrderTrend();
            trend.setDate(date.format(DATE_FMT));
            trend.setCount((int) count);
            trends.add(trend);
        }
        return trends;
    }

    @Override
    public List<AdminDashboardVO.SalesTrend> getSalesTrend() {
        List<AdminDashboardVO.SalesTrend> trends = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            List<Order> orders = lambdaQuery()
                    .ge(Order::getCreateTime, date.atStartOfDay())
                    .le(Order::getCreateTime, date.atTime(LocalTime.MAX))
                    .ne(Order::getStatus, 0)
                    .list();
            BigDecimal amount = orders.stream()
                    .map(Order::getPayAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            AdminDashboardVO.SalesTrend trend = new AdminDashboardVO.SalesTrend();
            trend.setDate(date.format(DATE_FMT));
            trend.setAmount(amount.setScale(2).toPlainString());
            trends.add(trend);
        }
        return trends;
    }

    @Override
    public List<AdminDashboardVO.RecentOrder> getRecentOrders() {
        List<Order> orders = lambdaQuery()
                .orderByDesc(Order::getCreateTime)
                .last("LIMIT 5")
                .list();
        return orders.stream().map(o -> {
            AdminDashboardVO.RecentOrder ro = new AdminDashboardVO.RecentOrder();
            ro.setOrderNo(o.getOrderNo());
            ro.setContactName(o.getContactName());
            ro.setPayAmount(o.getPayAmount() != null ? o.getPayAmount().setScale(2).toPlainString() : "0.00");
            ro.setStatus(o.getStatus());
            ro.setCreateTime(o.getCreateTime() != null ? o.getCreateTime().format(FMT) : null);
            return ro;
        }).toList();
    }

    private AdminOrderVO toVO(Order o) {
        AdminOrderVO vo = new AdminOrderVO();
        copyToVO(o, vo);
        return vo;
    }

    @Override
    public MiniOrderCreateVO createOrder(Long userId, MiniOrderCreateDTO dto) {
        // Validate stock and build order items JSON
        List<Map<String, Object>> orderItemsList = new ArrayList<>();
        for (MiniOrderCreateDTO.Item item : dto.getItems()) {
            Product product = productService.getById(item.getProductId());
            if (product == null || product.getStatus() != 1) {
                throw new BusinessException(400, "商品不存在或已下架");
            }
            if (product.getStock() < item.getQuantity()) {
                throw new BusinessException(400, "商品\"" + product.getName() + "\"库存不足");
            }
            // Deduct stock, increase sales
            product.setStock(product.getStock() - item.getQuantity());
            product.setSales(product.getSales() + item.getQuantity());
            productService.updateById(product);

            Map<String, Object> orderItem = new LinkedHashMap<>();
            orderItem.put("productId", item.getProductId());
            orderItem.put("productName", product.getName());
            orderItem.put("cover", product.getCover());
            orderItem.put("spec", item.getSpec());
            orderItem.put("price", item.getPrice());
            orderItem.put("quantity", item.getQuantity());
            orderItemsList.add(orderItem);
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setOrderNo(generateOrderNo());
        order.setContactName(dto.getContactName());
        order.setContactPhone(dto.getContactPhone());
        order.setAddress(dto.getAddress());
        order.setRemark(dto.getRemark());
        order.setTotalAmount(dto.getTotalAmount());
        order.setDiscountAmount(dto.getDiscountAmount() != null ? dto.getDiscountAmount() : BigDecimal.ZERO);
        order.setPayAmount(dto.getPayAmount());
        order.setStatus(0);
        try {
            order.setOrderItems(objectMapper.writeValueAsString(orderItemsList));
        } catch (JsonProcessingException e) {
            throw new BusinessException("JSON serialization failed");
        }
        save(order);

        MiniOrderCreateVO vo = new MiniOrderCreateVO();
        vo.setOrderId(order.getId());
        vo.setOrderNo(order.getOrderNo());
        vo.setPayAmount(order.getPayAmount().setScale(2).toPlainString());
        return vo;
    }

    @Override
    public PageResult<MiniOrderVO> listMiniOrders(Long userId, Integer status, Integer page, Integer pageSize) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getUserId, userId);
        if (status != null) {
            wrapper.eq(Order::getStatus, status);
        }
        wrapper.orderByDesc(Order::getCreateTime);
        Page<Order> result = page(new Page<>(page, pageSize), wrapper);
        List<MiniOrderVO> list = result.getRecords().stream().map(this::toMiniOrderVO).toList();
        return PageResult.of(list, result.getTotal(), page, pageSize);
    }

    @Override
    public MiniOrderDetailVO getMiniOrderDetail(Long userId, Long orderId) {
        Order order = getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException(404, "订单不存在");
        }
        MiniOrderDetailVO vo = new MiniOrderDetailVO();
        vo.setId(order.getId());
        vo.setOrderNo(order.getOrderNo());
        vo.setStatus(order.getStatus());
        vo.setPayAmount(order.getPayAmount() != null ? order.getPayAmount().setScale(2).toPlainString() : null);
        vo.setCreateTime(order.getCreateTime() != null ? order.getCreateTime().format(FMT) : null);
        vo.setContactName(order.getContactName());
        vo.setContactPhone(order.getContactPhone());
        vo.setAddress(order.getAddress());
        vo.setTotalAmount(order.getTotalAmount() != null ? order.getTotalAmount().setScale(2).toPlainString() : null);
        vo.setDiscountAmount(order.getDiscountAmount() != null ? order.getDiscountAmount().setScale(2).toPlainString() : null);
        vo.setRemark(order.getRemark());
        vo.setOrderItems(parseOrderItems(order.getOrderItems()));
        return vo;
    }

    @Override
    public void cancelOrder(Long userId, Long orderId) {
        Order order = getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException(404, "订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new BusinessException(400, "仅待支付订单可取消");
        }
        // Restore stock
        List<MiniOrderItemVO> items = parseOrderItems(order.getOrderItems());
        for (MiniOrderItemVO item : items) {
            Product product = productService.getById(item.getProductId());
            if (product != null) {
                product.setStock(product.getStock() + item.getQuantity());
                product.setSales(Math.max(0, product.getSales() - item.getQuantity()));
                productService.updateById(product);
            }
        }
        order.setStatus(5);
        updateById(order);
    }

    @Override
    public void payOrder(Long userId, Long orderId) {
        Order order = getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException(404, "订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new BusinessException(400, "仅待支付订单可支付");
        }
        order.setStatus(1);
        updateById(order);
    }

    @Override
    public void confirmOrder(Long userId, Long orderId) {
        Order order = getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException(404, "订单不存在");
        }
        if (order.getStatus() != 2) {
            throw new BusinessException(400, "仅待收货订单可确认收货");
        }
        order.setStatus(3);
        updateById(order);
    }

    @Override
    public void applyRefund(Long userId, Long orderId) {
        Order order = getById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException(404, "订单不存在");
        }
        if (order.getStatus() != 1 && order.getStatus() != 2) {
            throw new BusinessException(400, "仅待发货或待收货订单可申请退款");
        }
        order.setStatus(4);
        updateById(order);
    }

    private MiniOrderVO toMiniOrderVO(Order order) {
        MiniOrderVO vo = new MiniOrderVO();
        vo.setId(order.getId());
        vo.setOrderNo(order.getOrderNo());
        vo.setStatus(order.getStatus());
        vo.setPayAmount(order.getPayAmount() != null ? order.getPayAmount().setScale(2).toPlainString() : null);
        vo.setCreateTime(order.getCreateTime() != null ? order.getCreateTime().format(FMT) : null);
        vo.setOrderItems(parseOrderItems(order.getOrderItems()));
        return vo;
    }

    private List<MiniOrderItemVO> parseOrderItems(String orderItemsJson) {
        try {
            if (StringUtils.hasText(orderItemsJson)) {
                return objectMapper.readValue(orderItemsJson, new TypeReference<>() {});
            }
        } catch (JsonProcessingException e) {
            // fall through
        }
        return Collections.emptyList();
    }

    private String generateOrderNo() {
        return "ORD" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + String.format("%03d", (int) (Math.random() * 1000));
    }

    private void copyToVO(Order o, AdminOrderVO vo) {
        vo.setId(o.getId());
        vo.setUserId(o.getUserId());
        vo.setOrderNo(o.getOrderNo());
        vo.setContactName(o.getContactName());
        vo.setContactPhone(o.getContactPhone());
        vo.setTotalAmount(o.getTotalAmount() != null ? o.getTotalAmount().setScale(2).toPlainString() : null);
        vo.setDiscountAmount(o.getDiscountAmount() != null ? o.getDiscountAmount().setScale(2).toPlainString() : null);
        vo.setPayAmount(o.getPayAmount() != null ? o.getPayAmount().setScale(2).toPlainString() : null);
        vo.setStatus(o.getStatus());
        vo.setAddress(o.getAddress());
        vo.setRemark(o.getRemark());
        vo.setCreateTime(o.getCreateTime() != null ? o.getCreateTime().format(FMT) : null);
    }
}
