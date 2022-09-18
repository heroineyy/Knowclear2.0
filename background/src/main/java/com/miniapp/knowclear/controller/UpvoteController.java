package com.miniapp.knowclear.controller;


import com.miniapp.knowclear.service.UpvoteService;
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
@RestController
@RequestMapping("/knowclear/upvote")
public class UpvoteController {

    @Autowired
    private UpvoteService upvoteService;

    @PostMapping("/upvoteTopic/{topic_id}")
    public Map<String,Object> upvoteTopic(HttpServletRequest httpServletRequest,@PathVariable int topic_id ){
        return upvoteService.upvoteTopic(httpServletRequest, topic_id);
    }

    @PostMapping("/cancelUpvote/{topic_id}")
    public Map<String,Object> cancelUpvoteTopic(HttpServletRequest httpServletRequest,@PathVariable int topic_id){
        return upvoteService.cancelUpvoteTopic(httpServletRequest, topic_id);
    }
}

