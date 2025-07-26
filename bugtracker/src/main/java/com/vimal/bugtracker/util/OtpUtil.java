package com.vimal.bugtracker.util;

import java.util.Random;

public class OtpUtil {

    public static String generateOtp() {
        int otp = 100000 + new Random().nextInt(900000); // range 100000–999999
        return String.valueOf(otp);
    }
}
