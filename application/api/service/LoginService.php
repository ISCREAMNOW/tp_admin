<?php
/**
 * @author: Axios
 *
 * @email: axioscros@aliyun.com
 * @blog:  http://hanxv.cn
 * @datetime: 2017/4/26 10:46
 */
namespace app\api\service;

use axios\tpr\service\ToolService;
use think\Config;

class LoginService {
    public static function login($user){
        $token = ToolService::token($user['member_name']);
        $time = time();
        $ip = get_client_ip();
        $data = [
            'member_token'=>$token,
            'member_old_login_ip'=>$ip,
            'member_old_login_time'=>$time
        ];
//        dump($data);die;
        if(model('member')->updateUser($data,$user['member_id'])){
            return self::doLogin($user['member_id'],$token);
        }
        return 500;
    }

    public static function doLogin($user_id,$token){
        $user = model('member')->findUser($user_id/*,'',"member_id , member_name  , nick_name  , member_token"*/);

        if(empty($user['member_sex'])) {
            $user['member_sex'] = 0;
        }
        $setting_token = Config::get('setting.token');
        $expire = isset($setting_token['token_expire'])?$setting_token['token_expire']:3600;
        UserService::setToken($token,$user,$expire);
//        unset($user['member_id']);
        unset($user['member_passwd'], $user['member_uniq']);
        return $user;
    }
}