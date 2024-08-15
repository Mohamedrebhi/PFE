import { lazy } from 'react';

const adminRoutes = [
        {
          path: '/app/dashboard/Admin',
          element: lazy(() => import('./views/dashboard/Admin.js'))
        },
        {
          path: '/basic/TeacherAdd',
          element: lazy(() => import('./views/ui-elements/basic/TeacherAdd'))
        },
        {
          path: '/basic/TeacherEdit',
          element: lazy(() => import('./views/ui-elements/basic/TeacherEdit'))
        },
        {
          path: '/basic/TeacherList',
          element: lazy(() => import('./views/ui-elements/basic/TeacherList'))
        },
        {
          path: '/basic/TeacherVerif',
          element: lazy(() => import('./views/ui-elements/basic/TeacherVerif'))
        },
        {
          path: '/basic/StudentAdd',
          element: lazy(() => import('./views/ui-elements/basic/StudentAdd'))
        },
        {
          path: '/basic/StudentEdit',
          element: lazy(() => import('./views/ui-elements/basic/StudentEdit'))
        },
        {
          path: '/basic/StudentList',
          element: lazy(() => import('./views/ui-elements/basic/StudentList'))
        },
        {
          path: '/basic/StudentVerif',
          element: lazy(() => import('./views/ui-elements/basic/StudentVerif'))
        },
        {
          path: '/basic/CourList',
          element: lazy(() => import('./views/ui-elements/basic/CourList.js'))
        },
        {
          path: '/Cours/:ProfessorID',
          element: lazy(() => import('./views/ui-elements/basic/CoursDetail.js'))
        },
        {
          path: '/Modules/:ModuleID',
          element: lazy(() => import('./views/ui-elements/basic/CoursDetail.js'))
        },
        {
          path: '/basic/CoursDetail',
          element: lazy(() => import('./views/ui-elements/basic/CoursDetail.js'))      
        },
        {
          path: '/Quiz/:ProfessorID',
          element: lazy(() => import('./views/ui-elements/basic/QuizDetail.js'))
        },
        {
          path: '/Examens/:ProfessorID',
          element: lazy(() => import('./views/ui-elements/basic/ExamList.js'))
        },
        {
          path: '/basic/CourAdd',
          element: lazy(() => import('./views/ui-elements/basic/CourAdd'))
        },
        {
          path: '/basic/CourEdit',
          element: lazy(() => import('./views/ui-elements/basic/CourEdit'))
        },
        {
          path: '/basic/DepartmentList',
          element: lazy(() => import('./views/ui-elements/basic/DepartmentList'))
        },
        {
          path: '/basic/DepartmentAdd',
          element: lazy(() => import('./views/ui-elements/basic/DepartmentAdd'))
        },
        {
          path: '/basic/DepartmentEdit',
          element: lazy(() => import('./views/ui-elements/basic/DepartmentEdit'))
        },
        {
          path: '/basic/pagination',
          element: lazy(() => import('./views/ui-elements/basic/BasicPagination'))
        },
        {
          path: '/basic/collapse',
          element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
        },
        {
          path: '/basic/tabs-pills',
          element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
        },
        {
          path: '/basic/typography',
          element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
        },
        {
          path: '/forms/form-basic',
          element: lazy(() => import('./views/forms/FormsElements'))
        },
        {
          path: '/tables/bootstrap',
          element: lazy(() => import('./views/tables/BootstrapTable'))
        },
        {
          path: '/setting.js',
          element: lazy(() => import('./layouts/AdminLayout/NavBar/NavRight/setting.js'))
        },
        {
          path: '/profile/:AdminID',
          element: lazy(() => import('./layouts/AdminLayout/NavBar/NavRight/profile.js'))
        },
        {
          path: '/Lock.js',
          element: lazy(() => import('./layouts/AdminLayout/NavBar/NavRight/Lock.js'))
        },
    ];
export default adminRoutes;