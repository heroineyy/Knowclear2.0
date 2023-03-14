package com.miniapp.knowclear.controller;


import com.miniapp.knowclear.service.CollegeService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
@Api(tags="学校管理")
@RestController
@RequestMapping("/knowclear/college")
public class CollegeController {
    @Autowired
    private CollegeService collegeService;
    //返回所有学校和学校id，以便于前端选择
    @GetMapping("/selectAllCollege")
    public Map<String,Object>selectAllCollege(){
        return collegeService.selectAllCollege();
    }
}

