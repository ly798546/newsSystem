package com.yxbiancheng.pojo;

/**
 * @author yx
 * @date 2022/5/21 下午 01:01
 */
public class Journ {
    private Integer id;
    private String date;
    private String title;
    private String content;
    private String type;
    private String status;
    private Integer visited;

    public Journ() {
    }

    public Journ(Integer id, String date, String title, String content, String type, String status, Integer visited) {
        this.id = id;
        this.date = date;
        this.title = title;
        this.content = content;
        this.type = type;
        this.status = status;
        this.visited = visited;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getVisited() {
        return visited;
    }

    public void setVisited(Integer visited) {
        this.visited = visited;
    }
}
