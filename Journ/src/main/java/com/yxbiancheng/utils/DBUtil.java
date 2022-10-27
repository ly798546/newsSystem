package com.yxbiancheng.utils;

import java.sql.*;

/**
 * @author yx
 * @date 2022/5/17 上午 10:07
 */
public class DBUtil {
    public static Connection conn;
    public static PreparedStatement pstat;
    public static ResultSet res;

    static {
        //连接数据库
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            // 编码utf-8&开启与准备
            String url = "jdbc:mysql:///xinwen?characterEncoding=utf8&useServerPrepStmts=true";
            String user = "root";
            String password = "d";
            conn = DriverManager.getConnection(url, user, password);
            System.out.println("数据库连接成功!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 设置pstat的参数
     *
     * @param args 参数数据
     */
    public static void setParams(Object... args) {
        for (int i = 0; i < args.length; i++) {
            try {
                pstat.setObject(i + 1, args[i]);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 修改数据
     * @param sql sql语句
     * @param args SQL操作符的val
     * @return 影响行数
     */
    public static int updateData(String sql, Object... args) {
        int affect = 0;
        try {
            pstat = conn.prepareStatement(sql);
            setParams(args);
            affect = pstat.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return affect;
    }

    /**
     * 释放资源
     */
    public static void close() {
        try {
            if (res != null) {
                res.close();
            }
            if (pstat != null) {
                pstat.close();
            }
            if (conn != null) {
                conn.close();
            }
            System.out.println("资源已释放\n---------------");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
