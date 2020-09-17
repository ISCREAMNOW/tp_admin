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

use think\Db;

/**
 * get_pic_src   渲染图片链接
 * @param $path
 * @return mixed
 */
function get_pic_src($path)
{
    //不存在http://
    $not_http_remote = (strpos($path, 'http://') === false);
    //不存在https://
    $not_https_remote = (strpos($path, 'https://') === false);
    if ($not_http_remote && $not_https_remote) {
        //本地url
        // TODO 防止双斜杠？？？
        return $path;

//        return str_replace('//', '/', get_root_url() . $path); //防止双斜杠的出现
    } else {
        //远端url

        return $path;
    }
}

/**
 * 根据图片完整/不完整路径获取不带域名的图片路径
 * @param string $url 图片路径
 * @return mixed
 */
function get_image_path_url($url) {
    return parse_url($url)['path'];
}


/**
 * 通过id获取picture库内的图片地址
 * @param int $id
 * @param int $default_pid
 * @return mixed
 */
function get_pic_by_id($id, $default_pid = 0){
    $path = Db::name('picture')->where('id', $id)->value('path');
    if(!$path){
        $path = Db::name('picture')->where('id', $default_pid)->value('path');
    }
    $resPath =  $path; //get_pic_src($path);
    return $resPath;
}

function get_pic_id_by_path($path) {

    return Db::name('picture')->where('path', $path)->value('id');
}

/** 不兼容sae 只兼容本地 todo 废弃
 * @param        $filename
 * @param int $width
 * @param string $height
 * @param int $type
 * @param bool $replace
 * @return mixed|string
 */
function getThumbImage($filename, $width = 100, $height = 'auto', $type = 0, $replace = false)
{
    $UPLOAD_URL = '';
    $UPLOAD_PATH = '';
    $filename = str_ireplace($UPLOAD_URL, '', $filename); //将URL转化为本地地址
    $info = pathinfo($filename);
    $oldFile = $info['dirname'] . DIRECTORY_SEPARATOR . $info['filename'] . '.' . $info['extension'];
    $thumbFile = $info['dirname'] . DIRECTORY_SEPARATOR . $info['filename'] . '_' . $width . '_' . $height . '.' . $info['extension'];

    $oldFile = str_replace('\\', '/', $oldFile);
    $thumbFile = str_replace('\\', '/', $thumbFile);

    $filename = ltrim($filename, '/');
    $oldFile = ltrim($oldFile, '/');
    $thumbFile = ltrim($thumbFile, '/');

    if (!file_exists($UPLOAD_PATH . $oldFile)) {
        //原图不存在直接返回
        @unlink($UPLOAD_PATH . $thumbFile);
        $info['src'] = $oldFile;
        $info['width'] = intval($width);
        $info['height'] = intval($height);
        return $info;
    } elseif (file_exists($UPLOAD_PATH . $thumbFile) && !$replace) {
        //缩图已存在并且  replace替换为false
        $imageinfo = getimagesize($UPLOAD_PATH . $thumbFile);
        $info['src'] = $thumbFile;
        $info['width'] = intval($imageinfo[0]);
        $info['height'] = intval($imageinfo[1]);
        return $info;
    } else {
        //执行缩图操作
        $oldimageinfo = getimagesize($UPLOAD_PATH . $oldFile);
        $old_image_width = intval($oldimageinfo[0]);
        $old_image_height = intval($oldimageinfo[1]);
        if ($old_image_width <= $width && $old_image_height <= $height) {
            @unlink($UPLOAD_PATH . $thumbFile);
            @copy($UPLOAD_PATH . $oldFile, $UPLOAD_PATH . $thumbFile);
            $info['src'] = $thumbFile;
            $info['width'] = $old_image_width;
            $info['height'] = $old_image_height;
            return $info;
        } else {
            if ($height == "auto") $height = $old_image_height * $width / $old_image_width;
            if ($width == "auto") $width = $old_image_width * $width / $old_image_height;
            if (intval($height) == 0 || intval($width) == 0) {
                return 0;
            }

            // 生成缩略图
            $fileMd5 = $info['filename'];
            $fileExt = $info['extension'];
            $thumbPath = '/static/upload/picture/thumb/';

            $thumbType = sysconf('upload_image_thumb_type');

            $image = \think\Image::open('./'.$filename);
            $thumbSaveName = $fileMd5.'_'.$width.'_'.$height.'.'.$fileExt;

            $image->thumb($width,$height, $thumbType)->save('.'.$thumbPath.$thumbSaveName);
            $info['src'] = $thumbFile;
            $info['width'] = $old_image_width;
            $info['height'] = $old_image_height;

            return $info;

        }
    }
}

/**
 * 把图片数组转换成oss图片样式
 * size[0] 宽度
 * size[1] 高度
 * size[2] 1等比例缩放；2缩放后填充；3居中裁剪；4左上角裁剪；5右下角裁剪；6固定尺寸缩放；
 * @param $size
 * @return string
 */
function get_img_style($size){
    if($size[0]&&$size[1]&&!$size[2]){
        $size[2] = 3;
    }
    switch ($size[2]){
        case 1:
            return $size[1].'h_'.$size[0].'w';
            break;
        case 2:
            return $size[1].'h_'.$size[0].'w_4e';
            break;
        case 3:
            return $size[1].'h_'.$size[0].'w_1e_1c';
            break;
        case 4:
            return $size[0].'x'.$size[1].'-1rc';
            break;
        case 5:
            return $size[0].'x'.$size[1].'-9rc';
            break;
        case 6:
            return $size[1].'h_'.$size[0].'w_2e';
            break;
        default:
            return $size[0].'w';
            break;
    }

}

/**
 * 不管默认值,用图片地址和style拼接图片地址
 * @param string $path 图片地址
 * @param string $style 带连接符的图片style或styleName
 * @return string
 */
function quick_pic_thumb($path, $style='@200w_200h'){

    $name = substr($style, 1);
    $sizeArr = explode('_',preg_replace("|[a-z]|is","", $name));

    // 设置默认图片高度为图片的宽度 默认裁剪类型为 3
    if($sizeArr[0] && !isset($sizeArr[1])) {
        $sizeArr[1] = $sizeArr[0];
        $sizeArr[2] = 3;
    }
    // 设置默认裁剪类型为 3
    if($sizeArr[0] && $sizeArr[1] && !isset($sizeArr[2])){
        $sizeArr[2] = 3;
    }
    $url = pic_thumb($path,$sizeArr, $name);
    
    return get_url_with_domain($url);
//    $hasHttp = strpos($url,'ttp');

//    if(!$hasHttp){
//        return get_root_url().$url;
//    }else{
//        return $url;
//    }
}

/**
 * 图片生成缩略图
 * @param string $url 图片地址 以/Uploads开头
 * @param string $sizeArr 裁剪尺寸 $size[width,height?,type?] type是裁剪方式1~6
 * @param string $name 缩略图标识 如w680,48x48
 * @return mixed
 */
function pic_thumb($url,$sizeArr,$name){

    // 将图片域名去除
    $url = get_image_path_url($url);

    //按宽度选择不同的默认图片
    if($sizeArr[0]>1200){
        $defaultUrl='/static/upload/picture/default/lg.png';
    }elseif($sizeArr[0]<=1200 && $sizeArr[0]>960){
        $defaultUrl='/static/upload/picture/default/md.png';
    }elseif($sizeArr[0]<=960 && $sizeArr[0]>128){
        $defaultUrl='/static/upload/picture/default/sm.png';
    }elseif($sizeArr[0]<=128 && $sizeArr[0]==$sizeArr[1]){
        $defaultUrl='/static/upload/picture/default/ua.png';
    }else{
        $defaultUrl='/static/upload/picture/default/xs.png';
    }

    $expname = strrchr($url, '.');
    $filename = substr($url, 0, strripos($url, '.'));
    $thumbUrl = $filename . '_'. $name . $expname;
    $thumbPath = '.'.$thumbUrl;

    // 检查文件是否存在
    if(is_file($thumbPath)){
        return get_pic_src($thumbUrl);
    }else{
        $path = '.'.$url;
        if(!is_file($path)){
            $url = $defaultUrl;
            $defaultExpname = strrchr($defaultUrl, '.');
            $defaultFilename = substr($defaultUrl, 0, strripos($defaultUrl, '.'));
            $defaultThumbUrl = $defaultFilename . '_'. $name . $defaultExpname ;
            $defaultThumbPath = '.'.$defaultThumbUrl;
            if(is_file($defaultThumbPath)){
                return get_pic_src($defaultThumbUrl);
            }
        }
        $pictureModel = new \app\api\model\PictureModel();
        $thumbUrl = $pictureModel->imageThumb($url,$sizeArr,$name);
        return get_pic_src($thumbUrl);
    }


}

/**
 * 根据图片ID获取图片路径并生成缩略图
 * @param $id
 * @param $sizeArr
 * @param $name
 * @return mixed
 */
function pic_thumb_byid($id,$sizeArr,$name){
    $url = db('picture')->where('id', $id)->value('path');
    $res = pic_thumb($url,$sizeArr,$name);
    return get_pic_src($res);
}

/* 带限制时间的下载图片到服务器 */
function curl_get_img($url,$path,$timeout=2) {
    $curlHandle = curl_init();
    curl_setopt( $curlHandle , CURLOPT_URL, $url );
    curl_setopt( $curlHandle , CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt( $curlHandle , CURLOPT_TIMEOUT, $timeout );
    $file = curl_exec( $curlHandle );
    curl_close( $curlHandle );
//    dump($path);die;
    if($file) {
        //保存图片到服务器
        $tp = @fopen($path, 'a');
        $res = fwrite($tp, $file);
        fclose($tp);
        if ($res) {
            return substr($path, 1);
        } else {
            return false;
        }
    }else{
        return false;
    }
}

/**
 * 下载文件到本地
 * @param string $url 文件url
 * @param string $savePath 保存路径
 * @return bool|string
 */
function download_file($url, $savePath) {
    // 将文件保存到本地
    $baseName = basename($url);

    // 创建目录
    if(!is_dir('./'.$savePath)) {
        @mkdir('./'.$savePath, 0777);
    }
    $path = $savePath.$baseName;

    $saveName = curl_get_img($url,$path); // 保存文件到本地
    return $saveName;
}