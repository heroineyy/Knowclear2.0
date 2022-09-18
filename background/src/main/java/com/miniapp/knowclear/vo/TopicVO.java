package com.miniapp.knowclear.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.miniapp.knowclear.entity.Account;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class TopicVO {
    private Integer topicId;
    private String content;
    private Integer upvoteNum;
    private Integer isAnonymous;
    private List<String> imgs;
    private boolean isUpvote;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date gmt_modified;

    private Account account;
}
