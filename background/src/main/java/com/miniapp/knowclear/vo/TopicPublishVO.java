package com.miniapp.knowclear.vo;

import lombok.Data;

import java.util.List;
@Data
public class TopicPublishVO {
    private String content;
    private Integer isAnonymous;
    private List<String> imgs;
    private Integer labelId;
    private Integer classify;
}
