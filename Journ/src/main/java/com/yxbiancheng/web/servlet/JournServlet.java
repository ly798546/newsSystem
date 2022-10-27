package com.yxbiancheng.web.servlet;

import com.alibaba.fastjson.JSON;
import com.yxbiancheng.pojo.Journ;
import com.yxbiancheng.service.IJournService;
import com.yxbiancheng.service.impl.JournService;
import com.yxbiancheng.utils.DBUtil;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.util.List;

/**
 * @author yx
 * @date 2022/5/21 下午 02:16
 */
@WebServlet("/journServlet")
public class JournServlet extends HttpServlet {
    IJournService j = new JournService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        try {
            response.setContentType("text/json;charset=utf8");
            PrintWriter wr = response.getWriter();
            // 搜索信息
            String search = request.getParameter("search");
            String status = request.getParameter("status");
            if (search != null && status != null) {
                List<Journ> journs = j.searchSelect(search, status);
                String json = JSON.toJSONString(journs);
                wr.write(json);
                return;
            }

            // 全局搜索
            List<Journ> journs = j.selectAll();
            String json = JSON.toJSONString(journs);
            wr.write(json);
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
