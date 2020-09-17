<?php



namespace app\lib\exception;

use think\Exception;


/**
 * api异常处理基类
 *
 * Class BaseException
 * @package app\api\controller
 * @author 雲溪荏苒 <290648237@qq.com>
 * @date 2017/10/18
 */
class BaseException extends Exception
{
    // HTTP 状态码 404 200
    public $code;

    // 错误具体信息
    public $msg; // TODO 最好定义成英文

    // 自定义的错误码
    public $errorCode;

    /**
     * 异常处理基类构造函数
     * BaseException constructor.
     * @param string $msg
     * @param int $code
     * @param int $errorCode
     */
    public function __construct($msg = '参数错误', $code = 400, $errorCode = 10000)
    {
        $this->msg = $msg;
        $this->code = $code;
        $this->errorCode = $errorCode;
    }
}