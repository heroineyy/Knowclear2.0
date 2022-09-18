package com.miniapp.knowclear.service;

import com.miniapp.knowclear.entity.ConsultUpvote;
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
public interface ConsultUpvoteService extends IService<ConsultUpvote> {
    Map<String,Object> upvoteConsult(HttpServletRequest httpServletRequest, int consult_id);
    Map<String,Object> cancelUpvoteConsult(HttpServletRequest httpServletRequest, int consult_id);
}
