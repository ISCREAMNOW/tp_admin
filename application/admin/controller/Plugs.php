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
use service\FileService;

/**
 * 插件助手控制器
 * Class Plugs
 * @package app\admin\controller
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/02/21
 */
class Plugs extends BasicAdmin
{

    /**
     * 文件上传
     * @return \think\response\View
     */
    public function upfile()
    {
        $uptype = $this->request->get('uptype');
        $path = $this->request->get('path', 'picture');

        if (!in_array($uptype, ['local', 'qiniu', 'oss'])) {
            $uptype = sysconf('storage_type');
        }
        $mode = $this->request->get('mode', 'one');
        $types = $this->request->get('type', 'jpg,png');
        $this->assign('mimes', FileService::getFileMine($types));
        $this->assign('field', $this->request->get('field', 'file'));
        return view('', ['mode' => $mode, 'types' => $types, 'uptype' => $uptype, 'path' => $path]);
    }

    /**
     * 通用文件上传
     * @return \think\response\Json
     */
    public function upload()
    {
        $file = $this->request->file('file');
        $ext = pathinfo($file->getInfo('name'), 4);
        $md5 = str_split($this->request->post('md5'), 16);
        $filename = join('/', $md5) . ".{$ext}";

        // 文件上传Token验证
        if ($this->request->post('token') !== md5($filename . session_id())) {
            return json(['code' => 'ERROR', '文件上传验证失败']);
        }

        // 设置文件上传目录
        $path = $this->request->param('path');

        $fileType = explode('.', $this->request->post('key'));
        $fileType = $fileType[1];
        if ($fileType == 'mp3') {
            // 音乐
            $savePath = 'music';
        }elseif ($fileType == 'mp4') {
            // 视频
            $savePath = 'videos';
        }elseif ($fileType == 'apk') {
            // 文件
            $savePath = 'files';
        }else {
            $savePath = $path;
        }

        $setting = [
            'driver' => sysconf('storage_type'),
            'root_path' => './static/upload/'.$savePath.'/' // 图片保存路径 默认为'./static/upload/picture/'
        ];
        // 创建目录
        if(!is_dir($setting['root_path'])) {
            @mkdir($setting['root_path'], 0777);
        }

        $info = $this->request->file('file')->move($setting['root_path'].DS.date('Ymd'), $md5[0], true);
        if($info){
            // 成功上传后 获取上传信息
            $savePath = substr($setting['root_path'], 1).date('Ymd').'/';
            $saveName = $info->getFilename();
            return json(['data' => ['site_url' => $savePath.$saveName], 'code' => 'SUCCESS']);
        }else{
            // 上传失败获取错误信息
            return json(['code' => 'ERROR', 'message' => $this->request->file('file')->getError()]);
        }
    }

    /**
     * 文件状态检查
     */
    public function upstate()
    {
        $post = $this->request->post();
        $filename = join('/', str_split($post['md5'], 16)) . '.' . pathinfo($post['filename'], PATHINFO_EXTENSION);
        // 检查文件是否已上传
//        if (($site_url = FileService::getFileUrl($filename))) {
//            $this->result(['site_url' => $site_url], 'IS_FOUND');
//        }
        // 需要上传文件，生成上传配置参数
        $config = ['uptype' => $post['uptype'], 'file_url' => $filename];
        switch (strtolower($post['uptype'])) {
            case 'qiniu':
                $config['server'] = FileService::getUploadQiniuUrl(true);
                $config['token'] = $this->_getQiniuToken($filename);
                break;
            case 'local':
                $config['server'] = FileService::getUploadLocalUrl();
                $config['token'] = md5($filename . session_id());
                break;
            case 'oss':
                $time = time() + 3600;
                $policyText = [
                    'expiration' => date('Y-m-d', $time) . 'T' . date('H:i:s', $time) . '.000Z',
                    'conditions' => [['content-length-range', 0, 1048576000]],
                ];
                $config['policy'] = base64_encode(json_encode($policyText));
                $config['server'] = FileService::getUploadOssUrl();
                $config['site_url'] = FileService::getBaseUriOss() . $filename;
                $config['signature'] = base64_encode(hash_hmac('sha1', $config['policy'], sysconf('storage_oss_secret'), true));
                $config['OSSAccessKeyId'] = sysconf('storage_oss_keyid');
        }
        $this->result($config, 'NOT_FOUND');
    }

    /**
     * 生成七牛文件上传Token
     * @param string $key
     * @return string
     */
    protected function _getQiniuToken($key)
    {
        $host = sysconf('storage_qiniu_domain');
        $bucket = sysconf('storage_qiniu_bucket');
        $accessKey = sysconf('storage_qiniu_access_key');
        $secretKey = sysconf('storage_qiniu_secret_key');
        $protocol = sysconf('storage_qiniu_is_https') ? 'https' : 'http';
        $params = [
            "scope"      => "{$bucket}:{$key}", "deadline" => 3600 + time(),
            "returnBody" => "{\"data\":{\"site_url\":\"{$protocol}://{$host}/$(key)\",\"file_url\":\"$(key)\"}, \"code\": \"SUCCESS\"}",
        ];
        $data = str_replace(['+', '/'], ['-', '_'], base64_encode(json_encode($params)));
        return $accessKey . ':' . str_replace(['+', '/'], ['-', '_'], base64_encode(hash_hmac('sha1', $data, $secretKey, true))) . ':' . $data;
    }

    /**
     * 字体图标选择器
     * @return \think\response\View
     */
    public function icon()
    {
        $field = $this->request->get('field', 'icon');
        return view('', ['field' => $field]);
    }

}
