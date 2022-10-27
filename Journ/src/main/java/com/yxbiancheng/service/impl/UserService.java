package com.yxbiancheng.service.impl;

import com.yxbiancheng.service.IUserService;
import com.yxbiancheng.utils.DBUtil;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author yx
 * @date 2022/5/17 下午 02:23
 */
public class UserService extends DBUtil implements IUserService {
    /**
     * 登录校验
     *
     * @param username 用户名
     * @param userpwd  密码
     * @return boolean
     */
    @Override
    public String loginSelect(String username, String userpwd) {
        String site = "";
        List<Object> args = new ArrayList<>();
        args.add(username);
        args.add(userpwd);
        try {
            conn.setAutoCommit(false);
            pstat = conn.prepareStatement("select * from t_user where username = ? and userpwd = ?");
            setParams(args.toArray());
            res = pstat.executeQuery();
            if (res != null) {
                if (res.next()) {
                    if ("1".equals(res.getString("identity"))) {
                        site = "../Journpage/adminPage.html";
                    } else {
                        site = "../Journpage/superAdminPage.html";
                    }
                }
            }
            conn.commit();
        } catch (Exception e) {
            try {
                conn.rollback();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
        }
        return site;
    }

    /**
     * 检查注册的用户名与手机号是否被注册
     *
     * @param username 用户名
     * @param email    邮箱
     * @return boolean
     */
    @Override
    public boolean registerSelect(String username, String email) {
        boolean flag = false;
        List<Object> args = new ArrayList<>();
        args.add(username);
        args.add(email);
        try {
            conn.setAutoCommit(false);
            pstat = conn.prepareStatement("select * from t_user where username = ? or email = ?");
            setParams(args.toArray());
            res = pstat.executeQuery();
            if (res != null) {
                if (res.next()) {
                    flag = true;
                }
            }
            conn.commit();
        } catch (Exception e) {
            try {
                conn.rollback();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
        }
        return flag;
    }

    /**
     * 注册账号
     *
     * @param username 用户名
     * @param userpwd  密码
     * @param email    邮箱
     */
    @Override
    public int addUser(String username, String userpwd, String email) {
        int isSucceed = 0;
        List<Object> args = new ArrayList<>();
        args.add(username);
        args.add(userpwd);
        args.add(email);
        if (username != null && userpwd != null && email != null) {
            try {
                pstat = conn.prepareStatement("insert into t_user values(null,?,?,?,1)");
                setParams(args.toArray());
                // 影响行数，不执行就注册不了
                isSucceed = pstat.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return isSucceed;
    }
}