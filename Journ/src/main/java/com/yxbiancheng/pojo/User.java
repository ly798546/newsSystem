package com.yxbiancheng.pojo;

/**
 * @author yx
 * @date 2022/5/17 下午 02:11
 */
public class User {
    /*用户编号*/
    private Integer Uid;
    /*编号*/
    private Integer id;
    /*用户名*/
    private String username;
    /*用户密码*/
    private String userpwd;
    /*手机号*/
    private Integer phone;

    @Override
    public String toString() {
        return "User{" +
                "Uid=" + Uid +
                ", id=" + id +
                ", username='" + username + '\'' +
                ", userpwd='" + userpwd + '\'' +
                ", phone=" + phone +
                '}';
    }

    public User() {
    }

    public User(Integer uid, Integer id, String username, String userpwd, Integer phone) {
        Uid = uid;
        this.id = id;
        this.username = username;
        this.userpwd = userpwd;
        this.phone = phone;
    }

    public Integer getUid() {
        return Uid;
    }

    public void setUid(Integer uid) {
        Uid = uid;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserpwd() {
        return userpwd;
    }

    public void setUserpwd(String userpwd) {
        this.userpwd = userpwd;
    }

    public Integer getPhone() {
        return phone;
    }

    public void setPhone(Integer phone) {
        this.phone = phone;
    }
}
