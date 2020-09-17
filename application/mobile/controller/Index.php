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

namespace app\mobile\controller;

use controller\BasicMobile;
use think\Controller;
use think\Request;

/**
 * wap 端首页
 * Class Index
 * @package app\mobile\controller
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2018/3/25
 */
class Index extends Controller
{

    public function index()
    {
        return $this->display('mobile index');
    }

}
