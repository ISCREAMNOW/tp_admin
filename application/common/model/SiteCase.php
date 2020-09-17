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
 * 网站案例模型
 * Class SiteCase
 * @package app\common\model
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/11/18
 */
class SiteCase extends Model{


    /**
     * 获取网站案例列表
     *
     * @param array $condition
     * @param int $curPage
     * @param int $pageSize
     * @param string $order
     * @param string $field
     * @return array
     */
    public function getSiteCaseList($condition =[], $curPage = 0, $pageSize = 10, $order='sort asc', $field='*')
    {
        if (!$curPage) {
            $curPage = request()->param('cur_page', 1);// 获取当前页码
        }
        $count = M('site_case')->field($field)->where($condition)->count();
        $result = M('site_case')->field($field)->where($condition)->page($curPage, $pageSize)->order($order)->select();
        foreach ($result as $k => $v) {
            $industry_name = M('site_industry')->where('id', $v['industry_id'])->value('industry_name');
            $result[$k]['industry_name'] = $industry_name;
        }
        return [$result, $count];
    }

}














