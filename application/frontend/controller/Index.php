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

namespace app\frontend\controller;

use think\Controller;


/**
 * 网站前端入口控制器
 * Class Index
 * @package app\frontend\controller
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2018/3/25
 */
class Index extends Controller
{

    /**
     * 网站首页
     * @return mixed
     */
    public function index()
    {
        return $this->display('pc index');
    }

}
