const menuItems = {
  items: [
    {
      id: 'MAIN MENU',
      title: 'MAIN MENU',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/admin/dashboard'
        },
        {
          id: 'Professors',
          title: 'Professors',
          type: 'collapse',
          icon: 'feather icon-user-check',
          children: [
            
            {
              id: 'View Professor List',
              title: 'View Professor List',
              type: 'item',
              url: '/admin/basic/TeacherList'
            },
            {
              id: 'Verif Professor',
              title: 'Verif New Professor',
              type: 'item',
              url: '/admin/basic/TeacherVerif'
            }
          ]
        },
        {
          id: 'Students',
          title: 'Students',
          type: 'collapse',
          icon: 'feather icon-users',
          children: [
           
            {
              id: 'View Student List',
              title: 'View Student List',
              type: 'item',
              url: '/admin/basic/StudentList'
            },
            {
              id: 'Verif New Student',
              title: 'Verif New Student',
              type: 'item',
              url: '/admin/basic/StudentVerif'
            }
          ]
        },
        /*{
          id: 'Departments',
          title: 'Departments',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'Add Department',
              title: 'Add Department',
              type: 'item',
              url: '/admin/basic/DepartmentAdd'
            },
            {
              id: 'Edit Department',
              title: 'Edit Department',
              type: 'item',
              url: '/admin/basic/DepartmentEdit'
            },
            {
              id: 'All Department',
              title: 'All Department',
              type: 'item',
              url: '/admin/basic/DepartmentList'
            }
          ]
        },*/
      ]
    },
    {
      id: 'Edit Profile',
      title: 'Edit Profile',
      type: 'item',
      url: './layouts/AdminLayout/NavBar/NavRight/profile.js'
    },
    {
      id: 'Settings',
      title: 'Settings',
      type: 'item',
      url: './layouts/AdminLayout/NavBar/NavRight/setting.js'
    },
    {
      id: 'Lock',
      title: 'Lock',
      type: 'item',
      url: './layouts/AdminLayout/NavBar/NavRight/Lock.js'
    }
  ]
};

export default menuItems;
