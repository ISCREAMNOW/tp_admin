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
use service\LogService;
use think\Cache;
use think\Db;

/**
 * 后台系统设置
 * Class System
 * @package app\admin\controller
 * author andy <290648237@qq.com>
 * @date 2017/05/22
 */
class System extends BasicAdmin {

    /**
     * 当前默认数据模型
     * @var string
     */
    public $table = 'SystemConfig';

    /**
     * 当前页面标题
     * @var string
     */
    public $title = '系统设置';

    /**
     * 显示系统常规配置
     */
    public function index() {
        if (!$this->request->isPost()) {

            // 配置分组信息
            $list_group = sysconf('config_group');
            $list_group = preg_split('/\s+/', $list_group);
            $tab_list   = [];
            foreach ($list_group as $key => $value) {
                $values = explode(':',$value);
                $tab_list[$key]['name'] = $values[0];
                $tab_list[$key]['title'] = $values[1];
                // 分组配置列表
                $db = Db::name($this->table)->where('group', $values[0])->order('sort asc, id asc');
                // 配置分组信息
                $data = parent::_list($db, false, false);
                foreach ($data['list'] as $lkey=>$vo) {
                    // 如果表单类型是 单选、多选、下拉、联动等类型
                    if($vo['type'] == 'radio' || $vo['type'] == 'checkbox' || $vo['type'] == 'select' || $vo['type'] == 'linkage' || $vo['type'] == 'linkages'){
                        $options = preg_split('/\s+/', $vo['options']);
                        $optionsData = [];
                        foreach ($options as $option){
                            $optionsValue = explode(':',$option);
                            $optionsData[$optionsValue[0]] = $optionsValue[1];
                        }
                        $data['list'][$lkey]['options'] = $optionsData;
                    }

                    // 如果表单类型是 多选类型 则将value值转换为数组
                    if($vo['type'] == 'checkbox') {
                        $vo['value'] = explode(',', $vo['value']);
                    }
                }
                $tab_list[$key]['list'] = $data['list'];
            }
            $this->assign('tab_list', $tab_list);
            return $this->fetch('');
        } else {
            $postData = $this->request->post();
            foreach ($postData as $key => $vo) {
                //将数组转换为字符串 TODO 如果是其他配置 怎么做处理？？？
                if($key == 'wipe_cache_type') {
                    $vo = implode(',', $vo);
                }
                sysconf($key, $vo);
            }
            LogService::write('系统管理', '修改系统配置参数成功');
            $this->success('数据修改成功！', '');
        }
    }

    /**
     * 文件存储配置
     */
    public function file()
    {
        $this->title = '文件存储配置';
        $alert = ['type' => 'success', 'title' => '操作提示', 'content' => '文件引擎参数影响全局文件上传功能，请勿随意修改！'];
        $this->assign('alert', $alert);
        return $this->index();
    }

    /**
     * 清空系统缓存
     */
    public function wipeCache()
    {
        if (!empty(sysconf('wipe_cache_type'))) {

            foreach (explode(',', sysconf('wipe_cache_type')) as $item) {
                if ($item == 'LOG_PATH') {
                    $dirs = (array) glob(constant($item) . '*');
                    foreach ($dirs as $dir) {
                        array_map('unlink', glob($dir . '/*.log'));
                    }
                    array_map('rmdir', $dirs);
                } else {
                    array_map('unlink', glob(constant($item) . '/*.*'));
                }
            }
            
            Cache::clear();
            $this->success('清空成功');
        } else {
            $this->error('请在系统设置中选择需要清除的缓存类型');
        }
    }

}
