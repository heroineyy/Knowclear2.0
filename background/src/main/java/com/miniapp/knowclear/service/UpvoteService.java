package com.miniapp.knowclear.service;

import com.miniapp.knowclear.entity.Upvote;
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
public interface UpvoteService extends IService<Upvote> {
    Map<String,Object> upvoteTopic(HttpServletRequest request,int topic_id);
    Map<String,Object> cancelUpvoteTopic(HttpServletRequest request,int topic_id);
}
