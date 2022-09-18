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
public class ConsultImg implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "consult_img_id", type = IdType.AUTO)
    private Integer consultImgId;

    private Integer consultId;

    private String img;


}
