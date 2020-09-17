<?php

// +----------------------------------------------------------------------
// | Apprh.Shop
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2027 http://www.apprh.com All rights reserved.
// +----------------------------------------------------------------------
// | Notice: This code is not open source, it is strictly prohibited
// |         to distribute the copy, otherwise it will pursue its
// |         legal responsibility.
// +----------------------------------------------------------------------
// | Author: 雲溪荏苒 <290648237@qq.com>
// +----------------------------------------------------------------------

use \think\Db;

//会员登录注册发送短信间隔（单位为秒）
define('DEFAULT_CONNECT_SMS_TIME', 60);
//会员登录注册时每个手机号发送短信个数
define('DEFAULT_CONNECT_SMS_PHONE', 5);
//会员登录注册时每个IP发送短信个数
define('DEFAULT_CONNECT_SMS_IP', 20);

if (!function_exists('get_banner')) {
    /**
     * 调取轮播Item返回数组
     * @param int $banner_id 轮播位置ID
     * @param int $limit 限制轮播Item条数
     * @param string $sort 排序规则
     * @return array|false|PDOStatement|string|\think\Collection|\think\Model
     * @author andy <290648237@qq.com>
     */
    function get_banner($banner_id = 0, $limit = 1, $sort = 'rand()'){

        $map['banner_item.status'] = 1;
        if($banner_id) {
            $map['banner_item.banner_id'] = $banner_id;
        }

        $db = Db::view('banner_item', '*')
            ->view('banner', 'name, status', 'banner.id = banner_item.banner_id', 'RIGHT')
            ->where($map)
            ->order($sort);

        if($limit > 1) {
            $ad = $db->limit($limit)->select();
        }else {
            $ad = $db->find();
        }

        return $ad;
    }
}

if (!function_exists('get_ad')) {
    /**
     * 调取广告返回数组
     * @param int $position_id 广告位id
     * @param int $limit 限制广告条数
     * @param string $sort 排序规则
     * @return array|false|PDOStatement|string|\think\Collection|\think\Model
     * @author andy <290648237@qq.com>
     */
    function get_ad($position_id = 0, $limit = 1, $sort = 'rand()'){


        $map = [
            'ad.status' => 1,
            'ad.end_time' => ['gt', date('Y-m-d', time())]
        ];
        if($position_id) {
            $map['ad.position_id'] = $position_id;
        }

        $db = Db::view('ad', 'id, name, url, path, start_time, end_time, status, sort')
            ->view('ad_position', 'position, width, height, status', 'ad_position.id=ad.position_id', 'RIGHT')
            ->where($map)
            ->order($sort);

        if($limit > 1) {
            $ad = $db->limit($limit)->select();
            if($ad) {
                foreach ($ad as $item) {
                    if (!is_file('.'.$item['path'])) {
                        $item['path'] = quick_pic_thumb($item['path'], '@'.$item['width'].'w_'.$item['height'].'h');
                    }
                }
            }
        }

        $ad = $db->find();
        if($ad && !is_file('.'.$ad['path'])) {
            $ad['path'] = quick_pic_thumb($ad['path'], '@'.$ad['width'].'w_'.$ad['height'].'h');
        }

        return $ad;
    }
}


if (!function_exists('get_ad_html')) {
    /**
     * 调取广告返回HTML
     * @param int $position_id 广告位id
     * @param int $limit 限制广告条数
     * @return null|string
     * @author andy <290648237@qq.com>
     */
    function get_ad_html($position_id,$limit = 1){
        $ad = get_ad($position_id,$limit);

        if($ad != NULL){
            return '<a href="'.$ad['url'].'" target="_blank" rel="nofollow"><img src="'.$ad['path'].'" width="100%" height="auto" /></a>';
//            return '<a href="'.$ad['url'].'" target="_blank" rel="nofollow"><img src="'.$ad['path'].'" width="'.$ad['width'].'" height="'.$ad['height'].'" /></a>';
        }else{
            return NULL;
        }
    }
}

if (!function_exists('get_level_data')) {
    /**
     * 获取联动数据
     * @param string $table 表名
     * @param  integer $pid 父级ID
     * @param  string $pid_field 父级ID的字段名
     * @return false|PDOStatement|string|\think\Collection
     * @author andy <290648237@qq.com>
     */
    function get_level_data($table = '', $pid = 0, $pid_field = 'pid')
    {

        if ($table == '') {
            return '';
        }

        $data_list = Db::name($table)->where($pid_field, $pid)->select();

        if ($data_list) {
            return $data_list;
        } else {
            return '';
        }
    }
}

if (!function_exists('get_level_pid')) {
    /**
     * 获取联动等级和父级id
     * @param string $table 表名
     * @param int $id 主键值
     * @param string $id_field 主键名
     * @param string $pid_field pid字段名
     * @return mixed
     * @author andy <290648237@qq.com>
     */
    function get_level_pid($table = '', $id = 1, $id_field = 'id', $pid_field = 'pid')
    {
        return Db::name($table)->where($id_field, $id)->value($pid_field);
    }
}

if (!function_exists('get_level_key_data')) {
    /**
     * 反向获取联动数据
     * @param string $table 表名
     * @param string $id 主键值
     * @param string $id_field 主键名
     * @param string $name_field name字段名
     * @param string $pid_field pid字段名
     * @param int $level 级别
     * @return array
     * @author andy <290648237@qq.com>
     */
    function get_level_key_data($table = '', $id = '', $id_field = 'id', $name_field = 'name', $pid_field = 'pid', $level = 1)
    {
        $result = [];
        $level_pid = get_level_pid($table, $id, $id_field, $pid_field);
        $level_key[$level] = $level_pid;
        $level_data[$level] = get_level_data($table, $level_pid, $pid_field);

        if ($level_pid != 0) {
            $data = get_level_key_data($table, $level_pid, $id_field, $name_field, $pid_field, $level + 1);
            $level_key = $level_key + $data['key'];
            $level_data = $level_data + $data['data'];
        }
        $result['key'] = $level_key;
        $result['data'] = $level_data;

        return $result;
    }
}


/**
 * 获取网站的根Url
 * @return string
 */
function get_root_url() {
    $request = request();
    $base = $request->root();
    $root = strpos($base, '.') ? ltrim(dirname($base), DS) : $base;
    if ('' != $root) {
        $root = '/' . ltrim($root, '/');
    }

    return ($request->isSsl() ? 'https' : 'http') . '://' . $request->host() . "{$root}";
}

/**
 * 获取带有域名的完整路径
 * @param $path
 * @return string
 */
function get_url_with_domain($path) {

    $isContainsDomain = url_contains_domain($path);
    $isContainsIp = url_contains_ip($path);
    if ($path == '' || $isContainsDomain || $isContainsIp) {
        // 包含域名
        return $path;
    }else {
        // 不包含域名 加上域名
        return get_root_url().$path;
    }
}

/**
 * 判断url是否包含域名
 * @param $url
 * @return mixed
 */
function url_contains_domain($url) {
    preg_match("/^(http:\/\/)?([^\/]+)/i", $url, $result);

    return $result;
}

/**
 * 判断url是否包含ip地址或ip+端口
 * @param $url
 * @return bool|int
 */
function url_contains_ip($url) {
    preg_match("/^(http:\/\/)?([^\/]+)/i", $url, $result);
    if(isset($result[2])) {
        $match = preg_match("/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|[0-9]{1,3}$/", $result[2]);
        return $match;
    }else {
        return false;
    }


}


/**
 * 判断是否是手机
 * @return bool
 */
function is_mobile() {
    // 如果有HTTP_X_WAP_PROFILE则一定是移动设备
    if (isset($_SERVER['HTTP_X_WAP_PROFILE']))
        return true;
    //此条摘自TPM智能切换模板引擎，适合TPM开发
    if (isset($_SERVER['HTTP_CLIENT']) && 'PhoneClient' == $_SERVER['HTTP_CLIENT'])
        return true;
    //如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息
    if (isset($_SERVER['HTTP_VIA']))
        //找不到为flase,否则为true
        return stristr($_SERVER['HTTP_VIA'], 'wap') ? true : false;
    //判断手机发送的客户端标志,兼容性有待提高
    if (isset($_SERVER['HTTP_USER_AGENT'])) {
        $clientkeywords = array(
            'nokia', 'sony', 'ericsson', 'mot', 'samsung', 'htc', 'sgh', 'lg', 'sharp', 'sie-', 'philips', 'panasonic', 'alcatel', 'lenovo', 'iphone', 'ipod', 'blackberry', 'meizu', 'android', 'netfront', 'symbian', 'ucweb', 'windowsce', 'palm', 'operamini', 'operamobi', 'openwave', 'nexusone', 'cldc', 'midp', 'wap', 'mobile'
        );
        //从HTTP_USER_AGENT中查找手机浏览器的关键字
        if (preg_match("/(" . implode('|', $clientkeywords) . ")/i", strtolower($_SERVER['HTTP_USER_AGENT']))) {
            return true;
        }
    }
    //协议法，因为有可能不准确，放到最后判断
    if (isset($_SERVER['HTTP_ACCEPT'])) {
        // 如果只支持wml并且不支持html那一定是移动设备
        // 如果支持wml和html但是wml在html之前则是移动设备
        if ((strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') !== false) && (strpos($_SERVER['HTTP_ACCEPT'], 'text/html') === false || (strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'], 'text/html')))) {
            return true;
        }
    }
    return false;
}

/**
 * 检测用户是否登录
 * @return integer 0-未登录，大于0-当前登录用户ID
 */
function is_login()
{
    $isLogin = session('is_login') ? session('is_login') : cookie('is_login');
    if ($isLogin != 1) {
        return false;
    } else {
        return true;
    }
}

/**
 * 数据签名认证
 * @param  array $data 被认证的数据
 * @return string       签名
 */
function data_auth_sign($data)
{
    //数据类型检测
    if (!is_array($data)) {
        $data = (array)$data;
    }
    $data = array_filter($data);
    ksort($data); //排序

    $code = serialize($data); //url编码并生成query字符串
    $sign = sha1($code); //生成签名

    return $sign;
}


/**
 * 系统非常规MD5加密方法
 * @param  string $str 要加密的字符串
 * @return string
 */
function think_ucenter_md5($str, $key = 'think_center')
{
    return '' === $str ? '' : md5(sha1($str) . $key);
}

/**
 * 正则表达式验证email格式
 *
 * @param string $str 所要验证的邮箱地址
 * @return boolean
 */
function check_is_email($str)
{
    if (!$str) {
        return false;
    }
    return preg_match('#[a-z0-9&\-_.]+@[\w\-_]+([\w\-.]+)?\.[\w\-]+#is', $str) ? true : false;
}

/**
 * 用正则表达式验证手机号码(中国大陆区)
 * @param integer $num 所要验证的手机号
 * @return boolean
 */
function check_is_mobile($num)
{
    if (!$num) {
        return false;
    }
    return preg_match('#^13[\d]{9}$|14^[0-9]\d{8}|^15[0-9]\d{8}$|^18[0-9]\d{8}$#', $num) ? true : false;
}

/**
 * 获取当前页面完整URL地址
 */
function get_url() {
    $sys_protocal = isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == '443' ? 'https://' : 'http://';
    $php_self = $_SERVER['PHP_SELF'] ? $_SERVER['PHP_SELF'] : $_SERVER['SCRIPT_NAME'];
    $path_info = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
    $relate_url = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : $php_self.(isset($_SERVER['QUERY_STRING']) ? '?'.$_SERVER['QUERY_STRING'] : $path_info);
    return $sys_protocal.(isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '').$relate_url;
}

if (!function_exists('get_client_ip')) {
    /**
     * 获取客户端IP地址
     * @param int $type 返回类型 0 返回IP地址 1 返回IPV4地址数字
     * @param bool $adv 是否进行高级模式获取（有可能被伪装）
     * @return mixed
     */
    function get_client_ip($type = 0, $adv = false) {
        $type       =  $type ? 1 : 0;
        static $ip  =   NULL;
        if ($ip !== NULL) return $ip[$type];
        if($adv){
            if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $arr    =   explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
                $pos    =   array_search('unknown',$arr);
                if(false !== $pos) unset($arr[$pos]);
                $ip     =   trim($arr[0]);
            }elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
                $ip     =   $_SERVER['HTTP_CLIENT_IP'];
            }elseif (isset($_SERVER['REMOTE_ADDR'])) {
                $ip     =   $_SERVER['REMOTE_ADDR'];
            }
        }elseif (isset($_SERVER['REMOTE_ADDR'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        // IP地址合法验证
        $long = sprintf("%u",ip2long($ip));
        $ip   = $long ? array($ip, $long) : array('0.0.0.0', 0);
        return $ip[$type];
    }
}

if (!function_exists('send_mail')) {
    /**
     * 系统邮件发送函数
     * @param string $tomail 接收邮件者邮箱
     * @param string $name 接收邮件者名称
     * @param string $subject 邮件主题
     * @param string $body 邮件内容
     * @param string $attachment 附件列表
     * @return boolean
     * @author andy <290648237@qq.com>
     */
    function send_mail($tomail, $name, $subject = '', $body = '', $attachment = null) {
        $mail = new \PHPMailer();           //实例化PHPMailer对象

        $mail->CharSet = 'UTF-8';           //设定邮件编码，默认ISO-8859-1，如果发中文此项必须设置，否则乱码
        $mail->IsSMTP();                    // 设定使用SMTP服务
        $mail->SMTPDebug = 0;               // SMTP调试功能 0=关闭 1 = 错误和消息 2 = 消息
        $mail->SMTPAuth = true;             // 启用 SMTP 验证功能
        $mail->SMTPSecure = 'ssl';          // 使用安全协议
        $mail->Host = sysconf('smtp_host'); // SMTP 服务器
        $mail->Port = sysconf('smtp_port');                  // SMTP服务器的端口号
        $mail->Username = sysconf('smtp_username');    // SMTP服务器用户名
        $mail->Password = sysconf('smtp_password');     // SMTP服务器密码
        $mail->SetFrom(sysconf('smtp_username'), sysconf('smtp_sender_name'));
        $replyEmail = '';                   //留空则为发件人EMAIL
        $replyName = '';                    //回复名称（留空则为发件人名称）
        $mail->AddReplyTo($replyEmail, $replyName);
        $mail->Subject = $subject;
        $mail->MsgHTML($body);
        $mail->AddAddress($tomail, $name);

        if (is_array($attachment)) { // 添加附件
            foreach ($attachment as $file) {
                is_file($file) && $mail->AddAttachment($file);
            }
        }
        return $mail->Send() ? true : $mail->ErrorInfo;
    }
}

/**
 * 规范数据返回格式
 * @param bool $code
 * @param string $message
 * @param array $data
 * @return array
 */
function result($code = 0, $message = '', $data = array()) {
    return array('code' => $code, 'data' => $data, 'message' => $message);
}

/**
 * 判断表单是否post请求
 * @return bool
 */
function check_is_post(){
    if (request()->isPost()){
        return true;
    }else {
        return false;
    }
}


if (!function_exists('format_bytes')) {
    /**
     * 格式化字节大小
     * @param  number $size      字节数
     * @param  string $delimiter 数字和单位分隔符
     * @return string            格式化后的带单位的大小
     * @author andy <290648237@qq.com>
     */
    function format_bytes($size, $delimiter = '') {
        $units = array('B', 'KB', 'MB', 'GB', 'TB', 'PB');
        for ($i = 0; $size >= 1024 && $i < 5; $i++) $size /= 1024;
        return round($size, 2) . $delimiter . $units[$i];
    }
}


if (!function_exists('msubstr')) {
    /**
     * 截取中文字符串
     * 模板调用 {$str|msubstr=0,46}
     * @param $str
     * @param int $start
     * @param int $length
     * @param bool $suffix
     * @param string $charset
     * @return string
     * @author andy <290648237@qq.com>
     */
    function msubstr($str, $start=0, $length, $suffix=true, $charset="utf-8"){
//        $str = str_replace('&nbsp;', '', $str); // 过滤html标签及特殊字符
        $str = str_replace(array("&nbsp;","&amp;nbsp;","\t","\r\n","\r","\n"),array("","","","","",""), $str);
        if(mb_strlen($str,$charset)>$length)
        {
            if(function_exists("mb_substr")){
                if($suffix)
                    return mb_substr($str, $start, $length, $charset)."...";
                else
                    return mb_substr($str, $start, $length, $charset);
            }elseif(function_exists('iconv_substr')) {
                if($suffix)
                    return iconv_substr($str,$start,$length,$charset)."...";
                else
                    return iconv_substr($str,$start,$length,$charset);
            }
            $re['utf-8'] = "/[x01-x7f]|[xc2-xdf][x80-xbf]|[xe0-xef][x80-xbf]{2}|[xf0-xff][x80-xbf]{3}/";
            $re['gb2312'] = "/[x01-x7f]|[xb0-xf7][xa0-xfe]/";
            $re['gbk'] = "/[x01-x7f]|[x81-xfe][x40-xfe]/";
            $re['big5'] = "/[x01-x7f]|[x81-xfe]([x40-x7e]|xa1-xfe])/";
            preg_match_all($re[$charset], $str, $match);
            $slice = join("",array_slice($match[0], $start, $length));
            if($suffix) return $slice."…";
            return $slice;
        }
        else
        {
            return $str;
        }
    }
}

/**
 * 商家后台公共分页类
 *
 * @param int $total 数据总条数
 * @return string
 */
function pagination($total) {

    $curPage = I('page[cur_page]', 1);
    $pageSize = I('page[page_size]', 10);
    $pageTotal = ceil($total / $pageSize);
    $pageArr = [
        'page_key' => 'page',
        'page_id' => 'pagination',
        'default_page_size' => $pageSize,
        'cur_page' => $curPage,
        'page_size_list' => [10,50,500,1000],
        'record_count' => $total,
        'page_count' => $pageTotal,
        'offset' => 0,
        'url' => null,
        'sql' => null
    ];
    //分页
    $num = 7; //需要显示的最多页数
    $num = min($pageTotal, $num); //处理显示的页码数大于总页数的情况
    $end = $curPage + floor($num/2) <= $pageTotal ? $curPage + floor($num/2) : $pageTotal; //计算结束页号
    $start = $end - $num + 1; //计算开始页号
    if($start < 1) { //处理开始页号小于1的情况
        $end -= $start - 1;
        $start = 1;
    }

    $html = '<div id="pagination">';
    $html .= '<script data-page-json="true" type="text">';
    $html .= json_encode($pageArr);
    $html .= '</script>';
    $html .= '<div class="pagination-info">';
    $html .= '共'.$pageArr['record_count'].'条记录，每页显示：';
    $html .= '<select class="select m-r-5" data-page-size="10">';
    foreach ($pageArr['page_size_list'] as $size){
        $selected = ($pageSize == $size) ? 'selected="selected"' : '';
        $html .= '<option value="'.$size.'" '.$selected.'>'.$size.'</option>';
    }
    $html .= '</select>';
    $html .= '条';
    $html .= '</div>';


    $html .= '<ul class="pagination">';
    if($curPage > 1) {
        $html .= '<li style="display: none;">
                    <a class="fa fa-angle-double-left" data-go-page="1" title="第一页"></a>
                </li>
                <li>
                    <a class="fa fa-angle-left" data-go-page="'.($curPage - 1).'" title="上一页"></a>
                </li>';
    }else {
        $html .= '<li class="disabled" style="display: none;">
                    <a class="fa fa-angle-double-left" title="第一页"></a>
                </li>
                <li class="disabled">
                    <a class="fa fa-angle-left" title="上一页"></a>
                </li>';
    }

    for($i = $start; $i <= $end; $i++){
        if($i == $curPage){
            $html .= '<li class="active">
                        <a data-cur-page="'.$i.'">'.$i.'</a>
                    </li>';
        }else{
            $html .= '<li>
                        <a href="javascript:void(0);" data-go-page="'.$i.'">'.$i.'</a>
                    </li>';
        }
    }

    if($curPage < $pageTotal) {
        $html .= '<li>
                    <a class="fa fa-angle-right" data-go-page="'.($curPage + 1).'" title="下一页"></a>
                </li>

                <li class="" style="display: none;">
                    <a class="fa fa-angle-double-right" data-go-page="'.$pageTotal.'" title="最后一页"></a>
                </li>';
    }else {
        $html .= '<li class="disabled">
                    <a class="fa fa-angle-right" title="下一页"></a>
                </li>

                <li class="" style="display: none;">
                    <a class="fa fa-angle-double-right" title="最后一页"></a>
                </li>';
    }
    $html .= '</ul>';

    $html .= '<div class="pagination-goto">
                <input class="ipt form-control goto-input" type="text">
                <button class="btn btn-default goto-button" title="点击跳转到指定页面">GO</button>
                <a class="goto-link" data-go-page="'.I('get.page[cur_page]').'" style="display: none;"></a>
            </div>';

    $html .= '</div>';
    $html .= '<script type="text/javascript">
                $().ready(function () {
                    $(".pagination-goto > .goto-input").keyup(function (e) {
                        $(".pagination-goto > .goto-link").attr("data-go-page", $(this).val());
                        if (e.keyCode == 13) {
                            $(".pagination-goto > .goto-link").click();
                        }
                    });
                    $(".pagination-goto > .goto-button").click(function () {
                        var page = $(".pagination-goto > .goto-link").attr("data-go-page");
                        if ($.trim(page) == \'\') {
                            return false;
                        }
                        $(".pagination-goto > .goto-link").attr("data-go-page", page);
                        $(".pagination-goto > .goto-link").click();
                        return false;
                    });
                });
            </script>';
    $html .= '</div>';

    return $html;
}

/**
 * 前端分页方法封装
 *
 * @param $total
 * @return string
 */
function frontend_pagination($total, $extraPageArr = []) {

    $pageArr = request()->param();
    $curPage = !empty($pageArr['page']['cur_page']) ? $pageArr['page']['cur_page'] : 1;
    $pageSize = !empty($pageArr['page']['page_size']) ? $pageArr['page']['page_size'] : 10;

    $pageTotal = ceil($total / $pageSize);
    $offset = $curPage*$pageSize;

    $pageArr = [
        'page_key' => 'page',
        'page_id' => 'pagination',
        'default_page_size' => 15,
        'cur_page' => $curPage,
        'page_size' => $pageSize,
        'page_size_list' => [1,10,20,50],
        'record_count' => $total,
        'page_count' => $pageTotal,
        'offset' => $offset,
        'url' => null,
        'sql' => null
    ];
    if (!empty($extraPageArr)) {
        $pageArr = array_merge($pageArr, $extraPageArr);
    }

    //分页
    $num = 7; //需要显示的最多页数
    $num = min($pageTotal, $num); //处理显示的页码数大于总页数的情况
    $end = $curPage + floor($num/2) <= $pageTotal ? $curPage + floor($num/2) : $pageTotal; //计算结束页号
    $start = $end - $num + 1; //计算开始页号
    if($start < 1) { //处理开始页号小于1的情况
        $end -= $start - 1;
        $start = 1;
    }

    $html = '<div id="pagination" class="page">';
        $html .= '<script data-page-json="true" type="text">';
        $html .= json_encode($pageArr);
        $html .= '</script>';
        $html .= '<div class="page-wrap fr">';
            $html .= '<div class="total">';
            $html .= '共'.$pageArr['record_count'].'条记录';
            $html .='</div>';
        $html .= '</div>';


        $html .= '<div class="page-num fr">';
        if($curPage > 1) {
            $html .='<span class="num prev disabled" style="display: none;">
                        <a class="fa fa-angle-double-left" data-go-page="1" title="第一页"></a>
                    </span>
                    <span>
                        <a class="num prev " data-go-page="'.($curPage - 1).'" title="上一页">上一页</a>
                    </span>';
        }else {
            $html .='<span class="num prev disabled" style="display: none;">
                        <a class="fa fa-angle-double-left" data-go-page="1" title="第一页"></a>
                    </span>
                    <span>
                        <a class="num prev disabled " title="上一页">上一页</a>
                    </span>';
        }

        for($i = $start; $i <= $end; $i++){
            if($i == $curPage){
                $html .='<span class="num curr">
                            <a data-cur-page="'.$i.'">'.$i.'</a>
                        </span>';
            }else{
                $html .='<span>
                            <a class="num " href="javascript:void(0);" data-go-page="'.$i.'">'.$i.'</a>
                        </span>';
            }
        }

        if($curPage < $pageTotal) {
            $html .='<span class="" style="display: none;">
                        <a class="num " data-go-page="'.$pageTotal.'" title="最后一页"></a>
                    </span>
                    <span>
                        <a class="num next" data-go-page="'.($curPage + 1).'" title="下一页">下一页</a>
                    </span>';
        }else {
            $html .='<span class="disabled" style="display: none;">
                        <a class="num " data-go-page="'.$pageTotal.'" title="最后一页"></a>
                    </span>
                    <span>
                        <a class="num next disabled" title="下一页">下一页</a>
                    </span>';
        }
        $html .= '</div>';

    /*$html .= '<div class="pagination-goto">
                <input class="ipt form-control goto-input" type="text">
                <button class="btn btn-default goto-button" title="点击跳转到指定页面">GO</button>
                <a class="goto-link" data-go-page="'.I('get.page[cur_page]').'" style="display: none;"></a>
            </div>';*/

    $html .= '<script type="text/javascript">
                $().ready(function () {
                    $(".pagination-goto > .goto-input").keyup(function (e) {
                        $(".pagination-goto > .goto-link").attr("data-go-page", $(this).val());
                        if (e.keyCode == 13) {
                            $(".pagination-goto > .goto-link").click();
                        }
                    });
                    $(".pagination-goto > .goto-button").click(function () {
                        var page = $(".pagination-goto > .goto-link").attr("data-go-page");
                        if ($.trim(page) == \'\') {
                            return false;
                        }
                        $(".pagination-goto > .goto-link").attr("data-go-page", page);
                        $(".pagination-goto > .goto-link").click();
                        return false;
                    });
                });
            </script>';
    $html .= '</div>';

    return $html;
}

/**
 * 将字符串参数变为数组
 * @param $query
 * @return array array (size=10)
            'm' => string 'content' (length=7)
            'c' => string 'index' (length=5)
            'a' => string 'lists' (length=5)
            'catid' => string '6' (length=1)
            'area' => string '0' (length=1)
            'author' => string '0' (length=1)
            'h' => string '0' (length=1)
            'region' => string '0' (length=1)
            's' => string '1' (length=1)
            'page' => string '1' (length=1)
 */
function convert_url_query($query)
{
    $queryParts = explode('&', $query);
    $params = array();
    foreach ($queryParts as $param) {
        $item = explode('=', $param);
        $params[$item[0]] = $item[1];
    }
    return $params;
}

/**
 * 将参数变为字符串
 * @param $array_query
 * @return string string 'm=content&c=index&a=lists&catid=6&area=0&author=0&h=0®ion=0&s=1&page=1' (length=73)
 */
function get_url_query($array_query)
{
    $tmp = array();
    foreach($array_query as $k=>$param)
    {
        $tmp[] = $k.'='.$param;
    }
    $params = implode('&',$tmp);
    return $params;
}

/**
 * 设置url中的参数
 * @param $url
 * @param $params
 * @return string
 */
function set_url($url, $params){
    $arr = parse_url($url);
    $arr_query = isset($arr['query'])?convert_url_query($arr['query']):[];
    foreach($params as $key=>$value){
        if($value){
            $arr_query[$key] = $value;
        }else{
            unset($arr_query[$key]);
        }
    }

    return $arr['scheme'].'://'.$arr['host'].$arr['path'].(get_url_query($arr_query)?'?':'').get_url_query($arr_query);
}

/**
 * 获取layui 分页url
 * @param string $path 传入分页path 如： "cms/Article/list"
 * @param array $extraParams 传入分页额外参数 如： "['cid' => 123, 'aid' => 234]"
 * @return string
 *
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017-09-29
 */
function get_layui_page_url($path = '', $extraParams = [], $isAdmin = 0)
{
    if ($isAdmin) {
        // 如果是总后台 则执行下面的
        return $path.'&';
    }
    $urlArr = parse_url(request()->url());

    if($path == ''){
        // TODO 如果没传入url path路径 则自动获取url中的path路径
        $path = $urlArr['path'];
    }

    $urlString = set_url(get_root_url().$path, $extraParams);

    $urlArr = parse_url($urlString);

    if($path == ''){
        // TODO 如果没传入url path路径 则自动获取url中的path路径
        $path = $urlArr['path'];
    }

    $arrString = ''; // 初始化
    if(isset($urlArr['query'])){
        // 有参数
        $arr_query = convert_url_query($urlArr['query']);
        unset($arr_query['currpage']);
        $arrString = get_url_query($arr_query);
    }

    if($arrString != ''){
        $arrString = $path.'?'.$arrString.'&';
    } else{
        $arrString = $path.'?';
    }
    return $arrString;
}

/**
 * layui 分页封装 调用此函数即可
 * @param $count
 * @param string $path 传入分页path 如： "cms/Article/list"
 * @param array $extraParams 传入分页额外参数 如： "['cid' => 123, 'aid' => 234]"
 * @return string
 *  用法：  $page = lay_page($count, 'cms/Article/list', ['cid' => 1]);
 *          $this->assign('page', $page);
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017-09-29
 */
function lay_page($count, $path = '', $extraParams = [], $isAdmin = 0, $pageSize = 0)
{
    $curPage = request()->param('curpage', 1);

    $urlString = get_layui_page_url($path, $extraParams, $isAdmin);

    $page = '<div id="page"></div>';
    $page .= '<script src="__PUBLIC__/static/admin/layui.page.js" charset="utf-8"></script>';
    $page .= '<script>';
    $page .= 'lay_page(\''.$count.'\', \''.$curPage.'\', \''.$urlString.'\', \''.$pageSize.'\')';
    $page .= '</script>';

    return $page;
}

///**
// * 获取layui 分页url
// * @return string
// */
//function get_layui_page_url($path = '')
//{
//    $urlArr = parse_url(request()->url());
//
//    if($path == ''){
//        // TODO 如果没传入url path路径 则自动获取url中的path路径
//        $path = $urlArr['path'];
//    }
//
//    $arrString = ''; // 初始化
//    if(isset($urlArr['query'])){
//        // 有参数
//        $arr_query = convert_url_query($urlArr['query']);
//        unset($arr_query['currpage']);
//        $arrString = get_url_query($arr_query);
//    }
//
//    if($arrString != ''){
//        $arrString = $path.'?'.$arrString.'&currpage=';
//    }else{
//        $arrString = $path.'?currpage=';
//    }
//
//    return $arrString;
//}
//
//function get_layui_page_url_2($path = '', $extraParams = [])
//{
//    $urlArr = parse_url(request()->url());
//
//    if($path == ''){
//        // TODO 如果没传入url path路径 则自动获取url中的path路径
//        $path = $urlArr['path'];
//    }
//
//    $urlString = set_url(get_root_url().$path, $extraParams);
//
//    return $urlString;
//}
//
///**
// * layui 分页封装
// * @param $count
// * @param string $urlString
// * @return string
// *
// * @author 雲溪荏苒
// * @date 2017-09-27
// */
//function lay_page($count, $urlString = '')
//{
//    $curPage = request()->param('curpage', 1);
//
//    if($urlString == '') {
//        $urlString = get_layui_page_url();
//    }
//
//    $page = '<div id="page"></div>';
//    $page .= '<script src="__PUBLIC__/static/admin/layui.page.js" charset="utf-8"></script>';
//    $page .= '<script>';
//    $page .= 'lay_page(\''.$count.'\', \''.$curPage.'\', \''.$urlString.'\')';
//    $page .= '</script>';
//
//    return $page;
//}

/**
 * 登录注册统一ajax返回
 *
 * @param string $msg
 * @param int $status
 * @param string $errno
 * @param string $error
 * @param string $redirect
 * @param int $times
 * @return array
 */
function common_result($msg = '', $status = 0, $errno = '', $error = '', $redirect = '', $times = 0){

    $result = [
        'msg' => $msg,
        'status' => $status,
        'errno' => $errno,
        'error' => $error,
        'redirect' => $redirect,
        'times' => $times,
    ];

//    if (!$status) {
//        unset($result['status']);
//    }
    if (!$errno) {
        unset($result['errno']);
    }

    if (!$error) {
        unset($result['error']);
    }

    if($error !== '' && $error === '0') {
        $result['error'] = "0";
    }

    if (!$times) {
        unset($result['times']);
    }
    if (!$redirect) {
        unset($result['redirect']);
    }
    return $result;
}


/**
 * 获取二级域名顶级域名
 *
 * @param $httpurl
 * @return array|void
 */
function parseHost($httpurl)
{
    $httpurl = strtolower( trim($httpurl) );
    if(empty($httpurl)) return ;
    $regx1 = '/https?:\/\/(([^\/\?#]+\.)?([^\/\?#-\.]+\.)(com\.cn|org\.cn|net\.cn|com\.jp|co\.jp|com\.kr|com\.tw)(\:[0-9]+)?)/i';
    $regx2 = '/https?:\/\/(([^\/\?#]+\.)?([^\/\?#-\.]+\.)(cn|com|org|net|cc|biz|hk|jp|kr|name|me|tw|la)(\:[0-9]+)?)/i';
    $host = $tophost = '';
    if(preg_match($regx1,$httpurl,$matches))
    {
        $host = $matches[1];
    } elseif(preg_match($regx2, $httpurl, $matches)) {
        $host = $matches[1];
    }

    if($matches) $tophost = $matches[2] == 'www.' ? $host : 'www.'.$matches[3].$matches[4];
    return array($host,$tophost);
}

/**
 * 将字符串中的回车换行符替换成<br/>换行
 *
 * @param $str
 * @return mixed
 */
function str_br($str)
{
    $patten = array("\r\n", "\n", "\r");

    return str_replace($patten, "<br/>", $str);
}


/**
 * 通知邮件/通知消息 内容转换函数
 *
 * @param string $message 内容模板
 * @param array $param 内容参数数组
 * @return string 通知内容
 */
function hcReplaceText($message,$param){
    if(!is_array($param))return false;
    foreach ($param as $k=>$v){
        $message	= str_replace('{$'.$k.'}',$v,$message);
    }
    return $message;
}

function flash($status = 'success', $msg = '操作成功', $key = 'layerMsg')
{
    session($key, ['status' => $status, 'msg' => $msg]);
}

if (! function_exists('met_pagination')) {
    /**
     * 米拓（metinfo）专用分页函数封装
     *
     * @param int $total 数据总记录数
     * @param int $pageSize 每页数量
     * @param string $basePath url 基本路径 如：/news.html 或者 news_list/1.html 如果是Thinkphp框架 可以通过url生成
     * @param string $pageAlias 当前页别名设置 默认为cur_page，可以设置为：page
     * @return string 返回分页html字符串
     * @Author: 雲溪荏苒 <290648237@qq.com>
     */
    function met_pagination($total, $pageSize = 10, $basePath = '', $pageAlias = 'cur_page')
    {

        $pageArr = request()->param();
        $curPage = request()->param($pageAlias, 1); // 当前页
        $offset = ($curPage - 1) * $pageSize; // 从第几条数据开始查询
        $pageTotal = ceil($total / $pageSize); // 总页数

        //分页
        $num = 7; //需要显示的最多页数
        $num = min($pageTotal, $num); //处理显示的页码数大于总页数的情况
        $end = $curPage + floor($num/2) <= $pageTotal ? $curPage + floor($num/2) : $pageTotal; //计算结束页号
        $start = $end - $num + 1; //计算开始页号
        if($start < 1) { //处理开始页号小于1的情况
            $end -= $start - 1;
            $start = 1;
        }

        $html = '<div class="met_pager">';

        /*上一页*/
        if ($curPage > 1) {
            $html .= '<a href="'.$basePath.'?'.$pageAlias.'='.($curPage -  1).'" class="PreA">上一页</a>';
        } else {
            $html .= '<span class="PreSpan">上一页</span>';
        }

        /*页码循环*/
        for($i = $start; $i <= $end; $i++){
            if($i == $curPage){
                /*当前页*/
                $html .= '<a href="javascript:;" class="Ahover">'.$i.'</a>';
            }else{
                $html .= '<a href="'.$basePath.'?'.$pageAlias.'='.$i.'" >'.$i.'</a>';
            }
        }

        /*下一页*/
        if ($curPage < $pageTotal) {
            $html .= '<a href="'.$basePath.'?'.$pageAlias.'='.($curPage +  1).'" class="NextA">下一页</a>';
        } else {
            $html .= '<span class="NextSpan">下一页</span>';
        }

        /*跳转到指定页码 todo 跳转指定页码待完善*/
        $html .= '<span class="PageText">转至第</span>';
        $html .= '<input type="text" id="metPageT" data-pageurl="'.$basePath.'?'.$pageAlias.'='.$curPage.'|'.$pageTotal.'" value="1" />';
        $html .= '<input type="button" id="metPageB" value="页" />';
        $html .= '</div>';

        return $html;
    }
}