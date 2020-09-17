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


use service\ToolsService;
use think\Model;

/**
 * cms文章分类模型
 * Class CmsArticleClass
 * @package app\common\model
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/11/18
 */
class CmsArticleClass extends Model
{

	/**
	 * 读取列表 
	 * @param array $condition
	 *
	 */
	public function getList($condition = [], $order='class_sort asc', $field='*'){
        $data = M("cms_article_class")->field($field)->where($condition)->order($order)->select();
        $result = ToolsService::arr2tree($data, 'class_id');
        return $result;
	}
	
	/**
     * 根据分类ID获取分类名称
     * @param int $categoryID 分类ID
     * @return mixed
     */
    public static function getCategoryNameByID($categoryID)
    {
        return self::where('class_id', $categoryID)->value('class_name');
    }

    /**
	 * 读取单条记录
	 * @param array $condition
	 *
	 */
    public function getOne($condition,$order=''){
        $result = M("cms_article_class")->where($condition)->order($order)->find();
        return $result;
    }

	/*
	 *  判断是否存在 
	 *  @param array $condition
     *
	 */
	public function isExist($condition) {
        $result = M("cms_article_class")->getOne($condition);
        if(empty($result)) {
            return FALSE;
        }
        else {
            return TRUE;
        }
	}


	
}












