package com.miniapp.knowclear.controller;


import com.miniapp.knowclear.service.ConsultService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
@Api(tags="咨询服务")
@RestController
@RequestMapping("/knowclear/consult")
public class ConsultController {

    @Autowired
    private ConsultService consultService;

    @GetMapping("/selectSimpleConsult/{college_id}")
    public Map<String,Object> selectSimpleConsult(@PathVariable int college_id){
        return consultService.selectSimpleConsult(college_id);
    }

    @PostMapping("/getConsultList/{college_id}/{classify}")
    public Map<String,Object> getConsultList(HttpServletRequest request,@PathVariable int college_id,@PathVariable int classify){
        return consultService.getConsult(request,college_id,classify);
    }

    @PostMapping("/getOneConsult/{consult_id}")
    public Map<String,Object> getOneConsult(HttpServletRequest request,@PathVariable int consult_id){
        return consultService.getOneConsultByConsultId(request,consult_id);
    }

    @PostMapping("/publishConsult/{college_id}")
    //发布资讯的方法
    public Map<String,Object> publishConsult(@PathVariable int college_id){
        return consultService.publishConsult(college_id);
    }
}

