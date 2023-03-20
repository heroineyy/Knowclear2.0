package com.miniapp.knowclear.service.impl;

import com.miniapp.knowclear.entity.Banner;
import com.miniapp.knowclear.mapper.BannerMapper;
import com.miniapp.knowclear.service.BannerService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
@Service
public class BannerServiceImpl extends ServiceImpl<BannerMapper, Banner> implements BannerService {
    @Resource
    private BannerMapper bannerMapper;
    @Override
    public Map<String, Object> getBannerImgs(String collegeId){
        Map<String,Object> res=new HashMap<>();
        Banner banner  = bannerMapper.selectById(collegeId);
        res.put("banner",banner);
        return res;
    }

}
