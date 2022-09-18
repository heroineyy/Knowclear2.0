package com.miniapp.knowclear.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.miniapp.knowclear.entity.Collection;
import com.miniapp.knowclear.entity.Label;
import com.miniapp.knowclear.entity.Topic;
import com.miniapp.knowclear.entity.Upvote;
import com.miniapp.knowclear.mapper.CollectionMapper;
import com.miniapp.knowclear.mapper.LabelMapper;
import com.miniapp.knowclear.mapper.TopicMapper;
import com.miniapp.knowclear.service.CollectionService;
import com.miniapp.knowclear.service.LabelService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.miniapp.knowclear.service.TopicService;
import com.miniapp.knowclear.utils.JwtUtils;
import com.miniapp.knowclear.vo.LabelTopicVO;
import com.miniapp.knowclear.vo.TopicVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
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
public class LabelServiceImpl extends ServiceImpl<LabelMapper, Label> implements LabelService {

    @Resource
    private LabelMapper labelMapper;
    @Resource
    private CollectionMapper collectionMapper;
    @Autowired
    private TopicService topicService;

    @Override
    public List<Label> getTopicLabels(int college_id, int classify) {
        List<Label> labels = labelMapper.selectAllLabels(college_id, classify);
        if(labels.size()>4){
            return labels.subList(0, 4);
        }else {
            return labels;
        }
    }

    @Override
    public List<Label> getAllLables(int college_id) {
        QueryWrapper<Label> wrapper =new QueryWrapper<>();
        wrapper.eq("college_id",college_id);
        return labelMapper.selectList(wrapper);
    }

    @Override
    public Map<String, Object> selectLabelByOpenId(HttpServletRequest request) {
        Map<String,Object> result=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            //根据openId查询用户收藏表，找到用户收藏的列表
            QueryWrapper<Collection> wrapper = new QueryWrapper<>();
            wrapper.eq("openId",openId);
            List<Collection> collections = collectionMapper.selectList(wrapper);
            //新建标签表
            List<Label> labels = new ArrayList<>();
            //遍历收藏列表，取出labelId并且查询出对应的标签，并且放在列表中
            for(Collection collection : collections){
                labels.add(labelMapper.selectById(collection.getLabelId()));
            }
            result.put("labels",labels);
            return result;

        }else{
            result.put("msg","token无效!");
        }
        return result;
    }

    @Override
    public Map<String, Object> selectLabelTopicById(HttpServletRequest request, int label_id) {
        Map<String,Object> result=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            //调用接口查询标签相关话题
            LabelTopicVO labelTopicVO = new LabelTopicVO();
            List<TopicVO> topicVOList = (List<TopicVO>)topicService.getTopicsByLabelId(request,label_id).get("topics");
            labelTopicVO.setTopicVOList(topicVOList);
            //数据库查询标签相关内容
            QueryWrapper<Label> wrapper = new QueryWrapper<>();
            wrapper.eq("label_Id",label_id);
            Label label = labelMapper.selectOne(wrapper);
            //封装实体类对象
            labelTopicVO.setImg(label.getImg());
            labelTopicVO.setContent(label.getContent());
            labelTopicVO.setName(label.getName());
            //放入返回值返回
            result.put("labelTopics",labelTopicVO);
        }else{
            result.put("msg","token无效!");
        }
        return result;
    }

    @Override
    public List<Label> getAllTopicLabels(int college_id, int classify) {
        List<Label> labels = labelMapper.selectAllLabels(college_id, classify);
        return labels;
    }

    @Override
    public Map<String, Object> publishChatLabel(HttpServletRequest request,Label label,int classify,int college_id) {
        Map<String,Object> result=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            //获取openid
            String openId = JwtUtils.getOpenIdByJwtToken(request);
            Label l = new Label();
            BeanUtils.copyProperties(label,l);
            l.setClassify(classify);
            l.setCollegeId(college_id);
            int insert = labelMapper.insert(l);
            if(insert <= 0){
                result.put("status","failed");
                return result;
            }
            Collection collection = new Collection();
            collection.setLabelId(l.getLabelId());
            collection.setOpenid(openId);
            int inserted = collectionMapper.insert(collection);
            if(inserted <= 0){
                result.put("status","failed");
                return result;
            }
            result.put("status","success");
            return result;
        }else{
            result.put("msg","token无效!");
        }
        return result;
    }

}
