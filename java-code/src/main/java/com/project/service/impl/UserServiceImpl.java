package com.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.project.common.exception.BusinessException;
import com.project.common.result.PageResult;
import com.project.common.util.JwtUtil;
import com.project.dto.mini.MiniLoginDTO;
import com.project.dto.mini.MiniRegisterDTO;
import com.project.dto.mini.MiniUserUpdateDTO;
import com.project.entity.Order;
import com.project.entity.User;
import com.project.mapper.UserMapper;
import com.project.service.IOrderService;
import com.project.service.IUserService;
import com.project.vo.admin.AdminUserVO;
import com.project.vo.mini.MiniLoginVO;
import com.project.vo.mini.MiniOrderStatsVO;
import com.project.vo.mini.MiniUserInfoVO;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.format.DateTimeFormatter;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    @Lazy
    private final IOrderService orderService;

    @Override
    public PageResult<AdminUserVO> listUsers(String keyword, Integer page, Integer pageSize) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(User::getAccount, keyword).or().like(User::getNickname, keyword));
        }
        wrapper.orderByDesc(User::getCreateTime);
        Page<User> result = page(new Page<>(page, pageSize), wrapper);
        List<AdminUserVO> list = result.getRecords().stream().map(this::toVO).toList();
        return PageResult.of(list, result.getTotal(), page, pageSize);
    }

    @Override
    public MiniLoginVO miniLogin(MiniLoginDTO dto) {
        User user = lambdaQuery().eq(User::getAccount, dto.getAccount()).one();
        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BusinessException(400, "账号或密码错误");
        }
        String token = jwtUtil.generateUserToken(user.getId(), user.getAccount());
        MiniLoginVO vo = new MiniLoginVO();
        vo.setToken(token);
        vo.setUserInfo(toMiniUserInfoVO(user));
        return vo;
    }

    @Override
    public MiniLoginVO miniRegister(MiniRegisterDTO dto) {
        long count = lambdaQuery().eq(User::getAccount, dto.getAccount()).count();
        if (count > 0) {
            throw new BusinessException(400, "账号已存在");
        }
        User user = new User();
        user.setAccount(dto.getAccount());
        user.setNickname(dto.getNickname());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        save(user);
        String token = jwtUtil.generateUserToken(user.getId(), user.getAccount());
        MiniLoginVO vo = new MiniLoginVO();
        vo.setToken(token);
        vo.setUserInfo(toMiniUserInfoVO(user));
        return vo;
    }

    @Override
    public MiniUserInfoVO getMiniUserInfo(Long userId) {
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }
        return toMiniUserInfoVO(user);
    }

    @Override
    public void updateMiniUserInfo(Long userId, MiniUserUpdateDTO dto) {
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }
        if (dto.getNickname() != null) {
            user.setNickname(dto.getNickname());
        }
        if (dto.getAvatar() != null) {
            user.setAvatar(dto.getAvatar());
        }
        updateById(user);
    }

    @Override
    public MiniOrderStatsVO getOrderStats(Long userId) {
        MiniOrderStatsVO vo = new MiniOrderStatsVO();
        vo.setPendingPayment(orderService.lambdaQuery().eq(Order::getUserId, userId).eq(Order::getStatus, 0).count().intValue());
        vo.setPendingDelivery(orderService.lambdaQuery().eq(Order::getUserId, userId).eq(Order::getStatus, 1).count().intValue());
        vo.setPendingReceive(orderService.lambdaQuery().eq(Order::getUserId, userId).eq(Order::getStatus, 2).count().intValue());
        vo.setCompleted(orderService.lambdaQuery().eq(Order::getUserId, userId).eq(Order::getStatus, 3).count().intValue());
        vo.setRefunding(orderService.lambdaQuery().eq(Order::getUserId, userId).eq(Order::getStatus, 4).count().intValue());
        return vo;
    }

    private AdminUserVO toVO(User user) {
        AdminUserVO vo = new AdminUserVO();
        vo.setId(user.getId());
        vo.setAvatar(user.getAvatar());
        vo.setNickname(user.getNickname());
        vo.setAccount(user.getAccount());
        vo.setOpenid(user.getOpenid());
        vo.setCreateTime(user.getCreateTime() != null ? user.getCreateTime().format(FMT) : null);
        return vo;
    }

    private MiniUserInfoVO toMiniUserInfoVO(User user) {
        MiniUserInfoVO vo = new MiniUserInfoVO();
        vo.setId(user.getId());
        vo.setAccount(user.getAccount());
        vo.setNickname(user.getNickname());
        vo.setAvatar(user.getAvatar());
        vo.setCreateTime(user.getCreateTime() != null ? user.getCreateTime().format(FMT) : null);
        // Compute member level based on total completed order amount
        BigDecimal totalAmount = orderService.lambdaQuery()
                .eq(Order::getUserId, user.getId())
                .eq(Order::getStatus, 3)
                .list().stream()
                .map(Order::getPayAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (totalAmount.compareTo(new BigDecimal("20000")) >= 0) {
            vo.setMemberLevel("钻石会员");
        } else if (totalAmount.compareTo(new BigDecimal("5000")) >= 0) {
            vo.setMemberLevel("金卡会员");
        } else if (totalAmount.compareTo(new BigDecimal("1000")) >= 0) {
            vo.setMemberLevel("银卡会员");
        } else {
            vo.setMemberLevel("普通会员");
        }
        return vo;
    }
}
