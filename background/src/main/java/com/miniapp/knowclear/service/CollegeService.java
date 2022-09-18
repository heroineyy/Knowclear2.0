package com.miniapp.knowclear.service;

import com.miniapp.knowclear.entity.College;
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
public interface CollegeService extends IService<College> {

    Map<String, Object> selectAllCollege();
}
