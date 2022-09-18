package com.miniapp.knowclear.controller;


import com.miniapp.knowclear.entity.Comment;
import com.miniapp.knowclear.service.CommentService;
import com.miniapp.knowclear.utils.JwtUtils;
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
@RestController
@RequestMapping("/knowclear/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/getTopicComments/{topic_id}")
    public Map<String,Object> getTopicCommentsByTopicId(@PathVariable int topic_id){
        return commentService.getTopicComments(topic_id);
    }

    @PostMapping("/addTopicComment")
    public Map<String,Object> addTopicComment(HttpServletRequest request, @RequestBody Comment comment){
        Map<String,Object> res=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            comment.setOpenid(openId);
            return commentService.addComment(comment);
        }else{
            res.put("msg","token已过期");
            return res;
        }
    }


}

