package com.miniapp.knowclear.service;

import com.miniapp.knowclear.entity.Consult;
import com.baomidou.mybatisplus.extension.service.IService;
import com.miniapp.knowclear.entity.ConsultUpvote;
import com.miniapp.knowclear.vo.ConsultVO;

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
public interface ConsultService extends IService<Consult> {
    //获取资讯首页
    Map<String,Object> selectSimpleConsult(int college_id);
    //根据分类和学校id搜索资讯
    Map<String,Object> getConsult(HttpServletRequest httpServletRequest, int college_id, int classify,int pageNum,int pageSize);
//    //根据关键字模糊搜索话题
//    Map<String,Object> getConsultsBySerach(HttpServletRequest httpServletRequest, int college_id, String info);
    //根据classify获取资讯列表
    Map<String,Object> getConsultsByClassify(HttpServletRequest request,int classify);
    //根据consult_id获取单一资讯
    Map<String,Object> getOneConsultByConsultId(HttpServletRequest request,int consult_id);

    //提取代码的重复部分
    List<ConsultVO> finishConsultVO(List<ConsultUpvote> upvotes, List<Consult> consults, String openId);

    //根据openid查询该用户点赞过哪些文章
    List<ConsultUpvote> getConsultUpvoteList(String openId);
    //发布资讯的方法
    Map<String, Object> publishConsult(int college_id);
}
