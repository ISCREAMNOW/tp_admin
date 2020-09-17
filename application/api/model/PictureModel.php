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

namespace app\api\model;

use think\Image;
use think\Model;

/**
 * 公共图片模型
 * Class PictureModel
 * @package app\api\model
 * @author andy <290648237@qq.com>
 * @date 2017/06/02
 */
class PictureModel extends Model
{
    protected $name = 'picture';
//    // 保存自动完成列表
////    protected $auto = [];
//    // 新增自动完成列表
//    protected $insert = ['status' => 1];
//    // 更新自动完成列表
//    protected $update = [];
//    // 是否需要自动写入时间戳 如果设置为字符串 则表示时间字段的类型
////    protected $autoWriteTimestamp = true;
////    // 创建时间字段
////    protected $createTime = 'create_at';
//
//
//    /**
//     * 图片上传成功保存到Picture表
//     * @return mixed
//     */
//    public function uploadAndSaveData()
//    {
//        $setting = [
//            'driver' => sysconf('storage_type'),
//        ];
//
////        if (!request()->isPost()) {
////            die('<form method=post enctype="multipart/form-data">
////            图片（base64） :<input name="image"><br/>
////            图片（file） :<input name="image[]" type="file"><br/>
////        <input type=submit>
////        </form>');
////        }
//
//        if (!request()->isPost()) {
//            $this->error = '未选择文件';
//        }
//
//        if (request()->isPost()) {
//            //todo base64上传方式（主要是为了处理微信不支持 input file）
//            $smeta = request()->param('image');
//
//            if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $smeta, $result)) {//base64上传
//                $data = base64_decode(str_replace($result[1], '', $smeta));
//                $saveName = md5(microtime(true)) .'.' . $result[2];
//                $dataname = 'static' . DS . 'upload' . DS . date('Ymd') . DS . $saveName;
//
//                if (file_put_contents($dataname, $data)) {
//                    // 成功上传后 获取上传信息
//                    $savePath = '/static/upload/'.date('Ymd') . '/';
//                    $size = file_get_contents($dataname);
//
//                    $value['path'] = $savePath.$saveName;
//                    $value['type'] = $setting['driver'];
//                    $value['size'] = format_bytes(strlen($size));
//                    $value['create_at'] = time();
//
//                    if($id = (int)$this->insertGetId($value)) {
//                        $value['id'] = $id;
//                        return $value; //文件上传成功
//                    }else {
//                        $this->error = '数据保存失败';
//                    }
//                }else{
//                    $this->error = '上传出错';
//                }
//            }
//
//
//            // todo 获取表单上传文件
//            $file = request()->file('image');
//
//            // 单图上传
//            $validate = [
//                'size'=>sysconf('upload_image_size'),
//                'ext' => sysconf('upload_image_ext'),
//            ];
//            $info = $file->validate([$validate])->move(ROOT_PATH . 'public' . DS . 'static' . DS . 'upload');
//
//            if($info){
//                // 成功上传后 获取上传信息
//                $savePath = '/static/upload/'.date('Ymd') . '/';
//                $saveName = $info->getFilename();
//                $value['path'] = $savePath.$saveName;
//                $value['type'] = $setting['driver'];
//                $value['size'] = format_bytes($info->getSize());
//                $value['create_at'] = time();
//
//                if($id = (int)$this->insertGetId($value)) {
//                    $value['id'] = $id;
//                    return $value; //文件上传成功
//                }else {
//                    $this->error = '数据保存失败';
//                }
//            }else{
//                // 上传失败获取错误信息
//                $this->error = $file->getError();
//            }
//        }
//
//    }


    /**
     * 等比缩放函数
     *
     * @parem $path 一般是数据库中图片相对路径
     * @parem $size 图片尺寸  $size[width,height?,type?]
     *
     */
    public function imageThumb($url,$size,$name=NULL){
        
        $imagePath = '.'.$url;

        $image = Image::open($imagePath);
        if($name==NULL){
            $name='w'.$size[0];
        }
        $expname = strrchr($imagePath, '.');
        $filename = substr($imagePath, 0, strripos($imagePath, '.'));
        $thumbPath = $filename .'_'.$name. $expname;

        $width = $size[0]?$size[0]:3000;
        $height = $size[1]?$size[1]:2000;
        $type = isset($size[2]) ? $size[2] : 1;

        $image->thumb($width, $height, $type)->save($thumbPath);
        return substr($thumbPath,1);
    }


    /**
     * 图片剪裁,
     * 剪裁后文件名_crop.扩展名
     * @param $path
     * @param $width
     * @param $height
     * @param $x
     * @param $y
     * @return mixed
     */
    public function ImgCorp($path,$width,$height,$x,$y){

        //获取文件后缀
        $ext = get_extension($path);

        $savePath = str_replace($ext,"",$path);
        $savePath = $savePath.time().'.'.$ext;

//        $image = new \Think\Image();
        $image = Image::open($path);
//        $image->open($path);

        $image->crop($width,$height,$x,$y)->save($savePath);

        return str_replace("./","/",$savePath);
    }


    //src 图片完整路径
    //$direction 1顺时针90   2 逆时针90


    /**
     * 图片旋转,旋转图片为原图
     * @param $src
     * @param int $direction
     * @return mixed
     */
    public function imgturn($src,$direction=1)
    {

        $ext = get_extension2($src);

        $domain = strstr($src, '?');
        if($domain){
            $st=strpos($src,"?");
            $src=substr($src, 0, $st);
        }

        switch ($ext) {

            case 'gif':
                $img = imagecreatefromgif($src);
                break;
            case 'jpg':
            case 'jpeg':
                $img = imagecreatefromjpeg($src);
                break;
            case 'png':
                $img = imagecreatefrompng($src);
                break;
            default:
                die('图片格式错误!');
                break;
        }
        $width = imagesx($img);
        $height = imagesy($img);
        $img2 = imagecreatetruecolor($height,$width);
        //顺时针旋转90度
        if($direction==1)
        {
            for ($x = 0; $x < $width; $x++) {
                for($y=0;$y<$height;$y++) {
                    imagecopy($img2, $img, $height-1-$y,$x, $x, $y, 1, 1);
                }
            }
        }else if($direction==2) {
            //逆时针旋转90度
            for ($x = 0; $x < $height; $x++) {
                for($y=0;$y<$width;$y++) {
                    imagecopy($img2, $img, $x, $y, $width-1-$y, $x, 1, 1);
                }
            }
        }
        switch ($ext) {
            case 'jpg':
            case "jpeg":
                imagejpeg($img2, $src, 100);
                break;

            case "gif":
                imagegif($img2, $src, 100);
                break;

            case "png":
                imagepng($img2, $src, 100);
                break;

            default:
                die('图片格式错误!');
                break;
        }
        imagedestroy($img);
        imagedestroy($img2);
        $e='?'.rand(10,99);
        //echo $src.$e;die;
        return str_replace("./","/",$src.$e);
    }
}
