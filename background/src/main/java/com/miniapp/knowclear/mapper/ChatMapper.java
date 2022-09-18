package com.miniapp.knowclear.mapper;

import com.miniapp.knowclear.entity.Chat;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
public interface ChatMapper extends BaseMapper<Chat> {

    List<Chat> selectChatList(String openId, int open_id);
}
