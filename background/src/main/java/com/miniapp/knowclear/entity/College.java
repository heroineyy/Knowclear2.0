package com.miniapp.knowclear.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author tlr&ztp
 * @since 2022-01-26
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class College implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "college_id", type = IdType.AUTO)
    private Integer collegeId;

    private String name;


}
