<?php


namespace app\admin\controller;

use controller\BasicAdmin;
use service\LogService;
use think\Db;

/**
 * 文章管理
 * Article
 * @package app\admin\controller
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/11/18
 */
class BasedInfos extends BasicAdmin
{
    /**
     * 当前默认数据模型
     * @var string
     */
    public $table = 'BasedInfo';
     /**
     * 当前页面标题
     * @var string
     */
    public $title = '项目信息';
    public function index()
    {
        if(!$this->request->isPost()){
        $conts=Db::name($this->table)->where('type',0)->select();
        $pic_url=Db::name($this->table)->where('type',1)->select();
        $this->assign(['datalist'=>$conts,'picurl'=>$pic_url]);
        return $this->fetch('');
        }else{
            $postData = $this->request->post();
            $conts=$postData['info_data'];
            $pic_url=$postData['info_url'];
            if(!is_null($conts)){
                $res_data=Db::name($this->table)->where('type',0)->update(['contents'=>$conts]);
            }
            if($pic_url!=''){
                $res_pic=Db::name($this->table)->where('type',1)->update(['contents'=>$pic_url]);
            }
            if($res_data!=1){
                $this->error('简介更新失败');
            }
            if($res_pic!=1){
                $this->error('示意图片更新失败');
            }
            $this->success('修改成功！', '');
            
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
    
}
