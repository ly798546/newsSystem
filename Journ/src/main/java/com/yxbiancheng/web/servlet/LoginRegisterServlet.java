package com.yxbiancheng.web.servlet;

import com.yxbiancheng.service.IUserService;
import com.yxbiancheng.service.impl.UserService;
import com.yxbiancheng.utils.CaptchaUtil;
import com.yxbiancheng.web.old.BaseServlet;

import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * @author yx
 * @date 2022/5/17 下午 02:33
 */
@WebServlet("/loginRegister/*")
public class LoginRegisterServlet extends BaseServlet {
    private final IUserService user = new UserService();

    /**
     * 登录
     */
    public void login(HttpServletRequest request, HttpServletResponse response) {
        String username = request.getParameter("username");
        String userpwd = request.getParameter("userpwd");
        try {
            // 检查登录的账号是否存在，存在就登录成功，否则登录失败
            String login = user.loginSelect(username, userpwd);
            if (!login.isEmpty()) {
                request.getSession().setAttribute("isCheck", "通过");
            }
            response.getWriter().write(login);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 注册
     */
    public void register(HttpServletRequest request, HttpServletResponse response) {
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        int isSucceed = user.addUser(username, password, email);
        if (isSucceed > 0) {
            try {
                // 将注册成功的账号存到域对象中
                getServletContext().setAttribute("username", username);
                response.getWriter().write(isSucceed + "");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 检查用户名与邮箱是否存在
     */
    public void checkField(HttpServletRequest request, HttpServletResponse response) {
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        boolean flag = user.registerSelect(username, email);
        if (!flag) {
            try {
                response.getWriter().write("true");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 返回username
     */
    public void echoUsername(HttpServletRequest request, HttpServletResponse response) {
        ServletContext context = getServletContext();
        String name = (String) context.getAttribute("username");
        if (name != null && !"".equals(name)) {
            try {
                // 进入页面如果域对象不等于空，就将域对象的的值响应出去让ajax接收，只传输一次
                response.getWriter().write(name);
                context.removeAttribute("username");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 给邮箱发送验证码
     */
    public void sendCaptcha(HttpServletRequest request, HttpServletResponse response) {
        try {
            // 获取session对象
            HttpSession session = request.getSession();
            PrintWriter wr = response.getWriter();
            String email = request.getParameter("email");
            boolean captchaTime = Boolean.parseBoolean(request.getParameter("captchaTime"));
            if (captchaTime) {
                wr.write("success");
                return;
            }
            String code = CaptchaUtil.sendAuthCodeEmail(email, 6);
            if (code != null) {
                wr.write("success");
            }

            // 将验证码存入session中
            session.setAttribute("captcha", code);
            // 设置session的生命周期为30分钟
            Cookie cookie = new Cookie("JSESSIONID", session.getId());
            cookie.setMaxAge(60 * 30);
            // 把cookie响应给客户端
            response.addCookie(cookie);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 检查验证码是否正确
     */
    public void checkCaptcha(HttpServletRequest request, HttpServletResponse response) {
        String captcha = request.getParameter("captcha");
        // 获取存在session中的验证码
        String code = (String) request.getSession().getAttribute("captcha");
        if (code != null && captcha != null) {
            if (code.equals(captcha)) {
                try {
                    response.getWriter().write("success");
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
