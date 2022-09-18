package com.miniapp.knowclear.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.miniapp.knowclear.entity.Account;
import com.miniapp.knowclear.entity.Comment;
import com.miniapp.knowclear.entity.ConsultComment;
import com.miniapp.knowclear.mapper.AccountMapper;
import com.miniapp.knowclear.mapper.ConsultCommentMapper;
import com.miniapp.knowclear.service.ConsultCommentService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.miniapp.knowclear.utils.DateUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.ParseException;
import java.util.ArrayList;
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
public class ConsultCommentServiceImpl extends ServiceImpl<ConsultCommentMapper, ConsultComment> implements ConsultCommentService {

    @Resource
    private ConsultCommentMapper consultCommentMapper;

    @Resource
    private AccountMapper accountMapper;

    @Override
    public Map<String, Object> getConsultComments(int consultId) {
        Map<String,Object> result=new HashMap<>();
        //找出consult_id为consultId的所有评论
        QueryWrapper<ConsultComment> commentQueryWrapper=new QueryWrapper<>();
        commentQueryWrapper.eq("consult_id",consultId).orderByAsc("gmt_created");
        List<ConsultComment> temp = consultCommentMapper.selectList(commentQueryWrapper);

        //加入用户信息
        for(int i=0;i<temp.size();i++){
            temp.get(i).setAccount(accountMapper.selectById(temp.get(i).getOpenid()));
        }

        //最终返回的list
        List<ConsultComment> comments=new ArrayList<>();
        for(ConsultComment comment:temp){
            ConsultComment c=new ConsultComment();
            if(comment.getParentId()==null){
                BeanUtils.copyProperties(comment,c);
                c.setChildren(getCommentChild(temp,c.getCommentId()));
                comments.add(c);
            }
        }
        result.put("comments",comments);
        return result;
    }

    @Override
    public List<ConsultComment> getCommentChild(List<ConsultComment> commentList, int commentId) {
        List<ConsultComment> children=new ArrayList<>();
        for(ConsultComment comment:commentList){
            ConsultComment c=new ConsultComment();
            if(comment.getParentId()!=null&&comment.getParentId()==commentId){
                BeanUtils.copyProperties(comment,c);
                c.setChildren(getCommentChild(commentList,c.getCommentId()));
                children.add(c);
            }
        }
        return children;
    }

    @Override
    public Map<String, Object> addComment(ConsultComment comment) {
        Map<String,Object> result=new HashMap<>();
        if(consultCommentMapper.insert(comment)!=1){
            result.put("status","failed");
        }else{
            result.put("status","success");
        }
        return result;
    }
}
