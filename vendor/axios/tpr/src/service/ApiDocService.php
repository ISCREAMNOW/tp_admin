<?php
// +----------------------------------------------------------------------
// | TPR [ Design For Api Develop ]
// +----------------------------------------------------------------------
// | Copyright (c) 2017-2017 http://hanxv.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: axios <axioscros@aliyun.com>
// +----------------------------------------------------------------------

namespace axios\tpr\service;

use think\Route;

class ApiDocService{
    public static function api($module = '', $class = '', $hiddenClass = '', $hiddenMethod = []){
        // 设置默认扫描路径为整个项目目录
        $scanDir = APP_PATH;

        if ($module != '') {
            // 设置扫描路径为某个模块下的类文件
            $scanDir = APP_PATH.'/'.$module;
        }

        $ApiClass = self::scanApiClass($scanDir);

        $list = [];$n=0;

        if(!empty($class)){
            $apiClass = "app\\".$module."\\controller\\".$class;
            $list = self::makeClassDoc($apiClass, $hiddenMethod);
        }else{

            foreach ($ApiClass as $k=>$api){
                $apiArray = explode('\\', $api);
                $moduleName = $apiArray['1'];
                $className = $apiArray['3'];

                if(!empty($module)){
                    // 根据api类名查询接口
                    if (is_array($hiddenClass)) {
                        $classCondition = !in_array($className, $hiddenClass);
                    }else {
                        $classCondition = $className != $hiddenClass;
                    }

                    if($module == $moduleName && $classCondition){
                        $doc =  self::makeClassDoc($api, $hiddenMethod);
                        if(!empty($doc) && $doc['package'] != '@package'){
                            $list[$n++] = $doc;
                        }
                    }
                }else{
                    $doc =  self::makeClassDoc($api, $hiddenMethod);
                    if(!empty($doc) && $doc['package'] != '@package'){
                        $list[$n++] = $doc;
                    }
                }
            }

        }

        return $list;
    }

    public static function makeClassDoc($class='', $hideMethod = []){
        $doc = [];
        if(class_exists($class)){
            $reflectionClass = new \ReflectionClass($class);
            $doc['name'] = $reflectionClass->name;
            $doc['file_name'] = $reflectionClass->getFileName();
            $doc['short_name'] = $reflectionClass->getShortName();
            $comment = self::trans($reflectionClass->getDocComment());
            $doc['title'] = $comment['title'];
            $doc['desc'] = $comment['desc'];
            $doc['package']=$comment['package'];
            $_getMethods = $reflectionClass->getMethods(\ReflectionMethod::IS_PUBLIC);
            $methods = [];$m=0;
            foreach ($_getMethods as $key=>$method){
                // 过滤__construct 等特殊方法
                if(in_array($method->name, $hideMethod)) {
                    continue;
                }
                if($method->class==$class){
                    $methods[$m] = self::makeMethodDoc($class,$method->name);
                    $m++;
                }
            }
            $doc['methods'] = $methods;
        }
        return $doc;
    }

    public static function makeMethodDoc($class,$method_name){
        $reflectionClass = new \ReflectionClass($class);
        $method = $reflectionClass->getMethod($method_name);
        $temp = explode("\\",$class);
        $m = [];
        $m['name'] = $method->name;
        $m['path'] = strtolower($temp[1])."/".strtolower($temp[3])."/".$method->name;
        $rule =  Route::name($m['path']);
        $route = '';
        if(!empty($rule)){
            $route = $rule[0][0];
        }
        $m['route'] = $route;
        $method_comment = self::trans($method->getDocComment());
        $m['title'] = $method_comment['title']=="@title"?$method->name:$method_comment['title'];
        $m['desc'] = $method_comment['desc']=="@desc"?"":$method_comment['desc'];
        $m['method'] = $method_comment['method']=="@method"?"":strtoupper($method_comment['method']);
        $m['parameter'] = $method_comment['parameter'];
        $m['response'] = $method_comment['response'];

//        dump($m);
        // 新增方法是否需要登录验证参数
        $m['token_auth'] = false;
        foreach ($m['parameter'] as $p) {
            if (array_search('token', $p)) {
                $m['token_auth'] = true;
                break;
            }
        }

        return $m;
    }

    public static function trans($comment){
        $title  = '@title';
        $desc   = '@desc';
        $method = '';
        $package= '@package';
        $param  = [];
        $param_count  = 0;
        $response = [];
        $response_count = 0;


        $docComment = $comment;
        if ($docComment !== false) {
            $docCommentArr = explode("\n", $docComment);
            $comment = trim($docCommentArr[1]);
            $title = trim(substr($comment, strpos($comment, '*') + 1));

            foreach ($docCommentArr as $comment) {
                //@desc
                $pos = stripos($comment, '@desc');
                if ($pos !== false) {
                    $desc = trim(substr($comment, $pos + 5));
                }

                //@package
                $pos = stripos($comment, '@package');
                if ($pos !== false) {
                    $package = trim(substr($comment, $pos + 8));
                }

                //@method
                $pos = stripos($comment, '@method');
                if ($pos !== false) {
                    $method = trim(substr($comment, $pos + 8));
                }

                //@response
                $pos = stripos($comment, '@response');
                if($pos !== false){
                    $temp = explode(" ",trim(substr($comment,$pos + 9)));
                    $tn = 0;$tt=[];
                    foreach ($temp as $k=>$t){
                        if(empty($t)){
                            unset($temp[$k]);
                        }else{
                            $tt[$tn++]=$t;
                        }
                    }
                    $temp = $tt;
                    $response[$response_count]['type'] = isset($temp[0]) ?LangService::trans($temp[0]):"";
                    $response[$response_count]['name'] = isset($temp[1]) ?$temp[1]:"";
                    $response[$response_count]['info'] = isset($temp[2]) ?$temp[2]:"";
                    $response_count++;
                }

                //@parameter
                $pos = stripos($comment, '@parameter');
                if($pos !== false){
                    $temp = explode(" ",trim(substr($comment,$pos + 10)));
                    $tn = 0;$tt=[];
                    foreach ($temp as $k=>$t){
                        if(empty($t)){
                            unset($temp[$k]);
                        }else{
                            $tt[$tn++]=$t;
                        }
                    }
                    $temp = $tt;
                    $param[$param_count]['type'] = isset($temp[0]) ?LangService::trans($temp[0]):"";
                    $param[$param_count]['name'] = isset($temp[1]) ?$temp[1]:"";
                    $param[$param_count]['info'] = isset($temp[2]) ?$temp[2]:"";
                    $param_count++;
                }
            }
        }

        $comment = [
            'title' => $title,
            'desc'  => $desc,
            'package'=>$package,
            'parameter' => $param,
            'method'=>$method,
            'response'=>$response
        ];

        return $comment;
    }

    public static function deepScanDir($dir) {
        $fileArr = array ();
        $dirArr = array ();
        $dir = rtrim($dir, '//');
        if (is_dir($dir)) {
            $dirHandle = opendir($dir);
            while (false !== ($fileName = readdir($dirHandle))) {
                $subFile = $dir . DIRECTORY_SEPARATOR . $fileName;
                if (is_file($subFile)) {
                    $fileArr[] = $subFile;
                }
                elseif (is_dir($subFile) && str_replace('.', '', $fileName) != '') {
                    $dirArr[] = $subFile;
                    $arr = self::deepScanDir($subFile);
                    $dirArr = array_merge($dirArr, $arr['dir']);
                    $fileArr = array_merge($fileArr, $arr['file']);
                }
            }
            closedir($dirHandle);
        }
        return array (
            'dir' => $dirArr,
            'file' => $fileArr
        );
    }

    public static function scanApiClass($scanDir = APP_PATH){
        $scan = self::deepScanDir($scanDir);
        $files = $scan['file'];
        foreach ($files as $k=>$f){
            if(strpos($f,"app")!==false && strpos($f,"controller")!==false && strpos($f,"common")===false){
                require_once $f;
            }
        }
        $class = get_declared_classes();
        $n=0;$ApiList = [];
        foreach ($class as $k=>$c){
            if(strpos($c,"app")!==false && strpos($c,"controller")!==false && strpos($c,"common")===false && strpos($c,'admin')===false){
                $ApiList[$n++]=$c;
            }
        }
        return $ApiList;
    }
}