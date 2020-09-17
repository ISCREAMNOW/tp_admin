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
 * 邮件模板模型
 * Class MailMsgTemplates
 * @package app\common\model
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/11/20
 */
class MailMsgTemplates extends Model{

    /**
     * 获取单条邮件短信模板数据
     *
     * @param array $condition
     * @param string $fields
     * @return mixed
     */
    public function getTplInfo($condition = array(), $fields = '*') {
        return M('mail_msg_templates')->where($condition)->field($fields)->find();
    }

    /**
     * 获取邮件短信模板列表
     *
     * @param array $condition
     * @return mixed
     */
    public function getTplList($condition = array()){
        return M('mail_msg_templates')->where($condition)->select();
    }

    /**
     * 更新邮件短信模板信息
     *
     * @param array $data
     * @param array $condition
     * @return mixed
     */
    public function editTpl($data = array(), $condition = array()) {
        return M('mail_msg_templates')->where($condition)->update($data);
    }

}














