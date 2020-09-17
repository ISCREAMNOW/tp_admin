<?php


namespace app\admin\controller;


use controller\BasicAdmin;
use service\DatabaseService;
use service\LogService;
use think\Db;
use think\Request;

/**
 * 数据库管理
 * Class Database
 * @package app\admin\controller
 * @author andy <290648237@qq.com>
 * @date 2017/05/22
 */
class Database extends BasicAdmin
{
    /**
     * 数据表列表
     * @return mixed
     */
    public function index()
    {
        $this->title = '数据库管理';
        $tables = Db::query('SHOW TABLE STATUS');
        $tables = array_map('array_change_key_case', $tables);
        $total = 0;
        $totalsize = array('table' => 0, 'index' => 0, 'data' => 0, 'free' => 0, 'row' => 0);
        foreach ($tables as $k => $v) {
            $tables[$k]['size'] = format_bytes($v['data_length'] + $v['index_length']);
            $total += $v['data_length'] + $v['index_length'];

            $totalsize['table'] += $v['data_length'] + $v['index_length'];
            $totalsize['data'] += $v['data_length'];
            $totalsize['index'] += $v['index_length'];
            $totalsize['free'] += $v['data_free'];
            $totalsize['row'] += $v['rows'];
        }
        
        $this->assign("list", $tables);
        $this->assign("total", format_bytes($total));
        $this->assign("tables", count($tables));
        $this->assign("totalsize", $totalsize);

        return $this->fetch('', ['title' => $this->title]);
    }

    public function showTableDetail(Request $request)
    {
        $this->title = '数据库管理';
        $table = $request->get('table');
        $tableDetail = Db::query("show full columns from `{$table}`");
        $this->assign('tableDetail', $tableDetail);
//        halt($tableDetail);
        return $this->fetch('show_table_detail',['title' => $this->title]);
    }

    /**
     * 备份记录
     */
    public function records()
    {
        $this->title = '数据库备份记录';

        // 列出备份文件列表
        $path = APP_PATH.sysconf('data_backup_path');

        if(!is_dir($path)){
            mkdir($path, 0755, true);
        }
        $path = realpath($path);
        $flag = \FilesystemIterator::KEY_AS_FILENAME;
        $glob = new \FilesystemIterator($path,  $flag);

        $data_list = [];
        foreach ($glob as $name => $file) {
            if (preg_match('/^\d{8,8}-\d{6,6}-\d+\.sql(?:\.gz)?$/', $name)) {
                $name = sscanf($name, '%4s%2s%2s-%2s%2s%2s-%d');

                $date = "{$name[0]}-{$name[1]}-{$name[2]}";
                $time = "{$name[3]}:{$name[4]}:{$name[5]}";
                $part = $name[6];

                if (isset($data_list["{$date} {$time}"])) {
                    $info = $data_list["{$date} {$time}"];
                    $info['part'] = max($info['part'], $part);
                    $info['size'] = $info['size'] + $file->getSize();
                } else {
                    $info['part'] = $part;
                    $info['size'] = $file->getSize();
                }
                $extension = strtoupper(pathinfo($file->getFilename(), PATHINFO_EXTENSION));
                $info['compress'] = ($extension === 'SQL') ? '-' : $extension;
                $info['time'] = strtotime("{$date} {$time}");
                $info['name'] = $info['time'];

                $data_list["{$date} {$time}"] = $info;
            }
        }

        return $this->fetch('', ['title' => $this->title, 'list' => $data_list]);
    }

    /**
     * 下载备份文件
     * @return array|mixed|string
     */
//    public function download()
//    {
//        $backSql = new Baksql();
//        $name = date('Ymd-His', $this->request->param('id')) . '-*.sql*';
//
//        return $backSql->downloadFile($name);
//    }

    /**
     * 备份数据库
     * (参考oneThink 麦当苗儿 <zuojiazi@vip.qq.com>)
     * @param integer $start 起始行数
     * @param int $start
     */
    public function export($start = 0)
    {
        $tables = explode(',', $this->request->param('id'));

        if ($this->request->isPost() && !empty($tables) && is_array($tables)) {
            // 初始化
            $path = APP_PATH.sysconf('data_backup_path');
            if(!is_dir($path)){
                mkdir($path, 0755, true);
            }

            // 读取备份配置
            $config = array(
                'path'     => realpath($path) . DIRECTORY_SEPARATOR,
                'part'     => sysconf('data_backup_part_size'),
                'compress' => sysconf('data_backup_compress'),
                'level'    => sysconf('data_backup_compress_level'),
            );

            // 检查是否有正在执行的任务
            $lock = "{$config['path']}backup.lock";
            if(is_file($lock)){
                $this->error('检测到有一个备份任务正在执行，请稍后再试！');
            } else {
                // 创建锁文件
                file_put_contents($lock, $this->request->time());
            }

            // 检查备份目录是否可写
            is_writeable($path) || $this->error('备份目录不存在或不可写，请检查后重试！');

            // 生成备份文件信息
            $file = array(
                'name' => date('Ymd-His', $this->request->time()),
                'part' => 1,
            );

            // 创建备份文件
            $Database = new DatabaseService($file, $config);
            if(false !== $Database->create()){
                // 备份指定表
                foreach ($tables as $table) {
                    $start = $Database->backup($table, $start);
                    while (0 !== $start) {
                        if (false === $start) { // 出错
                            $this->error('备份出错！');
                        }
                        $start = $Database->backup($table, $start[0]);
                    }
                }

                // 备份完成，删除锁定文件
                unlink($lock);
                // 记录行为
                LogService::write('数据库备份', '数据库备份成功');
                $this->success('备份完成！', '');
            } else {
                $this->error('初始化失败，备份文件创建失败！');
            }
        } else {
            $this->error('参数错误！');
        }
    }

    /**
     * 还原数据库
     * (参考oneThink 麦当苗儿 <zuojiazi@vip.qq.com>)
     */
    public function import()
    {
        $time = $this->request->param('id');

        if ($time === 0) $this->error('参数错误！');

        // 初始化
        $pt = sysconf('data_backup_path'); //默认目录
        $name  = date('Ymd-His', $time) . '-*.sql*';
        $path  = realpath($pt) . DIRECTORY_SEPARATOR . $name;

        $files = glob($path);
        $list  = array();
        foreach($files as $name){
            $basename = basename($name);
            $match    = sscanf($basename, '%4s%2s%2s-%2s%2s%2s-%d');
            $gz       = preg_match('/^\d{8,8}-\d{6,6}-\d+\.sql.gz$/', $basename);
            $list[$match[6]] = array($match[6], $name, $gz);
        }
        ksort($list);

        // 检测文件正确性
        $last = end($list);halt($list);
        if(count($list) === $last[0]){
            foreach ($list as $item) {
                $config = [
                    'path'     => realpath($pt) . DIRECTORY_SEPARATOR,
                    'compress' => $item[2]
                ];
                $Database = new DatabaseService($item, $config);
                $start = $Database->import(0);

                // 循环导入数据
                while (0 !== $start) {
                    if (false === $start) { // 出错
                        $this->error('还原数据出错！');
                    }
                    $start = $Database->import($start[0]);
                }
            }
            // 记录行为
            LogService::write('数据库还原', '数据库还原成功');
            $this->success('还原完成！', '');
        } else {
            $this->error('备份文件可能已经损坏，请检查！');
        }
    }

    /**
     * 优化表
     */
    public function optimize()
    {
        $tables = explode(',', $this->request->param('id'));
        if($tables) {
            if(is_array($tables)){
                $tables = implode('`,`', $tables);
                $list   = Db::query("OPTIMIZE TABLE `{$tables}`");

                if($list){
                    // 记录行为
                    LogService::write('数据表优化', "`{$tables}`优化完成！");
                    $this->success("数据表优化完成！", '');
                } else {
                    $this->error("数据表优化出错请重试！");
                }
            } else {
                $list = Db::query("OPTIMIZE TABLE `{$tables}`");
                if($list){
                    // 记录行为
                    LogService::write('数据表优化', "`{$tables}`优化完成！");
                    $this->success("数据表'{$tables}'优化完成！", '');
                } else {
                    $this->error("数据表'{$tables}'优化出错请重试！");
                }
            }
        } else {
            $this->error("请选择要优化的表！");
        }
    }

    /**
     * 修复表
     */
    public function repair()
    {
        $tables = explode(',', $this->request->param('id'));
        if($tables) {
            if(is_array($tables)){
                $tables = implode('`,`', $tables);
                $list = Db::query("REPAIR TABLE `{$tables}`");

                if($list){
                    // 记录行为
                    LogService::write('数据表修复', "`{$tables}`");
                    $this->success("数据表修复完成！", '');
                } else {
                    $this->error("数据表修复出错请重试！");
                }
            } else {
                $list = Db::query("REPAIR TABLE `{$tables}`");
                if($list){
                    // 记录行为
                    LogService::write('数据表修复', '{$tables}修复完成！');
                    $this->success("数据表'{$tables}'修复完成！", '');
                } else {
                    $this->error("数据表'{$tables}'修复出错请重试！");
                }
            }
        } else {
            $this->error("请指定要修复的表！");
        }
    }

    /**
     * 删除备份文件
     */
    public function del()
    {
        $ids = $this->request->param('id');
        if ($ids == 0) $this->error('参数错误！');

        $name  = date('Ymd-His', $ids) . '-*.sql*';
        $pt = sysconf('data_backup_path'); //默认目录
        $path  = realpath($pt) . DIRECTORY_SEPARATOR . $name;
        array_map("unlink", glob($path));
        if(count(glob($path))){
            $this->error('备份文件删除失败，请检查权限！');
        } else {
            // 记录行为
            LogService::write('数据库备份删除', date('Ymd-His', $ids).' 删除成功');
            $this->success('备份文件删除成功！', '');
        }
    }
}
