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

namespace app\common\model;

use think\Model;

/**
 * 手机短信记录模型
 * Class SmsLog
 * @package app\common\model
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/11/20
 */
class SmsLog extends Model{

    /**
     * 增加短信记录
     *
     * @param
     * @return int
     */
    public function addSms($log_array) {
        $log_id = M('sms_log')->insertGetId($log_array);
        return $log_id;
    }

    /**
     * 查询单条记录
     *
     * @param
     * @return array
     */
    public function getSmsInfo($condition) {
        if (empty($condition)) {
            return false;
        }
        $result = M('sms_log')->where($condition)->order('log_id desc')->find();
        return $result;
    }

    /**
     * 查询记录
     * @param array $condition
     * @param string $page
     * @param int $pageSize
     * @param string $order
     * @return mixed
     */
    public function getSmsList($condition = array(), $page = '', $pageSize = 0, $order = 'log_id desc') {
        $result = M('sms_log')->where($condition)->page($page, $pageSize)->order($order)->select();
        return $result;
    }
    
    /**
     * 取得记录数量
     *
     * @param
     * @return int
     */
    public function getSmsCount($condition) {
        return M('sms_log')->where($condition)->count();
    }
}
