package com.yxbiancheng.web.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * @author yx
 * @date 2022/6/7 上午 10:28
 */

@WebFilter("/")
public class LoginFilter implements Filter {
    @Override
    public void init(FilterConfig config) throws ServletException {
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws ServletException, IOException {
        String[] url = {"/loginServlet", "/operationJourn", "/journServlet", "/registerServlet", "/Login&Register", "/css/", "/js/", "/images/", "favicon.ico", "identity.html", "commonPage.html"};
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;
        String uri = req.getRequestURI();
        for (String s : url) {
            if (uri.contains(s)) {
                // 放行
                chain.doFilter(req, response);
                return;
            }
        }
        HttpSession session = req.getSession();
        Object isCheck = session.getAttribute("isCheck");
        if (isCheck == null) {
            resp.sendRedirect("http://localhost/ajaxDemo/Login&Register/LoginRegister.html");
        } else {
            chain.doFilter(request, response);
            session.removeAttribute("isCheck");
        }
    }
}
