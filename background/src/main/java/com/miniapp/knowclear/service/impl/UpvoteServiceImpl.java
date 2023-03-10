package com.miniapp.knowclear.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.miniapp.knowclear.entity.Topic;
import com.miniapp.knowclear.entity.Upvote;
import com.miniapp.knowclear.mapper.TopicMapper;
import com.miniapp.knowclear.mapper.UpvoteMapper;
import com.miniapp.knowclear.service.UpvoteService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.miniapp.knowclear.utils.JwtUtils;
import com.miniapp.knowclear.utils.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
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
public class UpvoteServiceImpl extends ServiceImpl<UpvoteMapper, Upvote> implements UpvoteService {

    @Resource
    private UpvoteMapper upvoteMapper;

    @Resource
    private TopicMapper topicMapper;

    @Autowired
    private RedisUtil redisUtil;

    @Override
    public Map<String, Object> upvoteTopic(HttpServletRequest request, int topic_id) {
        Map<String,Object> info=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            //获取openid
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            //向点赞记录表中插入数据
            Upvote up=new Upvote();
            up.setTopicId(topic_id);
            up.setOpenId(openId);
            System.out.println(up);

            //更新话题表
            Topic topic = topicMapper.selectById(topic_id);
            topic.setUpvoteNum(topic.getUpvoteNum()+1);

            //判断是否执行成功
            if(upvoteMapper.insert(up)!=1||topicMapper.updateById(topic)!=1){
                info.put("status","failed");
            }else{
                info.put("status","success");
            }
        }else {
            info.put("status","failed");
        }
        return info;
    }

    @Override
    public Map<String, Object> cancelUpvoteTopic(HttpServletRequest request, int topic_id) {
        Map<String,Object> info=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            //获取openid
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            //更新话题表点赞数-1
            Topic topic = topicMapper.selectById(topic_id);
            topic.setUpvoteNum(topic.getUpvoteNum()-1);
            //判断是否执行成功
            QueryWrapper<Upvote> upvoteQueryWrapper=new QueryWrapper<>();
            upvoteQueryWrapper.eq("open_id",openId).eq("topic_id",topic_id);
            if(upvoteMapper.delete(upvoteQueryWrapper)!=1||topicMapper.updateById(topic)!=1){
                info.put("status","failed");
            }else{
                info.put("status","success");
            }
        }else {
            info.put("status","failed");
        }
        return info;
    }

    //redis

    @Override
    public Map<String, Object> upvoteTopicForRedis(HttpServletRequest request, int topic_id) {
        Map<String,Object> info=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            //获取openid
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            //向redis更新点赞记录
            try {
                redisUtil.sAdd("like:" + topic_id, openId);
            }catch (Exception e){
                System.out.println(e.getMessage());
                info.put("status","failed");
                return info;
            }

            //更新话题表
            Topic topic = topicMapper.selectById(topic_id);
            topic.setUpvoteNum(topic.getUpvoteNum()+1);

            //判断是否执行成功
            if(topicMapper.updateById(topic)!=1){
                info.put("status","failed");
            }else{
                info.put("status","success");
            }
        }else {
            info.put("status","failed");
        }
        return info;
    }

    @Override
    public Map<String, Object> cancelUpvoteTopicForRedis(HttpServletRequest request, int topic_id) {
        Map<String,Object> info=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            //获取openid
            String openId = JwtUtils.getOpenIdByJwtToken(request);

            try{
                redisUtil.srem("like:"+topic_id,openId);
            }catch (Exception e){
                System.out.println(e.getMessage());
                info.put("status","failed");
                return info;
            }

            //更新话题表点赞数-1
            Topic topic = topicMapper.selectById(topic_id);
            topic.setUpvoteNum(topic.getUpvoteNum()-1);

            //判断是否执行成功

            if(topicMapper.updateById(topic)!=1){
                info.put("status","failed");
            }else{
                info.put("status","success");
            }
        }else {
            info.put("status","failed");
        }
        return info;
    }


}
