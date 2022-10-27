package com.yxbiancheng.service;

import com.yxbiancheng.pojo.Journ;

import java.util.List;

/**
 * @author yx
 * @date 2022/6/11 上午 08:57
 */
public interface IJournService {
    List<Journ> selectAll();

    List<Journ> searchSelect(String search, String statu);

    int delJourn(int id);

    int insertJourn(String title, String content, String type);

    int updateJourn(String title, String content, String type, String id);

    int updateVisited(int visited, String id);

    int updateStatus(int status, String id);

    int updateReject(String content, String id);

    String rejectReasonSelect(String id);
}
