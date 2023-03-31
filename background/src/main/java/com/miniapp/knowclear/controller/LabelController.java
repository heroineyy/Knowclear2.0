package com.miniapp.knowclear.controller;


import com.miniapp.knowclear.entity.Account;
import com.miniapp.knowclear.entity.Label;
import com.miniapp.knowclear.service.CollectionService;
import com.miniapp.knowclear.service.LabelService;
import com.miniapp.knowclear.utils.JwtUtils;
import io.swagger.annotations.Api;
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
@Api(tags="标签管理")
@RestController
@RequestMapping("/knowclear/label")
public class LabelController {

    @Autowired
    private LabelService labelService;
    //根据学校id和分类查询前四个标签
    @GetMapping("/selectLabelsByCollegeId/{college_id}/{classify}")
    public Map<String,Object> selectChatLabelByCollegeId(@PathVariable int college_id,@PathVariable int classify) {
        Map<String, Object> info = new HashMap<>();
        info.put("labels", labelService.getTopicLabels(college_id, classify));
        return info;
    }
    //根据学校id和分类查询所有标签,点击更多出现的查询结果
    @GetMapping("/selectAllLabelByCollegeId/{college_id}/{classify}/{pageNum}/{pageSize}")
    public Map<String,Object> selectAllLabelByCollegeId(@PathVariable int college_id,@PathVariable int classify,@PathVariable int pageNum,@PathVariable int pageSize) {
        Map<String, Object> info = new HashMap<>();
        info.put("labels", labelService.getAllTopicLabels(college_id, classify,pageNum,pageSize));
        return info;
    }
    //根据学校id返回所有标签
    @PostMapping("/selectAllLabelByCollegeId/{college_id}")
    public Map<String,Object> selectAllLabelByCollegeId(@PathVariable int college_id){
        Map<String,Object> map = new HashMap<>();
        map.put("labels",labelService.getAllLables(college_id));
        return map;
    }
    //根据用户id查询用户收藏的标签
    @GetMapping("/selectLabelByOpenId")
    public Map<String,Object> selectLabelByOpenId(HttpServletRequest request){
        return labelService.selectLabelByOpenId(request);
    }
    //根据标签id查询标签内容以及对应话题
    @PostMapping ("/selectLabelTopicById/{label_id}")
    public Map<String,Object> selectLabelTopicById(HttpServletRequest request,@PathVariable int label_id){
        return labelService.selectLabelTopicById(request,label_id);
    }
    //发布标签的方法
    @PostMapping ("/publishChatLabel/{classify}/{college_id}")
    public Map<String,Object> publishChatLabel(HttpServletRequest request,@RequestBody Label label,@PathVariable int classify,@PathVariable int college_id){
        return labelService.publishChatLabel(request,label,classify,college_id);
    }
}

