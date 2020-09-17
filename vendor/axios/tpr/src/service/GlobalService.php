<?php

// +----------------------------------------------------------------------
// | Ht.Shop
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2027 http://www.yn123.com All rights reserved.
// +----------------------------------------------------------------------
// | Notice: This code is not open source, it is strictly prohibited
// |         to distribute the copy, otherwise it will pursue its
// |         legal responsibility.
// +----------------------------------------------------------------------
// | Author: 雲溪荏苒 <290648237@qq.com>
// +----------------------------------------------------------------------

namespace axios\tpr\service;

//use axios\tpr\core\Api;

use controller\ApiBase;

/**
 * 新增加的api全局服务
 *
 * Class GlobalService
 * @package axios\tpr\service
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/10/18
 */
class GlobalService extends ApiBase {

    public static function api(){
        return new self();
    }

    public static function set($name,$value){
        // todo debug serialize 如果常量值为数组，将其serialize
        $value = serialize($value);

        define($name,$value);
    }

    public static function get($name=''){
        if(!defined($name)){
            return false;
        }
        $defined = get_defined_constants(true);

        // todo debug unserialize 如果常量值为数组，unserialize
        $defined = unserialize($defined);

        if(isset($defined['user'][$name])){
            return $defined['user'][$name];
        }
        return "";
    }

    private static function name($name=''){
        return "TPR_".strtoupper($name);
    }

    public function __invoke($name='')
    {
        // TODO: Implement __invoke() method.
        return self::get(self::name($name));
    }
}