import com.alibaba.fastjson.JSON;
import com.yxbiancheng.pojo.Journ;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * @author yx
 * @date 2022/5/21 下午 01:07
 */
public class Demo {
    public static void main(String[] args) {
        LocalDateTime l = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss");
        String time = formatter.format(l);
        Journ j = new Journ();
        j.setDate(time);
        j.setTitle("奥利给");
        j.setContent("爱打架爱丽丝的骄傲我的骄傲里盛开的");
        j.setStatus("1");
        j.setVisited(0);
        String s = JSON.toJSONString(j);
        System.out.println(s);

        Journ ss = JSON.parseObject(s, Journ.class);
        System.out.println(ss);
    }
}
