package com.yxbiancheng.service.impl;

import com.yxbiancheng.pojo.Journ;
import com.yxbiancheng.service.IJournService;
import com.yxbiancheng.utils.DBUtil;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * @author yx
 * @date 2022/5/21 下午 01:55
 */
public class JournService extends DBUtil implements IJournService {
    /**
     * 查询所有
     *
     * @return 集合
     */
    @Override
    public List<Journ> selectAll() {
        List<Journ> list = new ArrayList<>();
        Journ j;
        try {
            String status;
            pstat = conn.prepareStatement("select * from t_journ where status = 1 and delstatus = 0 order by visited desc");
            res = pstat.executeQuery();
            while (res.next()) {
                status = status(res.getString("status"));
                j = new Journ(res.getInt("id"), res.getString("date"), res.getString("title"), res.getString("content"), res.getString("type"), status, res.getInt("visited"));
                list.add(j);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * 数据搜索
     *
     * @param search 数据
     * @return 集合
     */
    @Override
    public List<Journ> searchSelect(String search, String statu) {
        List<Journ> list = new ArrayList<>();
        Journ j;
        try {
            String status;
            // 只进行标题和类别搜索
            pstat = conn.prepareStatement("select * from t_journ where ((title like ? or type like ?) and status = ?) and delstatus = 0 order by visited desc");
            System.out.print("");
            pstat.setString(1, "%" + search + "%");
            pstat.setString(2, "%" + search + "%");
            pstat.setString(3, statu);
            res = pstat.executeQuery();
            while (res.next()) {
                status = status(res.getString("status"));
                j = new Journ(res.getInt("id"), res.getString("date"), res.getString("title"), res.getString("content"), res.getString("type"), status, res.getInt("visited"));
                list.add(j);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * 删除新闻
     *
     * @param id id
     * @return 整数
     */
    @Override
    public int delJourn(int id) {
        int affect = 0;
        try {
            pstat = conn.prepareStatement("update t_journ set delstatus = 1 where id = ?");
            pstat.setInt(1, id);
            affect = pstat.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return affect;
    }

    /**
     * 添加新闻
     */
    @Override
    public int insertJourn(String title, String content, String type) {
        LocalDateTime l = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss");
        String dateTime = formatter.format(l);
        int affect = 0;
        try {
            pstat = conn.prepareStatement("insert into t_journ values(null,'" + dateTime + "','" + title + "','" + content + "','" + type + "',0,'',0,0)");
            affect = pstat.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return affect;
    }

    /**
     * 修改新闻
     */
    @Override
    public int updateJourn(String title, String content, String type, String id) {
        int affect = 0;
        try {
            pstat = conn.prepareStatement("update t_journ set title = '" + title + "', content = '" + content + "', type = '" + type + "' where id = " + id);
            affect = pstat.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return affect;
    }

    /**
     * 修改访问量
     */
    @Override
    public int updateVisited(int visited, String id) {
        int affect = 0;
        try {
            pstat = conn.prepareStatement("update t_journ set visited = ? where status = 1 and id = " + id);
            pstat.setInt(1, (visited + 1));
            affect = pstat.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return affect;
    }

    /**
     * 新闻的批准与驳回
     */
    @Override
    public int updateStatus(int status, String id) {
        int affect = 0;
        try {
            pstat = conn.prepareStatement("update t_journ set status = ? where status = 0 and id = " + id);
            pstat.setInt(1, status);
            affect = pstat.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return affect;
    }

    /**
     * 驳回理由
     */
    @Override
    public int updateReject(String content, String id) {
        int affect = 0;
        try {
            pstat = conn.prepareStatement("update t_journ set rejectreason = ? where status = 0 and id = " + id);
            pstat.setString(1, content);
            affect = pstat.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return affect;
    }

    /**
     * 驳回理由内容
     */
    @Override
    public String rejectReasonSelect(String id) {
        String content = null;
        try {
            pstat = conn.prepareStatement("select rejectreason from t_journ where status = 2 and id = ?");
            pstat.setString(1, id);
            res = pstat.executeQuery();
            res.next();
            content = res.getString(1);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return content;
    }

    public String status(String status) {
        switch (status) {
            case "0":
                return "审核中";
            case "1":
                return "已发布";
            case "2":
                return "已驳回";
            default:
                return status;
        }
    }
}
