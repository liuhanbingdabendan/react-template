import Test1 from "../pages/Test1";
import Test2 from "../pages/Test2";
import Login from '../pages/Login';

export const menus = [
  {
    title: '路由一',
    path: '/test1',
    component: Test1
  }, {
    title: '路由二',
    path: '/test2',
    component: Test2
  }, {
    title: '登录',
    path: '/login',
    component: Login
  }
];