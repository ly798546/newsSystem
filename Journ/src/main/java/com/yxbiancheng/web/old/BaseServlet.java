package com.yxbiancheng.web.old;

import com.yxbiancheng.utils.DBUtil;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Method;

/**
 * @author yx
 * @date 2022/5/27 下午 05:28
 */
public class BaseServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) {
        try {
            req.setCharacterEncoding("utf8");
            resp.setContentType("text/html;charset=utf8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        // 获取短路径 例如：/vueDemo/book/pagingSelect
        String uri = req.getRequestURI();
        // 找到最后一个/ 分隔符，然后获取最后一个路径名
        int index = uri.lastIndexOf('/');
        String methodName = uri.substring(index + 1);
        // 获取子类的Class类
        Class<? extends BaseServlet> aclass = this.getClass();

        try {
            // 通过反射执行对应的method方法
            Method method = aclass.getDeclaredMethod(methodName, HttpServletRequest.class, HttpServletResponse.class);
            method.invoke(this, req, resp);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void destroy() {
        DBUtil.close();
    }
}
