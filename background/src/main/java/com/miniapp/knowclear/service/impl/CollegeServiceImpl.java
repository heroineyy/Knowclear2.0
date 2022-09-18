package com.miniapp.knowclear.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.miniapp.knowclear.entity.College;
import com.miniapp.knowclear.mapper.CollegeMapper;
import com.miniapp.knowclear.service.CollegeService;
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
public class CollegeServiceImpl extends ServiceImpl<CollegeMapper, College> implements CollegeService {
    @Resource
    private CollegeMapper collegeMapper;
    @Override
    public Map<String, Object> selectAllCollege() {
        Map<String,Object> map = new HashMap<>();
        QueryWrapper<College> wrapper = new QueryWrapper<>();
        wrapper.select("college_id","name");
        List<College> colleges = collegeMapper.selectList(wrapper);
        map.put("colleges",colleges);
        return map;
    }
}
