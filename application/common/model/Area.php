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
 * 地区模型
 * Class Area
 * @package app\common\model
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/11/18
 */
class Area extends Model{

    /**
     * 获取开放地区列表
     *
     * @param int $deep
     * @return false|\PDOStatement|string|\think\Collection
     */
    public function getOpenAreaList($deep = 1)
    {
        $condition = [
            'area_open' => 1,
            'area_deep' => $deep
        ];
        $result = M('area')->where($condition)->order('area_sort asc')->select();
        return $result;
    }

    /**
     * 根据一级地区id（省级地区）获取二级地区（市级地区）列表
     *
     * @param int $pid
     * @return mixed
     */
    public function getOpenAreaByPid($pid = 0)
    {
        $condition = [
            'area_open' => 1,
            'area_parent_id' => $pid
        ];
        $result = M('area')->where($condition)->order('area_sort asc')->select();
        return $result;
    }

    /**
     * 根据地区id获取地区名称
     *
     * @param int $areaId 地区id
     * @param int $deep 地区级别 1-省级 2-市级 3-区县级
     * @return mixed
     */
    public function getAreaNameById($areaId, $deep = 1)
    {
        $map = [
            'area_id' => $areaId,
            'area_deep' => $deep
        ];
        $result = M('area')->where($map)->value('area_name');
        return $result;
    }

    /**
     * 根据地区名称获取地区id
     * @param string $areaName 地区名称
     * @param int $deep 地区级别 1-省级 2-市级 3-区县级
     * @return mixed
     */
    public function getAreaIdByName($areaName, $deep = 1)
    {
        $map = [
            'area_name' => $areaName,
            'area_deep' => $deep
        ];
        $result = M('area')->where($map)->value('area_id');
        return $result;
    }


}














