$(function () {
    console.log("\n%cAuthor：锣影\n", "font-family:'微软雅黑';font-size: 20px;color:skyblue;");

    let status = 1;
    // 将第一个li标签修改背景颜色
    $("#journList").css({
        background: "#faa100",
        color: "white",
        borderRadius: "5px"
    });
    // 进入页面就展示所有新闻信息
    $.get("../journServlet", {status: 1}, function (e) {
        data(e, "抱歉，暂时还没有新闻");
    });

    // 根据搜索信息获取新闻信息
    let issued = false;
    let stayAudit = false;
    let down = false;
    $(".journ-search>#search").on("click", function () {
        let search = $(".journ-search>.search").val().trim();
        $.get("../journServlet", {search, status}, function (e) {
            if (status === 1 && !issued) {
                data(e, "抱歉，没有找到您要找的新闻");
            } else if (!stayAudit) {
                data2(e, "抱歉，没有找到您要找的新闻");
            } else if (!down) {
                data2(e, "抱歉，没有找到您要找的新闻");
                $(".t-body #operation").html("<div class='operation'><span class='rejectReason'>驳回理由</span></div>");
                $(".t-body #operation .rejectReason").on("click", function () {
                    let id = $(this).parents("tr").attr("data-id");
                    $.get("../operationJourn", {reasonId: id}, function (e) {
                        contentShow("驳回的理由", '', e);
                    });
                });
            } else {
                data2(e, "抱歉，暂时还没有待审核的新闻");
                $(".t-body #operation").html("<div class='operation'><span class='ratify'>批准</span><span class='down'>驳回</span></div>");
                // 新闻批准
                $(".t-body #operation .ratify").on("click", function () {
                    let id = $(this).parents("tr").attr("data-id").trim();
                    $.get("../operationJourn", {statusId: id, status: 1}, function (e) {
                        if (e === "true") {
                            hint("已成功批准");
                            $(".journ-search>#search").click();
                        }
                    });
                });
                // 新闻驳回
                $(".t-body #operation .down").on("click", function () {
                    let id = $(this).parents("tr").attr("data-id").trim();
                    rejectReason(id);
                });
            }
        });
    });

    // 键盘回车事件
    $(".journ-search>.search").on("keyup", function (e) {
        if (e.keyCode === 13) {
            $(".journ-search>#search").click();
        }
    });

    // 调整背景
    $(".list-fun li").on("click", function () {
        $(this).css({
            background: "#faa100",
            color: "white",
            borderRadius: "5px"
        }).siblings("li").attr("style", "");
        $(".fun-title").text($(this).text());
    });

    // 新闻列表
    $("#journList").on("click", function () {
        issued = false;
        status = 1;
        $(".journ-search>#search").click();
    });

    // 审核中的新闻
    $("#audit").on("click", function () {
        stayAudit = false;
        status = 0;
        $(".journ-search>#search").click();
    });

    // 待审核
    $("#stayAudit").on("click", function () {
        stayAudit = true;
        down = true;
        status = 0;
        $(".journ-search>#search").click();
    });

    // 已发布的新闻
    $("#succeed").on("click", function () {
        stayAudit = false;
        issued = true;
        status = 1;
        $(".journ-search>#search").click();
    });

    // 已驳回的新闻
    $("#fail").on("click", function () {
        stayAudit = true;
        down = false;
        status = 2;
        $(".journ-search>#search").click();
    });

    // 返回首页
    $(document).on("click", "#index", function () {
        window.location.href = "../identity.html";
    });

    // 新闻发布页面打开
    $(".journ-search #issued").on("click", function () {
        $(".issued-container #title").val("");
        $(".issued-container #type").val("0");
        $(".issued-container #content").val("");
        $(".issued-backdrop").fadeIn(200);
        $(".issued-container").css({
            opacity: "1",
            transform: "scale(1)"
        });
        // 取消按钮
        $("#cancel-btn").on("click", function () {
            $(".issued-backdrop").fadeOut("fast");
            $(".issued-container").css({
                opacity: "0",
                transform: "scale(.5)"
            });
        });
    });
    // 键盘事件
    $(window).on("keyup", function (e) {
        // 键盘esc取消事件
        if (e.keyCode === 27) {
            //     $("#cancel-btn").click();
            $(".content-close").click();
            //     $("#cancel-btn2").click();
            $(".del-cancel,.del-return").click();
            //     $("#reason-cancel").click();
        }
        // 组合键
        if (e.ctrlKey && e.keyCode === 38) {
            $(".journ-search #issued").click();
        }
        if (e.ctrlKey && e.keyCode === 13) {
            $(".content-maximize").click();
        }
    });

    // 新闻发布按钮
    $(".issued-container #sub").on("click", function () {
        // 数据校验
        let title = $(".issued-container #title").val().trim();
        let type = $(".issued-container #type").val().trim();
        let content = $(".issued-container #content").val().trim();
        if (title === "") {
            hint("请输入新闻标题");
        } else if (title.length < 4) {
            hint("标题的长度不能小于4位");
        } else if (type === "0") {
            hint("请选择新闻类型");
        } else if (content === "") {
            hint("新闻内容不能为空");
        } else {
            // 校验完成就执行发布
            $.post("../operationJourn", {title: title, type: type, content: content}, function (e) {
                if (e === "true") {
                    hint("发布成功，请先等待审核 . . .");
                    // 添加之后重新进行列表排列
                    $(".journ-search>#search").click();
                }
            });
            $(".issued-backdrop").hide();
            $(".issued-container").css({
                opacity: "0",
                transform: "scale(.5)"
            });
        }
    });

    //TODO
    /* -----------------------函数调用区----------------------- */

    // 打开内容
    function openContent() {
        $(".t-body table .showContent").on("click", function () {
            // 获取当前行的文本内容
            let title = $(this).parent("tr").children("td").eq(1).html();
            let date = $(this).parent("tr").children("td").eq(0).html();
            let content = $(this).parent("tr").children("td").eq(2).html();
            /*访问量*/
            let visited = $(this).parent("tr").children("td").eq(4).text().trim();
            /*id*/
            let id = $(this).parent("tr").attr("data-id").trim();
            contentShow(title, date, content, function () {
                $.get("../operationJourn", {visited: visited, visitedId: id}, function (e) {
                    if (e === "true") {
                        $(".journ-search>#search").click();
                    }
                });
            });
        });
    }

    // 打印表格数据
    function data(e, text) {
        // 判断如果没有新闻就提示没有新闻
        if (e === null || e.length === 0) {
            $(".t-body").css({
                justifyContent: "center",
                alignItems: "center",
                height: "600px",
                fontSize: "20px"
            }).text(text);
        } else {
            $(".t-body").text("").attr("style", "").append($("<table>"));
            $(".status,.temp").remove();
            let eachtable = "";
            // 遍历响应的json数据打印到表格中
            $.each(e, function (index, value) {
                eachtable += "<tr data-id='" + value["id"] + "'>\n" +
                    "            <td class='showContent'>" + value["date"] + "</td>\n" +
                    "            <td class='showContent'>" + value["title"] + "</td>\n" +
                    "            <td class='showContent'>" + value["content"] + "</td>\n" +
                    "            <td class='showContent'>" + value["type"] + "</td>\n" +
                    "            <td class='showContent'>" + value["visited"] + "</td>\n" +
                    "            </tr>"
            });
            $(".t-body>table").html(eachtable);
            openContent();
        }
    }

    function data2(e, text) {
        // 判断如果没有新闻就提示没有新闻
        if (e === null || e.length === 0) {
            $(".t-body").css({
                justifyContent: "center",
                alignItems: "center",
                height: "600px",
                fontSize: "20px"
            }).text(text);
        } else {
            $(".status,.temp").remove();
            $(".t-head tr").append($("<th class='status'>状态</th><th class='temp'></th>"));
            $(".t-body").text("").attr("style", "").append($("<table>"));
            let eachtable = "";
            // 遍历响应的json数据打印到表格中
            $.each(e, function (index, value) {
                eachtable += "<tr data-id='" + value["id"] + "'>\n" +
                    "            <td class='showContent'>" + value["date"] + "</td>\n" +
                    "            <td class='showContent'>" + value["title"] + "</td>\n" +
                    "            <td class='showContent'>" + value["content"] + "</td>\n" +
                    "            <td class='showContent'>" + value["type"] + "</td>\n" +
                    "            <td class='showContent'>" + value["visited"] + "</td>\n" +
                    "            <td class='showContent'>" + value["status"] + "</td>\n" +
                    "            <td id='operation'><div class='operation'><span class='redact'>编辑</span><span class='del'>删除</span></div></td></tr>"
            });
            $(".t-body>table").html(eachtable);
            openContent();
            // 删除按钮事件
            $(".t-body .operation>.del").on("click", function () {
                let id = $(this).parents("tr").attr("data-id");
                confirmWin(function () {
                    $.get("../operationJourn", {journ_id: id}, function (e) {
                        if (e === "true") {
                            hint("删除成功");
                            // 删除之后重新进行列表排列
                            $(".journ-search>#search").click();
                        }
                    });
                });
            });
            // 新闻修改事件
            $(".t-body .operation>.redact").on("click", function () {
                let title = $(".modify-container #title2");
                let type = $(".modify-container #type2");
                let content = $(".modify-container #content2");
                updateId = $(this).parents("tr").attr("data-id");
                // 将获取的值赋值给各个文本框
                title.val($(this).parents("tr").children("td").eq(1).html().trim());
                type.val($(this).parents("tr").children("td").eq(3).html());
                content.val($(this).parents("tr").children("td").eq(2).html().trim());
                $(".modify-backdrop").fadeIn(200);
                $(".modify-container").css({
                    opacity: "1",
                    transform: "scale(1)"
                });

                // 取消按钮
                $("#cancel-btn2").on("click", function () {
                    $(".modify-backdrop").fadeOut("fast");
                    $(".modify-container").css({
                        opacity: "0",
                        transform: "scale(.5)"
                    });
                });
            });
        }
    }


    // 新闻修改发布按钮
    $(".modify-container #sub2").on("click", function () {
        // 数据校验
        let modifyTitle = $(".modify-container #title2").val().trim();
        let modifyType = $(".modify-container #type2").val().trim();
        let modifyContent = $(".modify-container #content2").val().trim();
        if (modifyTitle === "") {
            hint("请输入新闻标题");
        } else if (modifyTitle.length < 4) {
            hint("标题的长度不能小于4位");
        } else if (modifyType === "0") {
            hint("请选择新闻类型");
        } else if (modifyContent === "") {
            hint("新闻内容不能为空");
        } else {
            // 校验完成就执行发布
            $.post("../operationJourn", {
                modifyTitle: modifyTitle,
                modifyType: modifyType,
                modifyContent: modifyContent,
                updateId: updateId
            }, function (e) {
                if (e === "true") {
                    hint("新闻修改成功");
                    // 添加之后重新进行列表排列
                    $(".journ-search>#search").click();
                }
            });
            $(".modify-backdrop").hide();
            $(".modify-container").css({
                opacity: "0",
                transform: "scale(.5)"
            });
        }
    });

    // 驳回理由
    function rejectReason(id) {
        let win = $("<div class=\"reason-backdrop\">\n" +
            "        <div class=\"reason-container\">\n" +
            "            <h2><img src='images/favicon.png' width='45px' align='center'/>驳回理由</h2>\n" +
            "            <div class=\"reason-body\">\n" +
            "                <div class=\"reason-text\"><label for=\"content\">理由</label></div>\n" +
            "                <div class=\"reason-content\">\n" +
            "                    <textarea name=\"reason\" id=\"content\" rows=\"8\"></textarea>\n" +
            "                </div>\n" +
            "                <input type=\"submit\" id=\"reason-reject\" value=\"驳回\"><input type=\"button\" id=\"reason-cancel\" value=\"取消\">\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>");

        $("body").append(win);
        $(win).show();
        $(".reason-container").css({
            opacity: "1",
            transform: "scale(1)"
        });

        $("#reason-reject").on("click", function () {
            let content = $(".reason-content>#content").val();
            if (content == "") {
                hint("请输入一下驳回理由");
                return;
            }
            $.post("../operationJourn", {
                reasonContent: content,
                rejectId: id
            }, function (e) {
                if (e === "true") {
                    $.get("../operationJourn", {statusId: id, status: 2}, function (e) {
                        if (e === "true") {
                            $(".journ-search>#search").click();
                            hint("已驳回");
                            $(win).hide();
                        }
                    });
                }
            });
        });

        $("#reason-cancel").on("click", function () {
            $(win).fadeOut(200);
            $(".reason-container").css({
                opacity: "0",
                transform: "scale(0.5)"
            });
            setTimeout(() => {
                $(win).remove();
            }, 320);
        });
    }

    // 确认弹窗
    function confirmWin(callback) {
        let win = $("<div class=\"del-backdrop\">\n" +
            "        <div class=\"del-container\">\n" +
            "            <div class=\"del-top\"><span class=\"del-hint\">新闻管理</span><span class=\"del-cancel\"></span></div>\n" +
            "            <div class=\"del-show\">\n" +
            "                <label class=\"del-info\">删除需谨慎，您确定要删除吗?</label>\n" +
            "                <a href=\"javascript:;\" class=\"del-confirm\">确认</a>\n" +
            "                <a href=\"javascript:;\" class=\"del-return\">取消</a>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>");

        $("body").append(win);
        $(".del-confirm").focus();
        $(".del-confirm").on("click", function () {
            setTimeout(() => {
                $(win).remove();
                callback && callback();
            }, 250);
        });

        // 关闭窗口
        $(".del-cancel,.del-return").on("click", function () {
            $(win).fadeOut(200);
            setTimeout(() => {
                $(win).remove();
            }, 250);
        });
    }

    // 轻提示
    let timer;
    let timer2;

    function hint(text) {
        clearTimeout(timer); // 关闭上一次的计时器
        clearTimeout(timer2); // 关闭上一次的计时器
        // 将上一个弹窗删除重新快速重新生成一个
        $(".box-body").remove();
        let hint = $("<div class=\"box-body\">\n" +
            "        <p class=\"box-text\">" + text + "</p>\n" +
            "    </div>");

        $("body").append(hint);
        $(".box-body").show(); //给个显示出现弹出动画效果
        $(".box-body").css({
            opacity: "1",
            transform: "scale(1)"
        });
        // 执行计时器，规定时间关闭提示
        timer = setTimeout(() => {
            $(".box-body").css({
                opacity: "0",
                transform: "scale(0.6)"
            });
            $(".box-body").hide(130);
        }, 1700);
        // 删除节点
        timer2 = setTimeout(() => {
            $(".box-body").remove();
        }, 1900);
    }

    // 显示新闻内容的弹窗
    let style = "";
    let isMax = true;
    function contentShow(title, date, content, callback) {
        let show = $("<div class=\"content-backdrop\">\n" +
            "        <div class=\"content-container\" style='" + style + "'>\n" +
            "            <div class=\"content-title\">\n" +
            "                <div>\n" +
            "                    <h2>" + title + "</h2>\n" +
            "                    <h3>" + date + "</h3>\n" +
            "                </div>\n" +
            "                <span class=\"content-close\"></span>\n" +
            "                <span class=\"content-maximize\"></span>\n" +
            "                <span class=\"content-minimize\"></span>\n" +
            "            </div>\n" +
            "            <div class=\"content-text\"></div>\n" +
            "        </div>\n" +
            "    </div>");
        $("body").append(show);
        // 根据换行显示多个p标签
        let node = "";
        let text = content.split("\n");
        for (let i = 0; i < text.length; i++) {
            node += "<p>" + text[i] + "</p>";
        }
        $(".content-container .content-text").html(node);

        $(".content-backdrop").fadeIn(200);
        $(".content-container").css({
            transform: "scale(1)",
            opacity: "1"
        });

        $(".content-close").on("click", function () {
            $(".content-backdrop").fadeOut("fast");
            $(".content-container").css({
                transform: "scale(.5)",
                opacity: "0"
            });
            setTimeout(() => {
                callback && callback();
                $(show).remove();
            }, 320);
        });

        $(".content-maximize").on("click", function () {
            if (isMax) {
                isMax = false;
                style = "width:100vw;height:100vh;"
                $(".content-container").attr("style", "transform: scale(1); opacity: 1;" + style);
                // $(".content-container").css({
                //     width: "100vw",
                //     height: "100vh"
                // });
            } else {
                isMax = true;
                style = "width:800px;height:830px;"
                $(".content-container").attr("style", "transform: scale(1); opacity: 1;" + style);
                // $(".content-container").css({
                //     width: "800px",
                //     height: "830px"
                // });
            }
        });
    }
});