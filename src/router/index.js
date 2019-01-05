import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import { Message } from 'element-ui';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})

// 路由拦截设置 
// 如果要去home页面 --> 先判断是否有token --> 有则继续  没有则跳到登录页面
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (to.name === 'login') {
    next();
  } else {
    const token = localStorage.getItem('token');
    if (!token) {
      Message.warning('请先登录');

      router.push({
        name: 'login'
      })
    } else {
      next();
    }
  }
})

export default router;