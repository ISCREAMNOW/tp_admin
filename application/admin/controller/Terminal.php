<?php
namespace app\admin\controller;

use controller\BasicAdmin;
use think\Db;

class Terminal extends BasicAdmin{
    /**
     * 指定文档内容表
     * @var string
     */
    public $table='terminal';

    public $tableItem='terminal_data';

    //设备列表
    public function index(){
        $this->title='设备列表';
        $get=$this->request->get();
        $db = Db::name($this->table)->order('id desc');
        // 应用搜索条件
        foreach (['t_code', 'water_quality', 'water_level','type'] as $key) {
            if (isset($get[$key]) && $get[$key] !== '') {
                $db->where($key, 'like', "%{$get[$key]}%")->order("id desc");
            }
        }
        return parent::_list($db, true);
    }

    public function datalist(){
        $postdata=$this->request->param();
        $db = Db::name($this->tableItem);
        $db->where('id',$postdata['id'])->order("add_time desc");
        return parent::_list($db, false);
    }
      /**
     * 根据设备编号搜索
     * @param string 根据设备编号查询
     * @return array|string
     */
    private function _searchByTCode($tmin_code) {
        $terminData = Db::name($this->table)->where('t_code', $tmin_code)->field('t_code')->select();
        $terminIds = [];
        foreach ($terminData as $tmData) {
            $terminIds[] = $tmData['t_code'];

        }
        $terminIdsAddpoint = implode(',', $terminIds);
        return $terminIdsAddpoint;
    }

}