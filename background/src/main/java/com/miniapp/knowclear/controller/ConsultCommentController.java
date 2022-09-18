package com.miniapp.knowclear.controller;

import com.miniapp.knowclear.entity.ConsultComment;
import com.miniapp.knowclear.service.ConsultCommentService;
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
@RequestMapping("/knowclear/consult-comment")
public class ConsultCommentController {
    @Autowired
    private ConsultCommentService consultCommentService;

    @PostMapping("/getConsultComments/{consult_id}")
    public Map<String,Object> getTopicCommentsByTopicId(@PathVariable int consult_id){
        return consultCommentService.getConsultComments(consult_id);
    }

    @PostMapping("/addConsultComment")
    public Map<String,Object> addConsultComment(HttpServletRequest request, @RequestBody ConsultComment comment) {
        Map<String, Object> res = new HashMap<>();
        if (JwtUtils.checkToken(request)) {
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            comment.setOpenid(openId);
            return consultCommentService.addComment(comment);
        } else {
            res.put("msg", "token已过期");
            return res;
        }
    }
}

