package com.miniapp.knowclear.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.miniapp.knowclear.entity.Account;
import com.miniapp.knowclear.entity.Chat;
import com.miniapp.knowclear.entity.Collection;
import com.miniapp.knowclear.mapper.AccountMapper;
import com.miniapp.knowclear.mapper.ChatMapper;
import com.miniapp.knowclear.service.ChatService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.miniapp.knowclear.utils.DateUtil;
import com.miniapp.knowclear.utils.JwtUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.*;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
@Service
public class ChatServiceImpl extends ServiceImpl<ChatMapper, Chat> implements ChatService {
    @Resource
    private AccountMapper accountMapper;
    @Override
    public Map<String, Object> selectChatAccount(HttpServletRequest request) {
        Map<String,Object> result = new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            //查询向该用户留言的用户
            QueryWrapper<Chat> wrapperOne = new QueryWrapper<>();
            wrapperOne.eq("rid",openId);
            List<Chat> chats = baseMapper.selectList(wrapperOne);
            System.out.println(chats);
            List<Account> accounts = new ArrayList<>();
            //新建哈希表，防止重复查询多个用户信息
            HashSet<String> set = new HashSet<>();
            for(Chat chat : chats){
                String id = chat.getSid();
                if(!set.contains(id)){
                    set.add(id);
                    accounts.add(accountMapper.selectById(id));
                }
            }
            //查询该用户留言过的用户
            QueryWrapper<Chat> wrapperTwo = new QueryWrapper<>();
            wrapperTwo.eq("sid",openId);
            List<Chat> c = baseMapper.selectList(wrapperTwo);
            for(Chat chat : c){
                String id = chat.getRid();
                if(!set.contains(id)){
                    set.add(id);
                    accounts.add(accountMapper.selectById(id));
                }
            }
            result.put("accounts",accounts);
        }else{
            result.put("msg","token无效!");
        }
        return result;
    }

    @Override
    public Map<String, Object> sendChatMessage(HttpServletRequest request, Chat chat) {
        Map<String,Object> result = new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            chat.setSid(openId);
            int insert = baseMapper.insert(chat);
            if(insert <= 0) {
                result.put("status", "failed");
                return result;
            }
            result.put("status","success");
        }else{
            result.put("msg","token无效!");
        }
        return result;
    }

    @Override
    public Map<String, Object> selectChatList(HttpServletRequest request, int open_id) {
        Map<String,Object> result = new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            //自定义SQL语句日期格式转换会出错，不建议使用
 //           List<Chat> chats = baseMapper.selectChatList(openId,open_id);
            QueryWrapper<Chat> wrapper = new QueryWrapper<>();
            wrapper.and(i -> i.eq("sid", openId).eq("rid",open_id)).or(i -> i.eq("rid", openId).eq("sid",open_id));
            wrapper.orderByAsc("gmt_created");
            List<Chat> chats = baseMapper.selectList(wrapper);
//            List<Chat> chatss = new ArrayList<>();
//            for(int i = 0;i < chats.size();i++){
//                Date gmtCreated = chats.get(i).getGmtCreated();
//                Chat chat = new Chat();
//                BeanUtils.copyProperties(chats.get(i),chat);
//                try {
//                    chat.setGmtCreated(DateUtil.strToDate(DateUtil.dateToStr(gmtCreated)));
//                } catch (ParseException e) {
//                    e.printStackTrace();
//                }
//                chatss.add(chat);
//            }
            result.put("chats",chats);
        }else{
            result.put("msg","token无效!");
        }
        return result;
    }

}
