package com.miniapp.knowclear.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.miniapp.knowclear.entity.Banner;
import com.miniapp.knowclear.mapper.BannerMapper;
import com.miniapp.knowclear.service.BannerService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
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
        QueryWrapper<Banner> bannerQueryWrapper=new QueryWrapper<>();
        int i = Integer.parseInt(collegeId);
        bannerQueryWrapper.eq("college_id",i);
        List<Banner> banners = bannerMapper.selectList(bannerQueryWrapper);
        res.put("banner",banners);
        return res;
    }

}
