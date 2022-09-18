package com.miniapp.knowclear.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {
    private final static String DATETIME = "yyyy-MM-dd HH:mm:ss";
    private final static String DATE = "yyyy-MM-dd";
    private final static String TIME = "HH:mm:ss";

    /**
     * 字符串转日期格式
     * @param str
     * @return 转换为传入的yyyy-MM-dd格式的date类型数据
     * @throws ParseException
     */
    public static Date strToDate(String str) throws ParseException{
        SimpleDateFormat sf = new SimpleDateFormat(DATETIME);
        Date date = sf.parse(str);
        return date;
    }

    /**
     * 字符串转日期格式
     * @param str
     * @param format [DATETIME,DATE,TIME]
     * @return 转换为传入的format格式的date类型数据
     * @throws ParseException
     */
    public static Date strToDate(String str,String format) throws ParseException{
        SimpleDateFormat sf = new SimpleDateFormat(format);
        Date date = sf.parse(str);
        return date;
    }

    /**
     * 时间转字符串
     * @param date
     * @return 按照yyyy-MM-dd格式返回字符串格式时间
     */
    public static String dateToStr(Date date){
        SimpleDateFormat sf = new SimpleDateFormat(DATETIME);
        String str = sf.format(date);
        return str;
    }

    /**
     * 时间格式转字符串
     * @param date
     * @param format [DATETIME,DATE,TIME]
     * @return 按照format格式返回字符串格式时间
     */
    public static String dateToStr(Date date,String format) {
        SimpleDateFormat sf = new SimpleDateFormat(format);
        String str = sf.format(date);
        return str;
    }

}
