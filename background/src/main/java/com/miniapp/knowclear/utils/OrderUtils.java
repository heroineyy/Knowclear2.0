package com.miniapp.knowclear.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

public class OrderUtils {
    public static String getOrderIdByTime(int status) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String newDate = sdf.format(new Date());
        StringBuilder result = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 5; i++) {
            result.append(random.nextInt(10));
        }
        return newDate + result + status;
    }
}
