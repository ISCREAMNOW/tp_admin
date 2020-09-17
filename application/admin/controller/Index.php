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

namespace app\admin\controller;

use controller\BasicAdmin;
use service\DataService;
use service\NodeService;
use service\ToolsService;
use think\Db;
use think\View;

/**
 * 后台入口
 * Class Index
 * @package app\admin\controller
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/02/15 10:41
 */
class Index extends BasicAdmin
{

    /**
     * 后台框架布局
     * @return View
     */
    public function index()
    {
        NodeService::applyAuthNode();
        $list = (array)Db::name('SystemMenu')->where(['status' => '1'])->order('sort asc,id asc')->select();
        $menus = $this->_filterMenu(ToolsService::arr2tree($list), NodeService::get());
        return view('', ['title' => '系统管理', 'menus' => $menus]);
    }

    /**
     * 后台主菜单权限过滤
     * @param array $menus
     * @param array $nodes
     * @return array
     */
    private function _filterMenu($menus, $nodes)
    {
        foreach ($menus as $key => &$menu) {
            // 存在子菜单时，直接使用递归处理
            if (!empty($menu['sub'])):
                $menu['sub'] = $this->_filterMenu($menu['sub'], $nodes);
            endif;
            if (!empty($menu['sub'])):
                $menu['url'] = '#';
            // 菜单链接以http开头时，不做处理
            elseif (preg_match('/^https?\:/i', $menu['url'])) :
                continue;
            // 菜单链接不为空时，判断登录状态及权限验证
            elseif ($menu['url'] !== '#') :
                $node = join('/', array_slice(explode('/', preg_replace('/[\W^_]/', '/', $menu['url'])), 0, 3));
                $menu['url'] = url($menu['url']);
                // 节点需要验证验证，未登录时移除此菜单
                if (isset($nodes[$node]) && $nodes[$node]['is_login'] && !session('user')) :
                    unset($menus[$key]);
                // 节点需要权限验证，无权限时移除此菜单
                elseif (isset($nodes[$node]) && $nodes[$node]['is_auth'] && session('user') && !auth($node)) :
                    unset($menus[$key]);
                endif;
            // 非以上情况时，移除此菜单
            else :
                unset($menus[$key]);
            endif;
        }
        return $menus;
    }

    /**
     * 主机信息显示
     * @return View
     */
    public function main()
    {
        // 判断是否登录
        // 用户登录状态检查
        if (!session('user')) {
            $this->error('抱歉，您还没有登录获取访问权限！', url('@admin/login'));
        }
        if (session('user.password') === '21232f297a57a5a743894a0e4a801fc3') {
            $url = url('admin/index/pass') . '?id=' . session('user.id');
            $alert = ['type' => 'danger', 'title' => '安全提示', 'content' => "超级管理员默认密码未修改，建议马上<a href='javascript:void(0)' data-modal='{$url}'>修改</a>！",];
            $this->assign('alert', $alert);
        }
        $_version = Db::query('select version() as ver');
        return view('', ['mysql_ver' => array_pop($_version)['ver'], 'title' => '后台首页']);
    }

    /**
     * 修改密码
     */
    public function pass()
    {
        if (intval($this->request->request('id')) !== intval(session('user.id'))) {
            $this->error('访问异常！');
        }
        if ($this->request->isGet()) {
            $this->assign('verify', true);
            return $this->_form('SystemUser', 'user/pass');
        }
        $data = $this->request->post();
        if ($data['password'] !== $data['repassword']) {
            $this->error('两次输入的密码不一致，请重新输入！');
        }
        $user = Db::name('SystemUser')->where('id', session('user.id'))->find();
        if (md5($data['oldpassword']) !== $user['password']) {
            $this->error('旧密码验证失败，请重新输入！');
        }
        if (DataService::save('SystemUser', ['id' => session('user.id'), 'password' => md5($data['password'])])) {
            $this->success('密码修改成功，下次请使用新密码登录！', '');
        }
        $this->error('密码修改失败，请稍候再试！');
    }

    /**
     * 修改资料
     */
    public function info()
    {
        if (intval($this->request->request('id')) === intval(session('user.id'))) {
            return $this->_form('SystemUser', 'user/form');
        }
        $this->error('访问异常！');
    }

}
