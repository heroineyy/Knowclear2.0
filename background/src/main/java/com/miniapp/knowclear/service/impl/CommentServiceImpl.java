package com.miniapp.knowclear.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.miniapp.knowclear.entity.Comment;
import com.miniapp.knowclear.mapper.AccountMapper;
import com.miniapp.knowclear.mapper.CommentMapper;
import com.miniapp.knowclear.service.CommentService;
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
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements CommentService {

   @Resource
   private CommentMapper commentMapper;

   @Resource
   private AccountMapper accountMapper;

    @Override
    public Map<String, Object> getTopicComments(int topicId) {
        Map<String,Object> result=new HashMap<>();
        QueryWrapper<Comment> commentQueryWrapper=new QueryWrapper<>();
        //获取该话题下所有评论
        commentQueryWrapper.eq("topic_id",topicId).orderByAsc("gmt_created");
        List<Comment> temp = commentMapper.selectList(commentQueryWrapper);
        //加入用户信息
        for(int i=0;i<temp.size();i++){
            Comment comment = temp.get(i);
            temp.get(i).setAccount(accountMapper.selectById(comment.getOpenid()));
        }
        List<Comment> comments=new ArrayList<>();
        for(Comment comment:temp){
            Comment c=new Comment();
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
    public List<Comment> getCommentChild(List<Comment> commentList, int commentId) {
        List<Comment> children=new ArrayList<>();
        for(Comment comment:commentList){
            Comment c=new Comment();
            if(comment.getParentId()!=null&&comment.getParentId()==commentId){
                BeanUtils.copyProperties(comment,c);
                c.setChildren(getCommentChild(commentList,c.getCommentId()));
                children.add(c);
            }
        }
        return children;
    }

    @Override
    public Map<String, Object> addComment(Comment comment) {
        Map<String,Object> result=new HashMap<>();
        if(commentMapper.insert(comment)!=1){
            result.put("status","failed");
        }else{
            result.put("status","success");
        }
        return result;
    }
}
