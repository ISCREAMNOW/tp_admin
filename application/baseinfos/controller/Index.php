<?php


namespace app\baseinfos\controller;


use think\Controller;
use think\Db;

class Index extends Controller
{
    //表名
    public $table="";
    //读取数据并返回到前端
   public function index(){
       //实例化数据构造器
       $db=Db::name($this->table);
       //查询数据库表，并返回结果
       $res=$db->select();
      return json($res);
   }
}