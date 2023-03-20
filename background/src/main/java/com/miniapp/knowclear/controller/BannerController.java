package com.miniapp.knowclear.controller;


import com.miniapp.knowclear.service.BannerService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
@Api(tags="轮播图管理")
@RestController
@RequestMapping("/knowclear/banner")
public class BannerController {
    @Autowired
    private BannerService bannerService;
    @ApiOperation("返回轮播图")
    @GetMapping("/getBannerImgs/{collegeId}")
    public Map<String,Object> getBannerImgs(@ApiParam(name = "collegeId", value = "学校ID", example = "1") @PathVariable String collegeId){
        return bannerService.getBannerImgs(collegeId);
    }

}
