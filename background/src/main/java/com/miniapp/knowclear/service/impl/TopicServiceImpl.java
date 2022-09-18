package com.miniapp.knowclear.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.miniapp.knowclear.entity.*;
import com.miniapp.knowclear.mapper.*;
import com.miniapp.knowclear.service.TopicService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.miniapp.knowclear.utils.JwtUtils;
import com.miniapp.knowclear.vo.TopicPublishVO;
import com.miniapp.knowclear.vo.TopicVO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Collection;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
@Service
public class TopicServiceImpl extends ServiceImpl<TopicMapper, Topic> implements TopicService {

    @Resource
    private UpvoteMapper upvoteMapper;

    @Resource
    private TopicMapper topicMapper;

    @Resource
    private TopicImgMapper topicImgMapper;

    @Resource
    private AccountMapper accountMapper;

    @Resource
    private LabelMapper labelMapper;

    @Override
    public Map<String, Object> getTopics(HttpServletRequest httpServletRequest, int college_id, int classify) {
        Map<String,Object> info=new HashMap<>();
        if(JwtUtils.checkToken(httpServletRequest)){
            String openId = JwtUtils.getOpenIdByJwtToken(httpServletRequest);

            //根据openid查询该用户点赞过哪些文章
            List<Upvote> upvotes = getUpvoteList(openId);

            //根据college_id和classify查询
            QueryWrapper<Topic> topicQueryWrapper=new QueryWrapper<>();
            topicQueryWrapper.eq("college_id",college_id).eq("classify",classify).orderByDesc("gmt_modified");
            List<Topic> topics=topicMapper.selectList(topicQueryWrapper);

            //创建topicVO返回列表
            List<TopicVO> topicList=finishTopicVO(upvotes,topics,openId);
            info.put("topics",topicList);
        }else{
            info.put("msg","token无效!");
        }
        return info;
    }

    @Override
    public Map<String, Object> getTopicsBySerach(HttpServletRequest httpServletRequest, int college_id, String info) {
        Map<String,Object> result=new HashMap<>();
        if(JwtUtils.checkToken(httpServletRequest)){
            String openId = JwtUtils.getOpenIdByJwtToken(httpServletRequest);

            //根据openid查询该用户点赞过哪些文章
            List<Upvote> upvotes = getUpvoteList(openId);

            //根据info模糊查询
            QueryWrapper<Topic> topicQueryWrapper=new QueryWrapper<>();
            QueryWrapper<Label> labelQueryWrapper=new QueryWrapper<>();
            labelQueryWrapper.select("label_id").eq("college_id",college_id).and(i->i.like("name",info).or().like("content",info));
            List<Label> list =labelMapper.selectList(labelQueryWrapper);
            List<Integer> labelIds=new ArrayList<>();
            for(Label l:list){
                labelIds.add(l.getLabelId());
            }
            System.out.println(labelIds);
            //.or().in("label_id",labelIds)
            topicQueryWrapper.eq("college_id",college_id).and(i->i.like("content",info).or(j->j.in("label_id",labelIds)));
            List<Topic> topics = topicMapper.selectList(topicQueryWrapper);

            //创建topicVO返回列表
            List<TopicVO> topicList=finishTopicVO(upvotes,topics,openId);
            result.put("topics",topicList);
        }else{
            result.put("msg","token无效!");
        }
        return result;
    }

    @Override
    public Map<String, Object> getHotTopics(int college_id) {
        Map<String,Object> result=new HashMap<>();
        QueryWrapper<Topic> topicQueryWrapper=new QueryWrapper<>();
        topicQueryWrapper.select("topic_id","content").eq("college_id",college_id).orderByDesc("upvote_num");
        List<Topic> topics = topicMapper.selectList(topicQueryWrapper);
        if(topics.size()>8){
            result.put("hotTopics",topics.subList(0,8));
        }else{
            result.put("hotTopics",topics);
        }
        return result;
    }

    @Override
    public Map<String, Object> getTopicsByLabelId(HttpServletRequest request, int label_id) {
        Map<String,Object> result=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);

            //根据openid查询该用户点赞过哪些文章
            List<Upvote> upvotes = getUpvoteList(openId);

            //根据label_id查询话题
            QueryWrapper<Topic> topicQueryWrapper=new QueryWrapper<>();
            topicQueryWrapper.eq("label_id",label_id);
            List<Topic> topics = topicMapper.selectList(topicQueryWrapper);

            //创建topicVO返回列表
            List<TopicVO> topicList=finishTopicVO(upvotes,topics,openId);
            result.put("topics",topicList);
        }else{
            result.put("msg","token无效!");
        }
        return result;
    }

    @Override
    public Map<String, Object> getUserTopics(HttpServletRequest request) {
        Map<String,Object> result=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);

            //根据openid查询该用户点赞过哪些文章
            List<Upvote> upvotes = getUpvoteList(openId);

            //根据openId查询话题列表
            QueryWrapper<Topic> topicQueryWrapper=new QueryWrapper<>();
            topicQueryWrapper.eq("openid",openId);
            List<Topic> topics = topicMapper.selectList(topicQueryWrapper);

            //创建topicVO返回列表
            List<TopicVO> topicList=finishTopicVO(upvotes,topics,openId);
            result.put("topics",topicList);
        }else{
            result.put("msg","token无效!");
        }
        return result;
    }

    @Override
    public Map<String, Object> getOneTopicByTopicId(HttpServletRequest request, int topic_id) {
        Map<String,Object> result=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);

            //根据openid查询该用户点赞过哪些文章
            List<Upvote> upvotes = getUpvoteList(openId);

            //根据openId查询话题列表
            QueryWrapper<Topic> topicQueryWrapper=new QueryWrapper<>();
            topicQueryWrapper.eq("topic_id",topic_id);
            List<Topic> topics = topicMapper.selectList(topicQueryWrapper);

            //创建topicVO返回列表
            List<TopicVO> topicList=finishTopicVO(upvotes,topics,openId);
            result.put("topic",topicList);
        }else{
            result.put("msg","token无效!");
        }
        return result;
    }
    //发布话题的方法
    @Override
    public Map<String, Object> publishTopic(HttpServletRequest request, TopicPublishVO topicPublishVO, int college_id) {
        Map<String,Object> result=new HashMap<>();
        if(JwtUtils.checkToken(request)) {
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            Topic topic = new Topic();
            TopicImg img = new TopicImg();
            BeanUtils.copyProperties(topicPublishVO,topic);
            topic.setOpenid(openId);
            topic.setCollegeId(college_id);
            int insertNum = topicMapper.insert(topic);
            if(insertNum == 0){
                result.put("status","failed");
                return result;
            }
            for(String image : topicPublishVO.getImgs()){
                img.setImg(image);
                img.setTopicId(topic.getTopicId());
                topicImgMapper.insert(img);
            }
            result.put("status","success");
            return result;
        }
        else{
            result.put("msg","token无效!");
        }
        return result;

    }

    @Override
    public List<TopicVO> finishTopicVO(List<Upvote> upvotes, List<Topic> topics, String openId) {
        List<TopicVO> topicList = new ArrayList<>();
        //根据topic_id查询对应话题的图片列表
        Upvote up=new Upvote();//临时
        for(Topic t :topics){
            //创建topicVO实体
            TopicVO topicVO=new TopicVO();
            topicVO.setTopicId(t.getTopicId());
            topicVO.setContent(t.getContent());
            topicVO.setUpvoteNum(t.getUpvoteNum());
            topicVO.setIsAnonymous(t.getIsAnonymous());
            //查询该话题的图片列表
            QueryWrapper<TopicImg> topicImgQueryWrapper=new QueryWrapper<>();
            topicImgQueryWrapper.select("img").eq("topic_id",t.getTopicId());
            List<TopicImg> topicImgs = topicImgMapper.selectList(topicImgQueryWrapper);
            List<String> imgs=new ArrayList<>();
            for(TopicImg i:topicImgs){
                imgs.add(i.getImg());
            }
            topicVO.setImgs(imgs);
            //查询该用户是否点赞
            up.setTopicId(t.getTopicId());
            topicVO.setUpvote(upvotes.contains(up));
            //查询话题发布者
            Account account = accountMapper.selectById(t.getOpenid());
            topicVO.setAccount(account);
            //计算时间差
//                Date now = new Date();
//                Date old = t.getGmtModified();
//                long between=(now.getTime()-old.getTime())/1000;
//                long minute=between%3600/60;
            topicVO.setGmt_modified(t.getGmtModified());
            topicList.add(topicVO);
        }
        return topicList;
    }

    @Override
    public List<Upvote> getUpvoteList(String openId) {
        QueryWrapper<Upvote> upvoteQueryWrapper=new QueryWrapper<>();
        upvoteQueryWrapper.select("topic_id").eq("open_id",openId);
        List<Upvote> upvotes = upvoteMapper.selectList(upvoteQueryWrapper);
        return upvotes;
    }
}
