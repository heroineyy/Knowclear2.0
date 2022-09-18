package com.miniapp.knowclear.vo;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ConsultVO {
    private Integer consultId;
    private String title;
    private String content;
    private Integer upvoteNum;
    private String publisher;
    private String avatar;
    private Integer classify;
    private boolean isUpvote;

    private Date gmtModified;
    private List<String> imgs;
}
