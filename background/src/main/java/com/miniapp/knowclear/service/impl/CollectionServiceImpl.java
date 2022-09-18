package com.miniapp.knowclear.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.miniapp.knowclear.entity.Collection;
import com.miniapp.knowclear.entity.Topic;
import com.miniapp.knowclear.entity.Upvote;
import com.miniapp.knowclear.mapper.CollectionMapper;
import com.miniapp.knowclear.service.CollectionService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.miniapp.knowclear.utils.JwtUtils;
import com.miniapp.knowclear.vo.TopicVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
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
public class CollectionServiceImpl extends ServiceImpl<CollectionMapper, Collection> implements CollectionService {
    @Resource
    private CollectionMapper collectionMapper;
    @Override
    public Map<String, Object> collectLabel(HttpServletRequest request, int labelId) {
        Map<String,Object> result=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            Collection collection = new Collection();
            collection.setLabelId(labelId);
            collection.setOpenid(openId);
            int insert = collectionMapper.insert(collection);
            if(insert <= 0){
                result.put("status","failed");
            }
            else {
                result.put("status","success");
            }
            return result;

        }else{
            result.put("msg","token无效!");
        }
        return result;
    }

    @Override
    public Map<String, Object> cancelCollectLabel(HttpServletRequest request, int labelId) {
        Map<String,Object> result=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            QueryWrapper<Collection> wrapper = new QueryWrapper<>();
            wrapper.eq("openid",openId).eq("label_id",labelId);
            int insert = collectionMapper.delete(wrapper);
            if(insert <= 0){
                result.put("status","failed");
            }
            else {
                result.put("status","success");
            }
        }else{
            result.put("msg","token无效!");
        }
        return result;
    }

    @Override
    public Map<String, Object> selectIsCollected(HttpServletRequest request, int labelId) {
        Map<String,Object> result=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            QueryWrapper<Collection> wrapper = new QueryWrapper<>();
            wrapper.eq("openid",openId).eq("label_id",labelId);
            Collection collection = collectionMapper.selectOne(wrapper);
            if(collection == null){
                result.put("status","no");
            }
            else {
                result.put("status","yes");
            }
        }else{
            result.put("msg","token无效!");
        }
        return result;
    }

}
