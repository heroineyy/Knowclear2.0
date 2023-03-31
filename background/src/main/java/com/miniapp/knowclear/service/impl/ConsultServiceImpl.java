package com.miniapp.knowclear.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.miniapp.knowclear.entity.*;
import com.miniapp.knowclear.mapper.ConsultImgMapper;
import com.miniapp.knowclear.mapper.ConsultMapper;
import com.miniapp.knowclear.mapper.ConsultUpvoteMapper;
import com.miniapp.knowclear.service.ConsultService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.miniapp.knowclear.utils.JwtUtils;
import com.miniapp.knowclear.vo.ConsultVO;
import com.miniapp.knowclear.vo.TopicVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
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
@Slf4j
public class ConsultServiceImpl extends ServiceImpl<ConsultMapper, Consult> implements ConsultService {

    @Resource
    private ConsultMapper consultMapper;

    @Resource
    private ConsultUpvoteMapper consultUpvoteMapper;

    @Resource
    private ConsultImgMapper consultImgMapper;

    @Override
    public Map<String, Object> selectSimpleConsult(int college_id) {
        Map<String,Object> info=new HashMap<>();
        for(int i=0;i<4;i++){
            QueryWrapper<Consult> consultQueryWrapper=new QueryWrapper<>();
            consultQueryWrapper.select("consult_id","title","publisher","avatar","classify").eq("college_id",college_id)
                    .eq("classify",i).orderByDesc("gmt_created");
            List<Consult> consults = consultMapper.selectList(consultQueryWrapper);
            if(consults.size()>3){
                info.put("consult"+i,consults.subList(0,3));
            }else{
                info.put("consult"+i,consults);
            }
        }
        return info;
    }

    @Override
    public Map<String, Object> getConsult(HttpServletRequest httpServletRequest, int college_id, int classify,int pageNum,int pageSize) {
        Map<String,Object> info=new HashMap<>();
        if(JwtUtils.checkToken(httpServletRequest)){
            String openId = JwtUtils.getOpenIdByJwtToken(httpServletRequest);

            //根据openid查询该用户点赞过哪些文章
            List<ConsultUpvote> upvotes = getConsultUpvoteList(openId);

            //分页查询
            Page<Consult> page=new Page<>(pageNum,pageSize);

            //根据college_id和classify查询
            QueryWrapper<Consult> consultQueryWrapper=new QueryWrapper<>();
            consultQueryWrapper.eq("college_id",college_id).eq("classify",classify).orderByDesc("gmt_modified");

            //List<Consult> consults=consultMapper.selectList(consultQueryWrapper);
            Page<Consult> consultsPage=consultMapper.selectPage(page,consultQueryWrapper);
            List<Consult> consults=consultsPage.getRecords();
            log.info("success!!!");
            //ConsultVO返回列表
            List<ConsultVO> consultList=finishConsultVO(upvotes,consults,openId);
            info.put("consultList",consultList);
        }else{
            info.put("msg","token无效!");
        }
        return info;
    }

    @Override
    public Map<String, Object> getConsultsByClassify(HttpServletRequest request, int classify) {
        Map<String,Object> info=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);

            //根据openid查询该用户点赞过哪些文章
            List<ConsultUpvote> upvotes = getConsultUpvoteList(openId);

            //根据classify查询
            QueryWrapper<Consult> consultQueryWrapper=new QueryWrapper<>();
            consultQueryWrapper.eq("classify",classify).orderByDesc("gmt_modified");
            List<Consult> consults=consultMapper.selectList(consultQueryWrapper);

            //ConsultVO返回列表
            List<ConsultVO> consultList=finishConsultVO(upvotes,consults,openId);
            info.put("consultList",consultList);
        }else{
            info.put("msg","token无效!");
        }
        return info;
    }

    @Override
    public List<ConsultVO> finishConsultVO(List<ConsultUpvote> upvotes, List<Consult> consults, String openId) {

        List<ConsultVO> consultList=new ArrayList<>();

        //根据consult_id查询对应话题的图片列表
        ConsultUpvote up=new ConsultUpvote();//临时
        for(Consult c :consults){
            //创建ConsultVO实体
            ConsultVO consultVO=new ConsultVO();
            consultVO.setConsultId(c.getConsultId());
            consultVO.setContent(c.getContent());
            consultVO.setUpvoteNum(c.getUpvoteNum());
            consultVO.setAvatar(c.getAvatar());
            consultVO.setTitle(c.getTitle());
            consultVO.setPublisher(c.getPublisher());
            consultVO.setClassify(c.getClassify());
            //查询该话题的图片列表
            QueryWrapper<ConsultImg> consultImgQueryWrapper=new QueryWrapper<>();
            consultImgQueryWrapper.select("img").eq("consult_id",c.getConsultId());
            List<ConsultImg> consultImgs = consultImgMapper.selectList(consultImgQueryWrapper);
            List<String> imgs=new ArrayList<>();
            for(ConsultImg i:consultImgs){
                imgs.add(i.getImg());
            }
            consultVO.setImgs(imgs);
            //查询该用户是否点赞
            up.setConsultId(c.getConsultId());
            consultVO.setUpvote(upvotes.contains(up));
            //计算时间差
//                Date now = new Date();
//                Date old = t.getGmtModified();
//                long between=(now.getTime()-old.getTime())/1000;
//                long minute=between%3600/60;
            consultVO.setGmtModified(c.getGmtModified());
            consultList.add(consultVO);
        }

        return consultList;
    }

    @Override
    public Map<String, Object> getOneConsultByConsultId(HttpServletRequest request, int consult_id) {
        Map<String,Object> info=new HashMap<>();
        if(JwtUtils.checkToken(request)){
            String openId = JwtUtils.getOpenIdByJwtToken(request);

            //根据openid查询该用户点赞过哪些文章
            List<ConsultUpvote> upvotes = getConsultUpvoteList(openId);

            //根据classify查询
            QueryWrapper<Consult> consultQueryWrapper=new QueryWrapper<>();
            consultQueryWrapper.eq("consult_id",consult_id).orderByDesc("gmt_modified");
            List<Consult> consults=consultMapper.selectList(consultQueryWrapper);

            //ConsultVO返回列表
            List<ConsultVO> consultList=finishConsultVO(upvotes,consults,openId);
            info.put("consultList",consultList);
        }else{
            info.put("msg","token无效!");
        }
        return info;
    }

    @Override
    public List<ConsultUpvote> getConsultUpvoteList(String openId) {
        //根据openid查询该用户点赞过哪些文章
        QueryWrapper<ConsultUpvote> upvoteQueryWrapper=new QueryWrapper<>();
        upvoteQueryWrapper.select("consult_id").eq("openid",openId);
        List<ConsultUpvote> upvotes = consultUpvoteMapper.selectList(upvoteQueryWrapper);
        return upvotes;
    }

    @Override
    public Map<String, Object> publishConsult(int college_id) {
        return null;
    }
}
