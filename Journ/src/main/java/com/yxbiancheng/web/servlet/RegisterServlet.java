package com.yxbiancheng.web.servlet;

import com.yxbiancheng.service.impl.UserService;
import com.yxbiancheng.utils.DBUtil;

import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/**
 * @author yx
 * @date 2022/5/17 下午 04:26
 */
@WebServlet("/registerServlet")
public class RegisterServlet extends HttpServlet {
    private final UserService user = new UserService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        try {
            PrintWriter wr = response.getWriter();
            ServletContext context = getServletContext();
            String name = (String) context.getAttribute("username");
            if (name != null && !"".equals(name)) {
                // 进入页面如果域对象不等于空，就将域对象的的值响应出去让ajax接收，只传输一次
                wr.write(name);
                context.removeAttribute("username");
            }
            String username = request.getParameter("username");
            String phone = request.getParameter("phone");
            String password = request.getParameter("password");
            boolean flag = user.registerSelect(username, phone);
            if (!flag) {
                // 判断用户名和手机号没有被注册后，将注册数据添加，检测影响行数
                int isSucceed = user.addUser(username, password, phone);
                if (isSucceed > 0) {
                    // 将注册成功的账号存到域对象中
                    context.setAttribute("username", username);
                    wr.write(String.valueOf(true));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        this.doGet(request, response);
    }

    @Override
    public void destroy() {
        DBUtil.close();
    }
}
