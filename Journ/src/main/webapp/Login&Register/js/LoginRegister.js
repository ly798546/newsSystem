/* 
// ==============================
// | 使用本代码请保留此头部信息
// +----------------------------+
// | Name: 登录&注册
// +----------------------------+
// | Author: LuoYing
// +----------------------------+
// | QQ: 2500548696
// +----------------------------+
// | Date: 2022年5月16日
// +----------------------------+
*/
$(function () {
    // 因浏览器缓存，进入页面就清空文本框
    $(".form div input").val("");
    // ajax判断用户是否是注册了账号，如果注册了就将注册的用户名打印到登录上
    $.post("../loginRegister/echoUsername", function (data) {
        if (data !== null && data !== "") {
            let input = $(".login input[name=username]");
            input.val(data);
            input.focus().blur();
        }
    });
    // ------------ 页面效果区 ------------
    console.log("\n%cAuthor：锣影\n ", "font-size:20px;color:skyblue;font-family:'微软雅黑';");
    //设置所有文本框的自动补全以及最大长度
    $(".form>div>input").attr({
        autocomplete: "off",
        maxlength: 20,
    });

    // 平移动画
    let flag = true;
    // 切换照片路径
    var pictureone = "images/electro.png";
    var picturetwo = "images/hydro.png";
    $(".hint").on("click", function () {
        // 将眼睛变成闭眼,改回原来的密码框
        $(".eye").hide().children("img").attr("src", "images/ceye.png");
        $(".eye").siblings("input[type=text]").attr("type", "password");
        respCount = 0;
        if (flag) {
            flag = false;
            $(".box-body").remove(); //删除轻提示弹窗
            $(".register").show().css("opacity", 1);
            $(".login").hide().css("opacity", 0);
            $(".picture").css("transform", "translateX(170%)");
            $(".container").css("box-shadow", "0 0 15px 3px rgba(1, 66, 163, 0.3)");
            $(".slide").css({
                transform: "translateX(-83%)",
                backgroundImage: "linear-gradient(to top, #1296db 0%, #75cbf9 100%)"
            });
            $(this).css({
                transform: "translateX(230%)",
                backgroundColor: "#4cb5ec",
            }).text("已有账号？去登录");
            setTimeout(() => {
                // 切换将所有文本变成空,切换图片
                $(".login>div>input").val("").blur();
                $(".picture>img").prop("src", picturetwo);
            }, 150);
        } else {
            flag = true;
            $(".box-body").remove();
            $(".register").hide().css("opacity", 0);
            $(".login").show().css("opacity", 1);
            $(".picture").css("transform", "translateX(0)");
            $(".container").css("box-shadow", "0 0 15px 3px rgba(55, 1, 163, 0.3)");
            $(".slide").css({
                transform: "translateX(0)",
                backgroundImage: "linear-gradient(to top, #b123ee 0%, #e09cfe 100%)"
            });
            $(this).css({
                transform: "translateX(0)",
                backgroundColor: "#cc68f7"
            }).text("没有账号？去注册");
            setTimeout(() => {
                $(".register>div>input").val("").blur();
                $(".picture>img").prop("src", pictureone);
            }, 150);
        }
    });

    // 点击图片快速清空文本内容
    $(".picture").on("click", function () {
        $(".form div>input").val("").blur();
        $(".eye").hide();
    });

    // 文本框获取焦点就让label标签网上移,失去焦点则判断是否有值下移
    $(".form div>input").on({
        focus: function () {
            $(this).css("border-bottom", "1px solid yellow").siblings("label").css({
                "transform": "translateY(-20px)",
                fontSize: "14px",
                color: "yellow"
            });
        },
        blur: function () {
            $(this).css("border-bottom", "1px solid #fff");
            $(this).siblings("label").css("color", "#fff")
            if ($(this).val().trim() == "") {
                $(this).val(""); //防止输入空格，清空文本
                $(this).siblings("label").css({
                    "transform": "translateY(0)",
                    fontSize: "18px",
                });
            }
        }
    });

    // 密码框的眼睛
    $(".eye").on("click", function () {
        var input = $(this).siblings("input");
        // 判断每次点击的对应密码框类型是否为password
        if (input.attr("type") === "password") {
            input.attr("type", "text").focus();
            $(this).children("img").attr("src", "images/eye.png");
        } else {
            $(this).siblings("input[type=text]").attr("type", "password").focus();
            $(this).children("img").attr("src", "images/ceye.png");
        }
    });

    // 判断密码框输入是否有值，有就显示眼睛，否则不显示
    $(".form input[type=password]").on("keyup", function () {
        if ($(this).val().trim() != "") {
            $(this).siblings(".eye").show();
        } else {
            $(this).siblings(".eye").hide();
        }
    });

    // 点击label标签使自己下方的input回去焦点
    $(".form div label").on("click", function () {
        $(this).siblings("input").focus()
    });


    // ------------ 表单提交判断区 -------------

    $(window).on("keyup", function (e) {
        if (e.which === 9) {
            $("input[type=hidden]").focus();
        }
    });

    // 轻提示弹窗
    var timer;
    var timer2;

    // 轻提示
    function lightHint(text) {
        clearTimeout(timer); // 关闭上一次的计时器
        clearTimeout(timer2); // 关闭上一次的计时器
        // 将上一个弹窗删除重新快速重新生成一个
        $(".box-body").remove();
        var hint = $("<div class='box-body'><p class='box-text'></p></div>");
        $("body").append(hint);
        $(".box-body").show(); //给个显示出现弹出动画效果
        $(".box-text").text(text)
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
        }, 1500);
        // 删除节点
        timer2 = setTimeout(() => {
            $(".box-body").remove();
        }, 1700);
    }

    // 提示登录是否成功弹窗
    function hintWin(title, text, callback) {
        // 创建弹窗需要的元素
        var divcon = $("<div class='lr-container'></div>");
        var divbody = $("<div class='lr-body'></div>");
        var h1status = $("<h1 class='lr-status'></h1>");
        var pdescr = $("<p class='lr-description'></p>");
        var divbtn = $("<div class='lr-btn'><button>我知道了</button></div>");
        // 将元素放到界面上去
        $("body").append(divcon);
        $(divcon).append(divbody);
        $(divbody).append(h1status);
        $(divbody).append(pdescr);
        $(divbody).append(divbtn);
        $(h1status).text(title);
        $(pdescr).text(text);

        $(divbody).show();
        $(divbody).css({
            transform: "scale(1)",
            opacity: "1"
        });
        $(".lr-btn>button").focus();

        $(".lr-btn button").on("click", function () {
            $(divcon).fadeOut(150);
            $(divbody).css({
                transform: "scale(0.6)",
                opacity: "1"
            });
            // 当现实弹窗点击我知道了将按钮打开
            $(".form input[type=submit]").prop("disabled", false);
            timer = setTimeout(() => {
                $(divcon).remove();
                callback && callback();
            }, 400);
        });

        $(window).on("keydown", function (e) {
            // 按下回车
            if (e.which === 13) {
                $(".lr-btn button").click();
            }
            // 按下esc
            if (e.which === 27) {
                $(".lr-btn button").click();
            }
        });

        // 是否等待
        if (mayFlag) {
            divbody.css("height", "180px");
            pdescr.remove();
            h1status.css({
                padding: "0",
                fontSize: "18px"
            });
            divbtn.children("button").css("backgroundColor", "#909399");
        }
    }

    // 创建加载
    function creatLoading(speed, callback) {
        // 加载时将提交按钮禁用，避免在加载期间疯狂点击回车键
        $(".form input[type=submit]").prop("disabled", true);
        // 加载所需要的元素
        let load = $("<div class=\"layui-layer-loading\" style=\"z-index: 20;\">\n" +
            "        <div class=\"layui-layer-loading5\">\n" +
            "            <div class=\"outer\"></div>\n" +
            "            <div class=\"inner\"></div>\n" +
            "        </div>\n" +
            "    </div>");
        $("body").append(load);

        if (speed) {
            setTimeout(function () {
                $(load).remove();
                // 有回调函数就执行
                callback && callback();
            }, speed);
        }
    }

    // 检查提交表单规范发出提示语
    function check(name, hint) {
        name.focus();
        lightHint(hint);
    }

    // Ajax创建
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // ajax请求服务器封装
    function ajax(method, url, callback, datas) {
        xhttp.open(method, url);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        let data = null;
        if (datas !== undefined) data = datas;
        xhttp.send(data);
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                callback && callback();
            }
        };
    }

    // 是否等待
    let mayFlag = false;
    // 响应次数
    let respCount = 0;
    let waitTime = false;

    /**
     * 等待
     */
    function wait() {
        if (mayFlag) {
            hintWin("系统正忙，请稍后几秒再尝试");
        }
        // 计时器限制，避免计时器累加
        if (!waitTime) {
            waitTime = true;
            // 两秒后可继续执行操作
            setTimeout(() => {
                mayFlag = false;
                respCount = 0;
                waitTime = false;
            }, 3500);
        }
    }

    /**
     * 等待窗口显示
     */
    function waitWin() {
        if (respCount >= 5) {
            mayFlag = true;
            creatLoading((loadTimer = parseInt(Math.random() * 1500)), function () {
                wait();
            });
            return true;
        }
    }

    // 循环执行
    setInterval(() => {
        respCount = 0;
    }, 20000);

    // 登录校验
    var login = false;
    $(".login").on("submit", function () {
        loginCheck();
        return login;
    });

    // 访问次数限制，避免疯狂访问数据库
    let count = 0;
    let loadTimer;

    function loginCheck() {
        if (waitWin()) {
            return;
        }
        var username = $(".login input[name=username]");
        var password = $(".login input[name=password]");
        if (username.val().trim() == "") {
            check(username, "请输入用户名");
        } else if (password.val().trim() == "") {
            check(password, "请输入密码");
        } else {
            if (count < 1) {
                let data = "username=" + username.val() + "&userpwd=" + password.val();
                ajax("post", "../loginRegister/login", function () {
                    let flag = xhttp.responseText;
                    if (flag !== "") {
                        count++;
                        login = true;
                        // 创建加载设置随机加载时间，并且执行回调函数的提交
                        creatLoading((loadTimer = parseInt(Math.random() * 1500)), function () {
                            // 登录成功就跳转到后端传过来的路径地址
                            window.location.href = flag;
                            // $(".login").submit();
                        });
                    } else {
                        respCount++;
                        creatLoading((loadTimer = parseInt(Math.random() * 1500)), function () {
                            hintWin("登录失败", "用户名或密码不正确，请检查输入的用户名和密码");
                        });
                    }
                }, data);
            }
        }
    }

    function captchaCheck(callback) {
        let captcha = '<div class="ca-backdrop">\n' +
            '        <div class="ca-container">\n' +
            '            <h3 class="ca-title">验证码已发入邮箱</h2>\n' +
            '                <div class="ca-body">\n' +
            '                    <label for="captcha"><span class="ca-p" style="user-select: none;">验证码：</span></label><input maxlength="10" name="captcha" id="captcha" placeholder="请输入验证码">\n' +
            '                    <span id="ca-time">--</span>\n' +
            '                </div>\n' +
            '                <div class="ca-btn">\n' +
            '                    <button id="ca-sub">确认</button><button id="ca-cancel">取消</button>\n' +
            '                </div>\n' +
            '        </div>\n' +
            '    </div>';
        $('body').append(captcha);

        // 倒计时
        if (!captchaTime) {
            let sp1 = $('#ca-time');
            let caImg = $('.captcha').html();
            let time = 30;
            sp1.text(time);
            sp1.show();
            $('.captcha').html(time);
            captchaTime = true;
            caTimer = setInterval(() => {
                let sp2 = $('#ca-time');
                let ca = $('.captcha');
                time--;
                sp2.text(time);
                ca.html(time);
                if (time === 0) {
                    clearInterval(caTimer);
                    captchaTime = false;
                    sp2.hide();
                    ca.html(caImg);
                    reqEmail = '';
                }
            }, 1000);
        }

        $('.ca-container').show().css({
            opacity: 1,
            transform: 'scale(1)'
        });

        $('#captcha').on({
            focus: function () {
                $('.ca-body').css("borderBottomColor", "#57a6db");
            },
            blur: function () {
                $('.ca-body').css("borderBottomColor", "#ccc");
            },
        });

        // 提交
        $('.ca-btn>#ca-sub').on('click', function () {
            if ($('#captcha').val().trim() !== '') {
                callback && callback();
            } else {
                lightHint('请输入验证码');
            }
        });

        // 取消
        $('.ca-btn>#ca-cancel').on('click', function () {
            $('.ca-backdrop').fadeOut(200);
            $('.ca-container').css({
                opacity: 0,
                transform: 'scale(.6)'
            });
            setTimeout(() => {
                $('.ca-backdrop').remove();
            }, 320);
        });
    }

    // 获取输入的验证码
    let captcha;
    // 获取输入的邮箱
    let reqEmail = '';
    function captchaWin(text) {
        let email = $('#sendEmail').val().trim();
        if (reqEmail === '') {
            reqEmail = email;
        }
        if (email !== reqEmail) {
            lightHint('请在' + $('.captcha').text() + '秒后再更换其他邮箱');
            return;
        }
        if (/^\w+@qq.com$/.test(email)) {
            // 请求时的加载
            creatLoading();
            $.post('../loginRegister/sendCaptcha', {email, captchaTime}, function (e) {
                // 加载完成后删除加载
                $(".form input[type=submit]").prop("disabled", false);
                $('.layui-layer-loading').remove();
                text && lightHint(text);
                if (e === 'success') {
                    captchaCheck(function () {
                        captcha = $('#captcha').val().trim();
                        $('.ca-btn>#ca-cancel').click();
                    });
                    $('#captcha').val(captcha);
                } else {
                    lightHint('验证码发送失败，请联系开发人员');
                }
            });
        } else {
            lightHint('请输入邮箱');
        }
    }

    $('.register .captcha').on('click', function () {
        captchaWin();
    });

    // 注册校验
    let register = false;
    $(".register").on("submit", function () {
        registerCheck();
        return register;
    });

    // 验证码时间是否结束
    let captchaTime = false;
    // 验证码时间计时器
    let caTimer;

    function registerCheck() {
        if (waitWin()) {
            return;
        }
        let name = $(".register input[name=name]");
        let email = $(".register input[name=email]");
        let pwd = $(".register input[name=pwd]");
        let rpwd = $(".register input[name=rpwd]");
        if (name.val().trim() === "") {
            check(name, "请输入用户名");
        } else if (!(/^\w{4,16}$/.test(name.val().trim()))) {
            check(name, "用户名只能输入数字或字符且长度4~16");
        } else if (!(/^\w+@qq.com$/.test(email.val().trim()))) {
            check(email, "邮箱格式不正确，目前只支持QQ邮箱");
        } else if (!(/^\w{6,16}$/.test(pwd.val().trim()))) {
            check(pwd, "密码要6~16位字符,不能含有中文与特殊符号");
        } else if (rpwd.val() !== pwd.val()) {
            check(rpwd, "两次密码输入不一致");
        } else {
            if (count < 1) {
                let data = {username: name.val(), email: email.val(), password: pwd.val()};
                $.post('../loginRegister/checkField', data, function (e) {
                    if (e === "true") {
                        $.post('../loginRegister/checkCaptcha', {captcha}, function (e) {
                            if (e === 'success') {
                                $.post('../loginRegister/register', data, function (e) {
                                    if (e > '0') {
                                        count++;
                                        register = true;
                                        $('.ca-btn>#ca-cancel').click();
                                        creatLoading((loadTimer = parseInt(Math.random() * 1500)), function () {
                                            hintWin("注册成功", "账号注册成功，即将进入登录页面", function () {
                                                $(".register").submit();
                                            });
                                        });
                                    }
                                });
                            } else {
                                captchaWin('验证码输入错误');
                            }
                        });
                    } else {
                        respCount++;
                        creatLoading((loadTimer = parseInt(Math.random() * 1500)), function () {
                            hintWin("注册失败", "用户名或邮箱已被注册，请检查输入的用户名和邮箱");
                        });
                    }
                });
            }
        }
    }
});