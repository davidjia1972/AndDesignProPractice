export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    name: '标准列表',
    icon: 'smile',
    path: '/listbasiclist',
    component: './ListBasicList',
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    name: '会员列表',
    icon: 'smile',
    path: '/memberlist',
    component: './MemberList',
  },

  {
    path: '/upload',
    name: '上传文件',
    icon: 'upload',
    routes: [
      {
        path: '/upload/upload01',
        name: '上传附件',
        component: './Upload/upload01.tsx',
      },
      {
        path: '/upload/upload02',
        name: '上传头像',
        component: './Upload/upload02.tsx',
      },
    ],
  },
  {
    name: '基础表单',
    icon: 'smile',
    path: '/formbasicform',
    component: './FormBasicForm',
  },
  {
    component: './404',
  },
];
