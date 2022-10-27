package com.yxbiancheng.web.servlet;

import com.yxbiancheng.service.impl.JournService;
import com.yxbiancheng.utils.DBUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author yx
 * @date 2022/5/23 上午 09:17
 */
@WebServlet("/operationJourn")
public class OperationJourn extends HttpServlet {
    JournService j = new JournService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 驳回内容数据添加
        String reasonContent = request.getParameter("reasonContent");
        String rejectId = request.getParameter("rejectId");
        if (reasonContent != null && rejectId != null) {
            int affect = j.updateReject(reasonContent, rejectId);
            if (affect > 0) {
                response.getWriter().write(String.valueOf(true));
                return;
            }
        }

        // 驳回理由的内容
        String reasonId = request.getParameter("reasonId");
        if (reasonId != null) {
            String content = j.rejectReasonSelect(reasonId);
            if (content != null) {
                response.setContentType("text/text;charset=utf8");
                response.getWriter().write(content);
                return;
            }
        }

        // 批准和驳回
        String statusId = request.getParameter("statusId");
        String status = request.getParameter("status");
        if (statusId != null && status != null) {
            int stu = Integer.parseInt(status);
            int affect = j.updateStatus(stu, statusId);
            if (affect > 0) {
                response.getWriter().write(String.valueOf(true));
                return;
            }
        }

        // 访问量加1
        String visited = request.getParameter("visited");
        String visitedId = request.getParameter("visitedId");
        if (visited != null && visitedId != null) {
            int count = Integer.parseInt(visited);
            int affect = j.updateVisited(count, visitedId);
            if (affect > 0) {
                response.getWriter().write(String.valueOf(true));
                return;
            }
        }

        // 根据id删除新闻
        String id = request.getParameter("journ_id");
        if (id != null) {
            int journId = Integer.parseInt(id);
            int affect = j.delJourn(journId);
            if (affect > 0) {
                response.getWriter().write(String.valueOf(true));
                return;
            }
        }

        // 新闻修改
        String modifyTitle = request.getParameter("modifyTitle");
        String modifyType = request.getParameter("modifyType");
        String modifyContent = request.getParameter("modifyContent");
        String updateId = request.getParameter("updateId");
        if (modifyTitle != null && modifyType != null && modifyContent != null && updateId != null) {
            int affect = j.updateJourn(modifyTitle, modifyContent, modifyType, updateId);
            if (affect > 0) {
                response.getWriter().write(String.valueOf(true));
                return;
            }
        }

        // 新闻发布
        String title = request.getParameter("title");
        String type = request.getParameter("type");
        String content = request.getParameter("content");
        if (title != null && type != null && content != null) {
            int affect = j.insertJourn(title, content, type);
            if (affect > 0) {
                response.getWriter().write(String.valueOf(true));
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }

    @Override
    public void destroy() {
        DBUtil.close();
    }
}
