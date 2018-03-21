<?php
/**
 * Created by gaorenhua.
 * User: 597170962 <597170962@qq.com>
 * Date: 2015/6/28
 * Time: 0:19
 */

namespace Home\Controller;
use Think\Controller;

/**
 * Class LoginController
 * @package Home\Controller
 */
class LoginController extends Controller {
    /**
     * 用户登录
     */
    public function login()
    {
        // 判断提交方式
        if (IS_POST) {
            // 实例化Login对象
            $login = D('login');

            // 自动验证 创建数据集
            if (!$data = $login->create()) {
                // 防止输出中文乱码
                header("Content-type: text/html; charset=utf-8");
                exit($login->getError());
            }

            // 组合查询条件
            $where = array();
            $where['mobile'] = $data['mobile'];
            $result = $login->where($where)->field('id,username,password,lastdate,lastip')->find();
            // 验证用户名 对比 密码
            if ($result && $result['password'] == $result['password']) {
                // 存储session
                session('uid', $result['id']);          // 当前用户id
                session('nickname', $result['nickname']);   // 当前用户昵称
                session('username', $result['username']);   // 当前用户名
                session('lastdate', $result['lastdate']);   // 上一次登录时间
                session('lastip', $result['lastip']);       // 上一次登录ip

                // 更新用户登录信息
                $where['id'] = session('uid');
                M('users')->where($where)->setInc('loginnum');   // 登录次数加 1
                M('users')->where($where)->save($data);   // 更新登录时间和登录ip

                $this->success('登录成功,正跳转至系统首页...', U('Index/index'));
            } else {
                $this->error('登录失败,用户名或密码不正确!');
            }
        } else {
            $this->display();
        }
    }

    /**
     * 用户注册
     */
    public function register(){
        // 判断提交方式 做不同处理103795
        if (IS_POST) {
            if(session('verify_no') != $_POST['verify_no']){
                $this->error('验证码错误！');
            }
            // 实例化User对象
            $user = D('users');

            // 自动验证 创建数据集
            if (!$data = $user->create()) {
                // 防止输出中文乱码
                header("Content-type: text/html; charset=utf-8");
                $result['info'] = $user->getError();
                $result['status'] = false;
                $this->ajaxReturn($result);
            }
            //插入数据库
            if ($id = $user->add($data)) {
                $result['info'] = '成功！';
                $result['status'] = true;
            } else {
                $result['info'] = '失败！';
                $result['status'] = false;
            }
                $this->ajaxReturn($result);
        } else {
            $this->display();
        }
    }
    
    function check_num($mobile){
        $rand_string = $this->rand_string('6',1);
		session('verify_no',$rand_string);
		session('mobile',$mobile);
				
		$key = strtoupper(md5($mobile.'RfdSms@MD5Key'));
		
		$json_str = '<?xml version="1.0" encoding="utf-8" ?>
<SendSms>
	<Subject>青旅物流</Subject>
	<Content>【青旅物流】您的验证码为：[' . $rand_string . '],请在一分钟内填写。</Content>
	<Department>神约科技</Department>
	<Mobile>' . $mobile .'</Mobile>
	<Key>' . $key . '</Key>
	<DistributionCode>rfd</DistributionCode>
</SendSms>';

		$curl = curl_init();
		curl_setopt_array($curl, array(
		      CURLOPT_URL => "http://smsapi.tswlsys.com/smsSend/SendSms",
		      CURLOPT_RETURNTRANSFER => true,
		      CURLOPT_ENCODING => "",
		      CURLOPT_MAXREDIRS => 10,
		      CURLOPT_TIMEOUT => 30,
		      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		      CURLOPT_CUSTOMREQUEST => "POST",
		      CURLOPT_POSTFIELDS => $json_str,
		      CURLOPT_HTTPHEADER => array(
		              "cache-control: no-cache",
		              "content-type: application/json",
		            ),
		    ));

		$response = curl_exec($curl);
		$err = curl_error($curl);
		
		curl_close($curl);

        if ($err) {
            $result['info'] = '短信发送失败！';
            $result['status'] = 0;
        } else {
            if(strstr($response,'Success')){
                $result['status'] = 1;
                $result['info'] = '短信已发送';
            }else{
                $result['status'] = 0;
                $result['info'] = '短信发送失败！';
            }
        }
        $this -> ajaxReturn($result);
    }

    /**
     * 用户注销
     */
    public function logout()
    {
        // 清楚所有session
        session(null);
        redirect(U('Login/login'), 2, '正在退出登录...');
    }

    /**
     * 验证码
     */
    public function verify()
    {
        // 实例化Verify对象
        $verify = new \Think\Verify();

        // 配置验证码参数
        $verify->fontSize = 14;     // 验证码字体大小
        $verify->length = 4;        // 验证码位数
        $verify->imageH = 34;       // 验证码高度
        $verify->useImgBg = true;   // 开启验证码背景
        $verify->useNoise = false;  // 关闭验证码干扰杂点
        $verify->entry();
    }
    
    function rand_string($len = 6, $type = '', $addChars = '') {
        $str = '';
        switch ($type) {
            case 0 :
                $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' . $addChars;
                break;
            case 1 :
                $chars = str_repeat('0123456789', 3);
                break;
            case 2 :
                $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' . $addChars;
                break;
            case 3 :
                $chars = 'abcdefghijklmnopqrstuvwxyz' . $addChars;
                break;
            default :
                // 默认去掉了容易混淆的字符oOLl和数字01，要添加请使用addChars参数
                $chars = 'ABCDEFGHIJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789' . $addChars;
                break;
        }
        if ($len > 10) {//位数过长重复字符串一定次数
            $chars = $type == 1 ? str_repeat($chars, $len) : str_repeat($chars, 5);
        }
        if ($type != 4) {
            $chars = str_shuffle($chars);
            $str = substr($chars, 0, $len);
        } else {
            // 中文随机字
            for ($i = 0; $i < $len; $i++) {
                $str .= msubstr($chars, floor(mt_rand(0, mb_strlen($chars, 'utf-8') - 1)), 1);
            }
        }
        return $str;
    }
}