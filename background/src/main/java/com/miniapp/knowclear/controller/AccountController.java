package com.miniapp.knowclear.controller;


import com.miniapp.knowclear.entity.Account;
import com.miniapp.knowclear.service.AccountService;
import com.miniapp.knowclear.utils.JwtUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
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
@Api(tags="账户管理")
@RestController
@RequestMapping("/knowclear/account")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @ApiOperation("用户登录返回token")
    @PostMapping("/login/{code}")
    public Map<String,Object> login(@ApiParam(name = "code", value = "用户code", example = "1") @PathVariable String code){
        return accountService.login(code);
    }

    @ApiOperation("根据openid获取token")
    @PostMapping("/mylogin/{open_id}")
    public String myLogin(@ApiParam(name = "open_id", value = "用户open_id", example = "1") @PathVariable String open_id){
        String token= JwtUtils.getJwtToken(open_id, "20220128");
        return token;
    }

    @ApiOperation("根据token获取当前用户简介")
    @GetMapping("/getSimpleAccount")
    public Map<String,Object> getSimpleAccount(HttpServletRequest request){
        return accountService.getSimpleAccount(request);
    }

    @ApiOperation("根据openid获取某个用户简介")
    @GetMapping("/getAccountByOpenId/{open_id}")
    public Map<String,Object> getAccountByOpenId(@ApiParam(name="open_id",value="用户open_id")  @PathVariable String open_id){
        return accountService.getAccountByOpenId(open_id);
    }


    @ApiOperation("用户修改简介")
    @PostMapping("/updateAccount/{college_id}")
    public Map<String,Object> updateAccount(HttpServletRequest request,@RequestBody Account account,@ApiParam(name="college_id",value="学校id")  @PathVariable("college_id") int college_id){
        return accountService.updateAccount(request,account,college_id);
    }
}

