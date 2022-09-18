package com.miniapp.knowclear.service;

import com.miniapp.knowclear.entity.Account;
import com.baomidou.mybatisplus.extension.service.IService;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
public interface AccountService extends IService<Account> {
    //小程序打开第一个界面调用
    Map<String,Object> login(String code);

    //点击头像获取个人信息
    Map<String,Object> queryOnePersonByOpenId(String openId);

    Map<String, Object> getSimpleAccount(HttpServletRequest request);

    Map<String, Object> getAccountByOpenId(String open_id);

    Map<String, Object> updateAccount(HttpServletRequest request, Account account,int college_id);
}
