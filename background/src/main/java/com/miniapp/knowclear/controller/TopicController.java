package com.miniapp.knowclear.controller;



import com.miniapp.knowclear.service.TopicService;
import com.miniapp.knowclear.vo.TopicPublishVO;
import com.miniapp.knowclear.vo.TopicVO;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
@Api(tags="话题管理")
@RestController
@RequestMapping("/knowclear/topic")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @GetMapping("/selectTopicByCollegeId/{college_id}/{classify}")
    public Map<String,Object> selectTopic(HttpServletRequest httpServletRequest,@PathVariable int college_id,@PathVariable int classify){
        return topicService.getTopics(httpServletRequest, college_id, classify);
    }

    @GetMapping("/searchTopic/{college_id}/{info}")
    public Map<String,Object> searchTopic(HttpServletRequest httpServletRequest,@PathVariable int college_id,@PathVariable String info){
        return topicService.getTopicsBySerach(httpServletRequest,college_id,info);
    }

    @GetMapping("/hotTopics/{college_id}")
    public Map<String,Object> getHotTopics(@PathVariable int college_id){
        return topicService.getHotTopics(college_id);
    }

    @PostMapping("/getOneTopic/{topic_id}")
    public Map<String,Object> getOneTopic(HttpServletRequest request,@PathVariable int topic_id){
        return topicService.getOneTopicByTopicId(request, topic_id);
    }

    @GetMapping("/getTopicsByLabelId/{label_id}")
    public Map<String,Object> getTopicsByLabelId(HttpServletRequest request,@PathVariable int label_id){
        return topicService.getTopicsByLabelId(request,label_id);
    }

    @PostMapping("/getUserTopics")
    public Map<String,Object> getUserTopics(HttpServletRequest request){
        return topicService.getUserTopics(request);
    }
    //用户发布话题调用的方法
    @PostMapping("/publishTopic/{college_id}")
    public Map<String,Object> publishTopic(HttpServletRequest request, @RequestBody TopicPublishVO topicPublishVO, @PathVariable int college_id){
        return topicService.publishTopic(request,topicPublishVO,college_id);
    }
}

