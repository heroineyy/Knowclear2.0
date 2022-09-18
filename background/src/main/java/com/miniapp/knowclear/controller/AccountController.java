package com.miniapp.knowclear.controller;


import com.miniapp.knowclear.entity.Account;
import com.miniapp.knowclear.service.AccountService;
import com.miniapp.knowclear.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
@RestController
@RequestMapping("/knowclear/account")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @PostMapping("/login/{code}")
    public Map<String,Object> login(@PathVariable String code){
        return accountService.login(code);
    }

    @PostMapping("/mylogin/{open_id}")
    public String myLogin(@PathVariable String open_id){
        String token= JwtUtils.getJwtToken(open_id, "20220128");
        return token;
    }
    //根据token获取当前用户简介
    @GetMapping("/getSimpleAccount")
    public Map<String,Object> getSimpleAccount(HttpServletRequest request){
        return accountService.getSimpleAccount(request);
    }
    //根据openid获取某个用户简介
    @GetMapping("/getAccountByOpenId/{open_id}")
    public Map<String,Object> getAccountByOpenId(@PathVariable String open_id){
        return accountService.getAccountByOpenId(open_id);
    }
    //用户修改简介
    @PostMapping("/updateAccount/{college_id}")
    public Map<String,Object> updateAccount(HttpServletRequest request,@RequestBody Account account,@PathVariable int college_id){
        return accountService.updateAccount(request,account,college_id);
    }
}

