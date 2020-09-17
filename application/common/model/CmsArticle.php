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

use app\common\model\CmsArticleClass;
use app\common\model\BaseModel;
use think\Model;

/**
 * cms文章模型
 * Class CmsArticle
 * @package app\common\model
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/11/18
 */
class CmsArticle extends Model
{

    /**
     * 根据分类ID获取分类条件
     * 获取该分类（包括子分类）下的所有文章
     * @param int $categoryID
     * @return mixed
     */
    public static function getCMapByCid($categoryID = 0) {
        $category_ids = M("cms_article_class")->where('pid', $categoryID)->column('class_id');
        if($category_ids) {
            array_unshift($category_ids, $categoryID);
            $map['article_class_id'] = ['in', $category_ids]; // 查找category_id （包括子分类）下的所有文章
        }else {
            $map['article_class_id'] = $categoryID; // 查找某一个最底层分类下的文章
        }
//dump($map);die;
        return $map;
    }

    /**
     * 获取文章列表
     *
     * @param array $condition
     * @param int $curPage
     * @param int $pageSize
     * @param string $order
     * @param string $field
     * @return array
     */
    public static function getList($condition = [], $curPage = 0, $pageSize = 10, $order = 'article_publish_time desc', $field = '*')
    {

        if (isset($condition['article_class_id']) && $condition['article_class_id'] == 0) {
            unset($condition['article_class_id']);
        }

        // 如果分类有子分类 获取该分类下所有子分类的文章
        if (!empty($condition['article_class_id'])) {
            $cidCondition = self::getCMapByCid($condition['article_class_id']);
            $condition = array_merge($condition, $cidCondition);
        }

//        dump($condition);
        if (!$curPage) {
            $curPage = request()->param('cur_page', 1);// 获取当前页码
        }

        $count = M('cms_article')->field($field)->where($condition)->count();
        $result = M('cms_article')->field($field)->where($condition)->page($curPage, $pageSize)->order($order)->select();
        foreach ($result as $k => $v) {
            $class_name = CmsArticleClass::getCategoryNameByID($v['article_class_id']);
            $result[$k]['article_class_name'] = $class_name;
        }
        return [$result, $count];
    }

    /**
     * 文章数量
     * @param array $condition
     * @return int
     */
    public static function getCmsArticleCount($condition)
    {
        $count = M('cms_article')->where($condition)->count();
        return $count;
    }

    /**
     * 读取单条记录
     * @param int $articleId
     */
    public function getArticleDetail($articleId)
    {
        $result = M("cms_article")->where(['article_id' => $articleId])->find();

        if ($result) {
            $result['article_class_name'] = CmsArticleClass::getCategoryNameByID($result['article_class_id']);
        }
        return $result;
    }

    /*
     *  判断是否存在
     *  @param array $condition
     *
     */
    public function isExist($condition)
    {
        $result = M("cms_article")->getOne($condition);
        if (empty($result)) {
            return FALSE;
        } else {
            return TRUE;
        }
    }


    /**
     * 读取列表和分类名称
     *
     */
    public static function getListWithClassName($condition, $page = null, $order = '', $field = '*', $limit = '')
    {
        $join = [['cms_article_class ac', 'a.article_class_id = ac.class_id']];
        $result = M('cms_article')->field($field)->alias("a")->join($join)->where($condition)->page($page)->order($order)->limit($limit)->select();
        return $result;
    }

    /**
     * 根据tag编号查询
     */
    public static function getListByTagID($condition, $page = 1, $size = 10, $order = '', $field = '*', $limit = '')
    {
        $condition['relation_type'] = 1;
        $join = [['cms_tag_relation r', 'a.article_id = r.relation_object_id']];
        $result = M('cms_article')->field($field)->alias('a')->join($join)->where($condition)->page($page, $size)->order($order)->limit($limit)->select();
        return $result;
    }


    /**
     * 根据tag编号查询文章数量
     * @param array $condition
     * @return int
     */
    public static function getCountByTagID($condition, $field = '', $order = '', $limit = 0)
    {
        $condition['relation_type'] = 1;
        $join = [['cms_tag_relation r', 'a.article_id = r.relation_object_id']];
        $count = M('cms_article')->field($field)->alias('a')->join($join)->where($condition)->order($order)->limit($limit)->count();
        return $count;
    }


    /**
     * 文章访问量+1
     * @param int $id 文章ID
     */
    public static function setViewInc($articleId)
    {
        self::where('article_id', $articleId)->setInc('article_click');
    }

    /**
     * 获取上一篇/下一篇
     * @param int $id
     * @return array
     */
    public static function getFrontAfterArticles($id = 0)
    {

        $previous = [];
        $next = [];

        if ($id) {
            //上一篇
            $previous = self::where("article_id<" . $id)->order('article_id desc')->limit('1')->find();

            //下一篇
            $next = self::where("article_id>" . $id)->order('article_id asc')->limit('1')->find();

        } else {
            self::getError('新闻ID错误');
        }

        return [$previous, $next];
    }


    public function articleSoftDelete($article_ids)
    {
        if (count(explode(',', $article_ids)) > 1) {
            $condition['article_id'] = ['in', $article_ids];
        } else {
            $condition['article_id'] = $article_ids;
        }

        // 删除文章表数据
        $result = $this->where($condition)->delete();

        return $result;
    }

    /**
     * 根据指定字段更新文章信息
     * @param $article_ids
     * @param $field
     * @param $value
     * @return $this
     */
    public function editArticleInfo($article_ids, $field, $value)
    {
        if (count(explode(',', $article_ids)) > 1) {
            $condition['article_id'] = ['in', $article_ids];
        } else {
            $condition['article_id'] = $article_ids;
        }
        $result = $this->where($condition)->update([$field => $value]);
        return $result;
    }



    public function addArticle($insert)
    {
        // 开始事务
        $this->startTrans();
        try {
            // 执行数据操作
            if (isset($insert['article_id'])) {
                // 更新操作
                $insert['article_modify_time'] = time();
                $result = $this->update($insert);
                if ($result) {
                    $article_id = $insert['article_id'];
                } else {
                    $article_id = 0;
                }
            } else {
                // 新增操作
                $insert['article_publish_time'] = time();
                $article_id = $this->insertGetId($insert);
            }

            // 提交事务
            $this->commit();
        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }

        return $article_id;
    }
}












