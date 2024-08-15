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
          url: '/app/dashboard/etudiant'
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
              url: '/basic/TeacherList'
            },
            {
              id: 'Verif Professor',
              title: 'Verif New Professor',
              type: 'item',
              url: '/basic/TeacherVerif'
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
              url: '/basic/StudentList'
            },
            {
              id: 'Verif New Student',
              title: 'Verif New Student',
              type: 'item',
              url: '/basic/StudentVerif'
            }
          ]
        },
        {
          id: 'Departments',
          title: 'Departments',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            
            {
              id: 'All Department',
              title: 'All Department',
              type: 'item',
              url: '/basic/DepartmentList'
            }
          ]
        },
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
    },
    {
      id: 'ui-forms',
      title: 'FORMS & TABLES',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'Form Elements',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/forms/form-basic'
        },
        {
          id: 'table',
          title: 'Table',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/bootstrap'
        }
      ]
    }
  ]
};

export default menuItems;
