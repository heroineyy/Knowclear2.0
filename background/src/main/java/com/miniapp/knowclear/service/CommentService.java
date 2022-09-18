package com.miniapp.knowclear.service;

import com.miniapp.knowclear.entity.Comment;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
public interface CommentService extends IService<Comment> {
    //获取评论列表
    Map<String,Object> getTopicComments(int topicId);
    //获取某条评论的子评论
    List<Comment> getCommentChild(List<Comment> commentList,int commentId);
    //添加一条评论
    Map<String,Object> addComment(Comment comment);
}
