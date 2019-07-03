import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import register from '@/components/register'
import document_manage from '@/components/document-manage'
import document_edit from '@/components/document-edit'
import inviteConfirm from '@/components/invite-confirm'
import notfound from '@/components/notfound'
import history from '@/components/history'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/register',
      name: 'regsiter',
      component: register
    },
    {
      path: '/document-manage',
      name: 'document-manage',
      component: document_manage
    },
    {
      path: '/document-edit',
      name: 'document-edit',
      component: document_edit
    },
    {
      path: '/inviteConfirm/:docId/:auth',
      component: inviteConfirm
    },
    {
      path: '/404',
      name: '404',
      component: notfound
    },
    {
      path: '/history',
      name: 'history',
      component: history
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
