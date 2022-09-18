package com.miniapp.knowclear.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.google.gson.Gson;
import com.miniapp.knowclear.entity.Account;
import com.miniapp.knowclear.mapper.AccountMapper;
import com.miniapp.knowclear.service.AccountService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.miniapp.knowclear.utils.HttpClientUtils;
import com.miniapp.knowclear.utils.JwtUtils;
import com.miniapp.knowclear.utils.WxUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
@Service
public class AccountServiceImpl extends ServiceImpl<AccountMapper, Account> implements AccountService {

    @Resource
    private AccountMapper accountMapper;

    @Override
    public Map<String, Object> login(String code) {
        try {
            //1.拿着code请求微信固定地址
            //向认证服务器发送请求换取access_token
            String baseAccessTokenUrl = "https://api.weixin.qq.com/sns/jscode2session" +
                    "?appid=%s" +
                    "&secret=%s" +
                    "&js_code=%s" +
                    "&grant_type=authorization_code";
            //2.拼接三个参数,得到地址
            String accessTokenUrl = String.format(
                    baseAccessTokenUrl,
                    WxUtils.APPID,
                    WxUtils.KEY,
                    code);
            //3.请求这个拼接好的地址，得到session_key和openid
            //使用httpclient发送请求得到结果
            String accessTokenInfo = HttpClientUtils.get(accessTokenUrl);
            System.out.println("accessTokenInfo" + accessTokenInfo);
            //4.从返回值中拿出session_key和openid
            //都是key-value这个形式的字符串，将它转换为Map对象好取值，这里用gson把前面传回来的json字符串换成Map对象
            Gson gson = new Gson();
            HashMap mapAccessToken = gson.fromJson(accessTokenInfo, HashMap.class);
            String session_key = (String) mapAccessToken.get("session_key");
            String openid = (String) mapAccessToken.get("openid");
            System.out.println(openid);
            //把扫描人信息添加数据库里面
            //判断数据表里面是否存在相同微信信息，根据openid判断
            QueryWrapper<Account> userWrapper = new QueryWrapper<>();
            userWrapper.eq("openid", openid);
            System.out.println(openid);
            String token = JwtUtils.getJwtToken(openid, session_key);
            Account account = accountMapper.selectById(openid);
            Map<String,Object> info=new HashMap<>();
            if (account==null) {//表没有相同微信数据，进行添加
                Account a=new Account();
                a.setOpenid(openid);
                accountMapper.insert(a);
                info.put("token",token);
                return info;
            }else {
                info.put("token",token);
                info.put("college_id",account.getCollegeId());
                return info;
            }
            //使用jwt生成token字符串
            //通过token传递路径，得到用户信息

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Map<String, Object> queryOnePersonByOpenId(String openId) {
        Map<String,Object> res=new HashMap<>();
        Account account = accountMapper.selectById(openId);
        res.put("account",account);
        return res;
    }

    @Override
    public Map<String, Object> getSimpleAccount(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            Account account = accountMapper.selectById(openId);
            result.put("account",account);
            return result;
        } else {
            result.put("msg","token无效！");
            return result;
        }
    }

    @Override
    public Map<String, Object> getAccountByOpenId(String open_id) {
        Map<String, Object> result = new HashMap<>();
        QueryWrapper<Account> wrapper = new QueryWrapper<>();
        wrapper.eq("openid",open_id);
        Account account = accountMapper.selectOne(wrapper);
        result.put("account",account);
        return result;
    }

    @Override
    public Map<String, Object> updateAccount(HttpServletRequest request, Account account,int college_id) {
        Map<String, Object> result = new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            //设置openId
            account.setOpenid(openId);
            account.setCollegeId(college_id);
            int update = accountMapper.updateById(account);
            if(update <= 0){
                result.put("msg","修改失败！");
                return result;
            }
            result.put("status","success");
            return result;
        } else {
            result.put("msg","token无效！");
            return result;
        }
    }
}
