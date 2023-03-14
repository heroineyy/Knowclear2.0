package com.miniapp.knowclear.controller;


import com.miniapp.knowclear.service.CollectionService;
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
@Api(tags="收藏管理")
@RestController
@RequestMapping("/knowclear/collection")
public class CollectionController {
    @Autowired
    private CollectionService collectionService;
    //查询用户是否收藏过该标签
    @GetMapping("/selectIsCollected/{labelId}")
    public Map<String,Object> selectIsCollected(HttpServletRequest request,@PathVariable int labelId){
        return collectionService.selectIsCollected(request,labelId);
    }
    //用户收藏标签方法
    @GetMapping("/collectLabel/{labelId}")
    public Map<String,Object> collectLabel(HttpServletRequest request,@PathVariable int labelId){
        return collectionService.collectLabel(request,labelId);
    }
    //用户取消收藏标签方法
    @GetMapping("/cancelCollectLabel/{labelId}")
    public Map<String,Object> cancelCollectLabel(HttpServletRequest request,@PathVariable int labelId){
        return collectionService.cancelCollectLabel(request,labelId);
    }
}

