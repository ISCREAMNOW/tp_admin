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
 * 单页文章模型
 * Class Article
 * @package app\common\model
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/11/18
 */
class Article extends Model{


    /**
     * 根据文章分类ID获取文章列表
     * @param int $ac_id 文章分类ID
     * @return false|\PDOStatement|string|\think\Collection
     */
    public function getArticlesByClassId($ac_id = 0)
    {
        $condition['article_show'] = 1;
        if ($ac_id) {
            $condition['ac_id'] = $ac_id;
        }
        $data = M('article')->where('ac_id', $ac_id)->order('article_sort asc')->select();
        return $data;
    }

    public function getArticleDetailById($aid)
    {
        $data = M('article')->where('article_id', $aid)->find();
        return $data;
    }

    /**
     * 获取所有单页文章
     *
     * @return false|\PDOStatement|string|\think\Collection
     */
    public function getArticleList()
    {
        return M('article')->where('article_show', 1)->order('article_sort asc')->field('article_id, article_title')->select();
    }

}














