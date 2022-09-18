package com.miniapp.knowclear.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.miniapp.knowclear.entity.Consult;
import com.miniapp.knowclear.entity.ConsultUpvote;
import com.miniapp.knowclear.entity.Topic;
import com.miniapp.knowclear.entity.Upvote;
import com.miniapp.knowclear.mapper.ConsultMapper;
import com.miniapp.knowclear.mapper.ConsultUpvoteMapper;
import com.miniapp.knowclear.service.ConsultUpvoteService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.miniapp.knowclear.utils.JwtUtils;
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
public class ConsultUpvoteServiceImpl extends ServiceImpl<ConsultUpvoteMapper, ConsultUpvote> implements ConsultUpvoteService {

    @Resource
    private ConsultUpvoteMapper consultUpvoteMapper;

    @Resource
    private ConsultMapper consultMapper;

    @Override
    public Map<String, Object> upvoteConsult(HttpServletRequest httpServletRequest, int consult_id) {
        Map<String,Object> info=new HashMap<>();
        if(JwtUtils.checkToken(httpServletRequest)){
            //获取openid
            String openId = JwtUtils.getOpenIdByJwtToken(httpServletRequest);
            //向点赞记录表中插入数据
            ConsultUpvote up=new ConsultUpvote();
            up.setConsultId(consult_id);
            up.setOpenid(openId);

            //更新话题表
            Consult consult = consultMapper.selectById(consult_id);
            consult.setUpvoteNum(consult.getUpvoteNum()+1);

            //判断是否执行成功
            if(consultUpvoteMapper.insert(up)!=1||consultMapper.updateById(consult)!=1){
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
    public Map<String, Object> cancelUpvoteConsult(HttpServletRequest httpServletRequest, int consult_id) {
        Map<String,Object> info=new HashMap<>();
        if(JwtUtils.checkToken(httpServletRequest)){
            //获取openid
            String openId = JwtUtils.getOpenIdByJwtToken(httpServletRequest);
            //更新资讯表点赞数-1
            Consult consult = consultMapper.selectById(consult_id);
            consult.setUpvoteNum(consult.getUpvoteNum()-1);
            //判断是否执行成功
            QueryWrapper<ConsultUpvote> upvoteQueryWrapper=new QueryWrapper<>();
            upvoteQueryWrapper.eq("openid",openId).eq("consult_id",consult_id);

            //判断是否执行成功
            if(consultUpvoteMapper.delete(upvoteQueryWrapper)!=1||consultMapper.updateById(consult)!=1){
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
