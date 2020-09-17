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

/*  测试环境禁止操作路由绑定 */
think\Route::post([
//    'admin/index/pass'    => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁修改用户密码！']);
//    },
//    'admin/user/pass'     => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁修改用户密码！']);
//    },
//    'admin/config/index'  => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁修改系统配置操作！']);
//    },
//    'admin/config/file'   => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁修改文件配置操作！']);
//    },
//	'admin/menu/index'      => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁排序菜单操作！']);
//    },
//    'admin/menu/add'      => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁添加菜单操作！']);
//    },
//    'admin/menu/edit'     => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁编辑菜单操作！']);
//    },
//    'admin/menu/forbid'   => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁止禁用菜单操作！']);
//    },
//    'admin/menu/del'      => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁止删除菜单操作！']);
//    },
//    'wechat/config/index' => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁止修改微信配置操作！']);
//    },
//    'wechat/config/pay'   => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁止修改微信支付操作！']);
//    },
//    'admin/node/save'     => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁止修改节点数据操作！']);
//    },
//    'wechat/menu/edit'    => function () {
//        return json(['code' => 0, 'msg' => '测试环境禁止修改微信菜单操作！']);
//    },
]);

//think\Route::get([
////    'wechat/menu/cancel' => function () {
////        return json(['code' => 0, 'msg' => '测试环境禁止删除微信菜单操作！']);
////    },
//]);

use think\Route;

// 访问首页自动跳转到后台
Route::get([
    '/' => function() {
        return '<p style="text-align: center; font-size: 24px; margin:20px;">站点建设中...</p>';
//        return redirect(url('admin'));
    }
]);

// 登录
Route::get('/login', 'frontend/Login/index');
// 注册
Route::get('/register', 'frontend/Login/register');
// 退出
Route::get('/logout', 'frontend/Login/logout');

// 公司简介
Route::get('/company', 'frontend/Article/company');

Route::get('/case', 'frontend/Sitecase/index'); // 客户案例

Route::get('/website', 'frontend/Website/index'); // 网站建设
Route::get('/website/marketing', 'frontend/Website/marketing');
Route::get('/website/vis', 'frontend/Website/vis');
Route::get('/website/b2c', 'frontend/Website/b2c');
Route::get('/website/weixin', 'frontend/Website/weixin');
Route::get('/website/quanwang', 'frontend/Website/quanwang');

Route::get('/app', 'frontend/App/index'); // App开发

// 新闻资讯路由定义
Route::get('news/:article_id', 'frontend/News/show'); // 新闻详情
Route::get('/news_list/:ac_id', 'frontend/News/lists'); // 新闻列表
Route::get('/news_list', 'frontend/News/lists'); // 新闻列表
Route::get('/news', 'frontend/News/index'); // 新闻首页

// 单页文章路由定义
Route::get('article/:article_id', 'frontend/Article/show'); // 文章详情

// 手机端二级域名
Route::domain('m', 'mobile');

return [];
