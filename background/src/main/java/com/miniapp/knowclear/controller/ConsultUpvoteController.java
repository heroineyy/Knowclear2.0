package com.miniapp.knowclear.controller;


import com.miniapp.knowclear.service.ConsultUpvoteService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

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
@Api(tags="事务点赞")
@RestController
@RequestMapping("/knowclear/consult-upvote")
public class ConsultUpvoteController {

    @Autowired
    private ConsultUpvoteService consultUpvoteService;

    @PostMapping("/upvoteConsult/{consult_id}")
    public Map<String,Object> upvoteConsult(HttpServletRequest httpServletRequest, @PathVariable int consult_id ){
        return consultUpvoteService.upvoteConsult(httpServletRequest, consult_id);
    }

    @PostMapping("/cancelUpvote/{consult_id}")
    public Map<String,Object> cancelUpvoteTopic(HttpServletRequest httpServletRequest,@PathVariable int consult_id){
        return consultUpvoteService.cancelUpvoteConsult(httpServletRequest, consult_id);
    }

}

