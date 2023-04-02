package com.miniapp.knowclear.service;

import com.miniapp.knowclear.entity.Chat;
import com.baomidou.mybatisplus.extension.service.IService;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
public interface ChatService extends IService<Chat> {

    Map<String, Object> selectChatAccount(HttpServletRequest request);

    Map<String, Object> sendChatMessage(HttpServletRequest request, Chat chat);

    Map<String, Object> selectChatList(HttpServletRequest request, String open_id);
}
