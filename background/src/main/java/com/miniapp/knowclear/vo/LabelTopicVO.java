package com.miniapp.knowclear.vo;


import lombok.Data;

import java.util.List;

@Data
public class LabelTopicVO {
    private String name;
    private String content;
    private String img;
    private List<TopicVO> topicVOList;
}
