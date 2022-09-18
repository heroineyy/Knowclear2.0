package com.miniapp.knowclear.service;

import com.miniapp.knowclear.entity.Collection;
import com.baomidou.mybatisplus.extension.service.IService;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
public interface CollectionService extends IService<Collection> {

    Map<String, Object> collectLabel(HttpServletRequest request, int labelId);

    Map<String, Object> cancelCollectLabel(HttpServletRequest request, int labelId);

    Map<String, Object> selectIsCollected(HttpServletRequest request, int labelId);
}
