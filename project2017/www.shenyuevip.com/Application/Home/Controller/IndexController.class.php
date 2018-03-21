<?php
namespace Home\Controller;
use Think\Controller;

/**
 * 首页控制器
 * @package Home\Controller
 */
class IndexController extends Controller {
    /**
     * 系统首页
     */
    public function index(){
        $this->display();
    }
    
    public function findPwSet($verify_no = null){
        if(IS_POST){
            if(session("verify_no") == $verify_no){
                $result['status'] = true;
            }else{
                $result['status'] = false;
                $result['info'] = '验证码错误！';
            }
            $this->ajaxReturn($result);
        }else{
            $this->display();
        }
    }
    
    public function findPwCz($password = null){
        if(IS_POST){
            $where['mobile'] = session('mobile');
            $id = M('users')->where($where)->getField('id');
            if($id){
                M('users')->where($where)->setField('password',md5($password));
                $result['status'] = true;
            }else{
                $result['status'] = false;
                $result['info'] = '修改失败！';
            }
            $this->ajaxReturn($result);
        }else{
            $this->display();
        }
    }
}