package com.miniapp.knowclear.controller;


import com.miniapp.knowclear.entity.Chat;
import com.miniapp.knowclear.service.ChatService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
@Api(tags="留言管理")
@RestController
@RequestMapping("/knowclear/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;
    //查询该用户的留言用户列表,包括向该用户留言的和该用户向其他用户留言的
    @GetMapping("/selectChatAccount")
    public Map<String,Object>selectChatAccount(HttpServletRequest request){
        return chatService.selectChatAccount(request);
    }
    //留言功能
    @PostMapping("/sendChatMessage")
    public Map<String,Object>sendChatMessage(HttpServletRequest request, @RequestBody Chat chat){
        return chatService.sendChatMessage(request,chat);
    }
    //点击某一用户，查看曾经双方互相留过的言
    @GetMapping("/selectChatList/{open_id}")
    public Map<String,Object>selectChatList(HttpServletRequest request, @PathVariable String open_id){
        return chatService.selectChatList(request,open_id);
    }
}

