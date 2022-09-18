package com.miniapp.knowclear.mapper;

import com.miniapp.knowclear.entity.Label;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
public interface LabelMapper extends BaseMapper<Label> {
    List<Label> selectLabelsByTopicNum(int college_id, int classify);

    List<Label> selectAllLabels(int college_id, int classify);
}
