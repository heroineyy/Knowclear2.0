package com.miniapp.knowclear.service;

import com.miniapp.knowclear.entity.Topic;
import com.baomidou.mybatisplus.extension.service.IService;
import com.miniapp.knowclear.entity.Upvote;
import com.miniapp.knowclear.vo.TopicPublishVO;
import com.miniapp.knowclear.vo.TopicVO;

import javax.servlet.http.HttpServletRequest;
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
public interface TopicService extends IService<Topic> {
    //根据分类和学校id搜索话题
    Map<String,Object> getTopics(HttpServletRequest httpServletRequest, int college_id, int classify);
    //根据关键字模糊搜索话题
    Map<String,Object> getTopicsBySerach(HttpServletRequest httpServletRequest, int college_id, String info);
    //获取热门话题
    Map<String,Object> getHotTopics(int college_id);
    //根据label_id获取话题列表
    Map<String,Object> getTopicsByLabelId(HttpServletRequest request,int label_id);
    //根据openid获取自己发布的话题列表
    Map<String,Object> getUserTopics(HttpServletRequest request);

    //提取重复代码
    List<TopicVO> finishTopicVO(List<Upvote> upvotes, List<Topic> topics, String openId);

    //根据openid查询该用户点赞过哪些文章
    List<Upvote> getUpvoteList(String openId);

    //获取一条话题
    Map<String,Object> getOneTopicByTopicId(HttpServletRequest request,int topic_id);

    //发布话题
    Map<String, Object> publishTopic(HttpServletRequest request, TopicPublishVO topicPublishVO, int college_id);
}
