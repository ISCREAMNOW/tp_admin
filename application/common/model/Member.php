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
 * 会员模型
 * Class Member
 * @package app\common\model
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/11/18
 */
class Member extends Model{

    public function exits($username){
        return $this->where('member_name',$username)->count();
    }

    public function findUser($user_id=0,$username='',$field = ''){
        if($user_id){
            $this->where('member_id',$user_id);
        }

        if(!empty($username)){
            $this->where('member_name',$username);
        }
        if(!empty($field)){
            $this->field($field);
        }
        $result = $this->find();

        if ($result) {
            return $result->toArray();
        }

        return false;
    }

    public function getMemberInfo($condition)
    {
        return $this->where($condition)->find();
    }



    /**
     * 获得可用的会员名
     * @param string $prefix
     * @param int $num
     * @return string
     */
    public function getMemberName($prefix = 'user_', $num = 0){
        if ($num < 1) {
            $num = rand(100, 899);
        }
        if (strlen($prefix) < 3) {
            $member_name = $prefix.$num;
        } else {
            $member_name = $prefix;
        }
        if (strlen($member_name) < 6) {
            $member_name = $member_name.$num;
        }
        $member = $this->findUser(0, $member_name);
        if(!empty($member)) {
            for ($i = 1;$i < 999;$i++) {
                $num += $i;
                $member_name = $prefix.$num;
                if (strlen($member_name) < 6) {
                    $member_name = 'user_'.$member_name;
                }
                $member = $this->findUser(0, $member_name);
                if(empty($member)) {//查询为空表示当前会员名可用
                    break;
                }
            }
        }
        return $member_name;
    }


    public function addUser($data){
        return $this->insertGetId($data);
    }

    public function updateUser($data,$user_id=0){
        if($user_id){
            return $this->where('member_id',$user_id)->update($data);
        }
        return false;
    }



    public function getMemberCommonInfo($condition = array(), $fields = '*') {
        return M('member_common')->where($condition)->field($fields)->find();
    }


    public function addMemberCommon($data) {
        return M('member_common')->insert($data);
    }


    public function editMemberCommon($data,$condition) {

        return M('member_common')->where($condition)->update($data);
    }


    /**
     * 登录时创建会话SESSION
     *
     * @param array $member_info 会员信息
     */
    public function createSession($member_info = array(),$reg = false) {
        if (empty($member_info)) return ;

        session('is_login', '1');
        session('member_id', $member_info['member_id']);
        session('member_name', $member_info['member_name']);
        session('member_email', $member_info['member_email']);
        session('is_buy', isset($member_info['is_buy']) ? $member_info['is_buy'] : 0);
        session('avatar', $member_info['member_avatar']);


        if(!empty($member_info['member_login_time'])) {
            $update_info	= array(
                'member_login_num'=> ($member_info['member_login_num']+1),
                'member_login_time'=> time(),
                'member_old_login_time'=> $member_info['member_login_time'],
                'member_login_ip'=> get_client_ip(),
                'member_old_login_ip'=> $member_info['member_login_ip']
            );
            $this->updateUser($update_info, $member_info['member_id']);
        }

    }



}