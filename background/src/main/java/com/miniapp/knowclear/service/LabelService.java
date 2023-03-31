package com.miniapp.knowclear.service;

import com.miniapp.knowclear.entity.Label;
import com.baomidou.mybatisplus.extension.service.IService;
import org.springframework.web.bind.annotation.PathVariable;

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
public interface LabelService extends IService<Label> {
    List<Label> getTopicLabels(int college_id, int classify);

    List<Label> getAllLables(int college_id);

    Map<String, Object> selectLabelByOpenId(HttpServletRequest request);

    Map<String, Object> selectLabelTopicById(HttpServletRequest request, int label_id);

    List<Label> getAllTopicLabels(int college_id, int classify,int pageNum,int pageSize);

    Map<String, Object> publishChatLabel(HttpServletRequest request,Label label,int classify,int college_id);
}
