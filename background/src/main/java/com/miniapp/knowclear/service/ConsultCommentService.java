package com.miniapp.knowclear.service;

import com.miniapp.knowclear.entity.Comment;
import com.miniapp.knowclear.entity.ConsultComment;
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
public interface ConsultCommentService extends IService<ConsultComment> {
    //获取评论列表
    Map<String,Object> getConsultComments(int consultId);
    //获取某条评论的子评论
    List<ConsultComment> getCommentChild(List<ConsultComment> commentList, int commentId);
    //添加一条评论
    Map<String,Object> addComment(ConsultComment comment);

}
