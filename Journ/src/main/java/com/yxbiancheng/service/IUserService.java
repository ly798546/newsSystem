package com.yxbiancheng.service;

/**
 * @author yx
 * @date 2022/6/11 上午 08:55
 */
public interface IUserService {
    String loginSelect(String username, String userpwd);

    boolean registerSelect(String username, String phone);

    int addUser(String username, String userpwd, String phone);

}
