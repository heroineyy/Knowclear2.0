package com.miniapp.knowclear.service;

import com.miniapp.knowclear.entity.Banner;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.Map;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
public interface BannerService extends IService<Banner> {
    Map<String, Object> getBannerImgs(String collegeId);

}
