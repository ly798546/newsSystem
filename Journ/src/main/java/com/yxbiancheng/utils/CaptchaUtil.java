package com.yxbiancheng.utils;

import org.apache.commons.mail.HtmlEmail;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

/**
 * @author yx
 * @date 2022/6/12 上午 09:39
 */
public class CaptchaUtil {

    /**
     * 获取当前日期
     */
    private static String getCurrentDate() {
        LocalDateTime l = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH : mm : ss");
        return l.format(formatter);
    }

    /**
     * 生成随机数
     *
     * @param randomCount 随机数数量
     */
    private static String generateCaptcha(int randomCount) {
        Random random = new Random();
        StringBuilder builder = new StringBuilder();
        for (int i = 1; i <= randomCount; i++) {
            builder.append(random.nextInt(10));
        }
        return builder.toString();
    }

    /**
     * 发送生成的邮箱验证码，目前只支持QQ邮箱
     *
     * @param email 需要发送的邮箱地址
     */
    public static String sendAuthCodeEmail(String email, int randomCount) {
        try {
            /*发送邮件的服务器 126邮箱为smtp.126.com,163邮箱为163.smtp.com，QQ为smtp.qq.com*/
            HtmlEmail mail = new HtmlEmail();
            String emailService = "smtp.qq.com";
            if (email.lastIndexOf("@163") != -1) {
                emailService = "163.smtp.com";
            } else if (email.lastIndexOf("@126") != -1) {
                emailService = "smtp.126.com";
            }
            mail.setHostName(emailService);
            /*不设置发送的消息有可能是乱码*/
            mail.setCharset("UTF-8");
            /*发送邮件的邮箱和发件人*/
            mail.setFrom("yxixd@qq.com", "手滑了");
            /*IMAP/SMTP服务的密码*/
            mail.setAuthentication("yxixd@qq.com", "slhacorrxkzteagh");
            /*使用安全链接*/
            mail.setSSLOnConnect(true);
            /*接收的邮箱*/
            mail.addTo(email);
            /*验证码*/
            String code = generateCaptcha(randomCount);
            /*设置邮件的主题*/
            mail.setSubject("注册验证码");
            /*设置邮件的内容*/
            mail.setHtmlMsg("<div style=\"padding: 0 25px; font-size: 12px; font-family: '微软雅黑';\"><b>亲爱的用户：</b><br><br>您好！感谢您使用本次服务，您正在进行邮箱验证，本次请求的验证码为：<br><span style=\"color: #bbb;\"><b style=\"color: orange; font-size: 16px;\">" + code + "</b>（为了保障您账号的安全性，请在30分钟内完成验证。）</span><br><br><br>" + getCurrentDate() + "</div>");
            // 发送邮箱
            mail.send();
            return code;
        } catch (Exception e) {
            return null;
        }
    }
}
