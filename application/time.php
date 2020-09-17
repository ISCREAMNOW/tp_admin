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

if (!function_exists('format_time')) {
    /**
     * 时间戳格式化
     * @param string $time 时间戳
     * @param string $format 输出格式
     * @return false|string
     */
    function format_time($time = '', $format='Y-m-d H:i') {
        return !$time ? '' : date($format, intval($time));
    }
}

if (!function_exists('format_moment')) {
    /**
     * 使用momentjs的时间格式来格式化时间戳
     * @param null $time 时间戳
     * @param string $format momentjs的时间格式
     * @return false|string
     * @author andy <290648237@qq.com>
     */
    function format_moment($time = null, $format='YYYY-MM-DD HH:mm') {
        $format_map = [
            // 年、月、日
            'YYYY' => 'Y',
            'YY'   => 'y',
//            'Y'    => '',
            'Q'    => 'I',
            'MMMM' => 'F',
            'MMM'  => 'M',
            'MM'   => 'm',
            'M'    => 'n',
            'DDDD' => '',
            'DDD'  => '',
            'DD'   => 'd',
            'D'    => 'j',
            'Do'   => 'jS',
            'X'    => 'U',
            'x'    => 'u',

            // 星期
//            'gggg' => '',
//            'gg' => '',
//            'ww' => '',
//            'w' => '',
            'e'    => 'w',
            'dddd' => 'l',
            'ddd'  => 'D',
            'GGGG' => 'o',
//            'GG' => '',
            'WW' => 'W',
            'W'  => 'W',
            'E'  => 'N',

            // 时、分、秒
            'HH'  => 'H',
            'H'   => 'G',
            'hh'  => 'h',
            'h'   => 'g',
            'A'   => 'A',
            'a'   => 'a',
            'mm'  => 'i',
            'm'   => 'i',
            'ss'  => 's',
            's'   => 's',
//            'SSS' => '[B]',
//            'SS'  => '[B]',
//            'S'   => '[B]',
            'ZZ'  => 'O',
            'Z'   => 'P',
        ];

        // 提取格式
        preg_match_all('/([a-zA-Z]+)/', $format, $matches);
        $replace = [];
        foreach ($matches[1] as $match) {
            $replace[] = isset($format_map[$match]) ? $format_map[$match] : '';
        }

        // 替换成date函数支持的格式
        $format = str_replace($matches[1], $replace, $format);
        $time = $time === null ? time() : intval($time);
        return date($format, $time);
    }
}

    /**
     * 时间戳格式化
     * 判断时间间隔，1天内显示多少时间前，1天后天是具体时间
     * @param int $time 格式化时间戳
     * @return string 完整的时间显示
     */
    function out_put_time($time){
        $now=time();
        $data=$now-$time;
        if($data < 86400){
            $res_time = time_stamp($time);
        }else{
            $res_time = format_time($time);
        }
        return $res_time;
    }


    /*计算当前时间与@param的距离 返回 秒 分 时 天 (前)
    * @param Time stamp
    * @return string
    */
    function time_stamp($firstTime){
        $now=time();
        $data=$now-$firstTime;
        if($data < 60){
            $res=$data."秒前";
        }elseif($data > 60 && $data < 3600){
            $res=floor($data/60)."分前";
        }elseif ($data > 3600 && $data < 86400) {
            $res=floor($data/3600)."小时前";
        }elseif ($data > 86400 && $data < 2592000){
            $res=floor($data/86400)."天前";
        }elseif($data > 2592000 && $data < 31536000){
            $res=floor($data/2592000)."个月前";
        }else{
            $res=floor($data/31536000)."年前";
        }
        return $res;
    }


/**
 * 输出时间日记,只输出 日
 * @param $unixTime
 */

/**
 * 输出时间日期,只输出 日
 * @param $unixTime
 * @return  日
 */
function time_day($unixTime){
    $time = date('d', $unixTime);
    return $time;
}


/**
 * 输出时间日期,只输出 月
 * @param $unixTime
 * @return  月
 */
function time_month_english($unixTime){
    //判断是否为时间戳
    if($unixTime > 12 && strlen($unixTime) > 2){
        $time = date('m', $unixTime);
    }else{
        $time = $unixTime;
    }
    switch ($time)
    {
        case 1:
            $timeStr = 'jan';
            break;
        case 2:
            $timeStr = 'feb';
            break;
        case 3:
            $timeStr = 'mar';
            break;
        case 4:
            $timeStr = 'apr';
            break;
        case 5:
            $timeStr = 'may';
            break;
        case 6:
            $timeStr = 'jun';
            break;
        case 7:
            $timeStr = 'jul';
            break;
        case 8:
            $timeStr = 'aug';
            break;
        case 9:
            $timeStr = 'sep';
            break;
        case 10:
            $timeStr = 'oct';
            break;
        case 11:
            $timeStr = 'nov';
            break;
        case 12:
            $timeStr = 'dec';
            break;
        default:
            //TODO:
            break;

    }
    return $timeStr;
}

/**
 * 输出时间日期,只输出 年
 * @param $unixTime
 * @return  年
 */
function time_year($unixTime){
    $time = date('Y', $unixTime);
    return $time;
}

/*
 * 获取一天的开始时间错和 结束时间戳
 * @param $year 年
 * @param $month 月
 * @param $day 日
 * @return  array() $ftime开始时间 $ltime结束时间
 */
function dFirstAndLast($year=null,$month=null,$day=null){

    $year =$year ? $year : date("Y");
    $month =$month ? $month : date("m");
    $day = $day ? $day : date("d");
    $ftime = mktime(0,0,0,$month,$day,$year);//当天开始时间戳
    $ltime = mktime(23,59,59,$month,$day,$year);//当天结束时间戳
    return array($ftime,$ltime);
}

/*字符串自动补全
 *@param $str 规定要填充的字符串。
 *@param $length 规定新字符串的长度。如果该值小于原始字符串的长度，则不进行任何操作。
 *@param $pad_string 规定供填充使用的字符串。默认是0。
 *@param $pad_type 规定填充字符串的那边。
 * @return  string
 */
function strLeng($str,$length=2,$pad_string="0",$pad_type='STR_PAD_LEFT'){
    return str_pad($str,$length,$pad_string,$pad_type);
}


function getMonthBeginEndDay($year,$month,$format='timestamp'){
    $month = sprintf('%02d',$month);
    $ymd = $year."-".$month."-01";
    $begin = strtotime($ymd." 00:00:00");
    $end   = strtotime("$ymd +1 month -1 seconds");
    if($format=='timestamp'){
        return [
            'begin'=>$begin,
            'end'=>$end
        ];
    }else{
        return [
            'begin'=>date($format,$begin),
            'end'=>date($format,$end),
        ];
    }
}

function getDayBeginEndTime($date,$format='timestamp'){
    $begin = strtotime($date." 00:00:00");
    $end   = strtotime("$date +1 day -1 seconds");
    if($format=='timestamp'){
        return [
            'begin'=>$begin,
            'end'=>$end
        ];
    }else{
        return [
            'begin'=>date($format,$begin),
            'end'=>date($format,$end),
        ];
    }
}

function getHourBeginEndTime($date ,$hour,$format='timestamp'){
    $hour = sprintf('%02d',$hour);
    $begin = strtotime($date." ".$hour.":00:00");
    $end   = strtotime($date." ".$hour.":00:00 +1 hour -1 seconds");
    if($format=='timestamp'){
        return [
            'begin'=>$begin,
            'end'=>$end
        ];
    }else{
        return [
            'begin'=>date($format,$begin),
            'end'=>date($format,$end),
        ];
    }
}

/**
 * Unix时间戳转日期
 * @param $unixtime
 * @param string $format
 * @param string $timezone
 * @return string
 */
function unixtime_to_date($format = 'Y-m-d H:i:s', $unixtime, $timezone = 'PRC') {
    $datetime = new DateTime("@$unixtime"); //DateTime类的bug，加入@可以将Unix时间戳作为参数传入
    $datetime->setTimezone(new DateTimeZone($timezone));
    return $datetime->format($format);
}

/**
 * 日期转Unix时间戳
 * @param $date
 * @param string $timezone
 * @return string
 */
function date_to_unixtime($date, $timezone = 'PRC') {
    $datetime= new DateTime($date, new DateTimeZone($timezone));
    return $datetime->format('U');
}

?>