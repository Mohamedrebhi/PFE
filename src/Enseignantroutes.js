import { lazy } from 'react';

const enseignantRoutes = [
    {
        path: '/app/dashboard/Enseignant',
        element: lazy(() => import('./views/dashboard/enseignant.js'))
      },
      {
        path: '/enseignant/Addchapter',
        element: lazy(() => import('./views/enseignant/AddchapterEnseignant.js'))
      },
      {
        path: '/enseignant/AddExam',
        element: lazy(() => import('./views/enseignant/AddExamEnseignant.js'))
      },
      {
        path: '/enseignant/Allchapter',
        element: lazy(() => import('./views/enseignant/AllchapterEnseignant.js'))
      },
      {
        path: '/enseignant/AllExam',
        element: lazy(() => import('./views/enseignant/AllExamEnseignant.js'))
      },
      {
        path: '/enseignant/AddCour',
        element: lazy(() => import('./views/enseignant/CourAddEnseignant.js'))
      },
      {
        path: '/enseignant/EditCour',
        element: lazy(() => import('./views/enseignant/CourEditEnseignant.js'))
      },
      {
        path: '/enseignant/ListCour',
        element: lazy(() => import('./views/enseignant/CourListEnseignant.js'))
      },
      {
        path: '/enseignant/Editchapter',
        element: lazy(() => import('./views/enseignant/EditchapterEnseignant.js'))
      },
      {
        path: '/enseignant/EditExam',
        element: lazy(() => import('./views/enseignant/EditExamEnseignant.js'))
      },
      {
        path: '/enseignant/AddQuiz',
        element: lazy(() => import('./views/enseignant/QuizAddEnseignant.js'))
      },
      {
        path: '/enseignant/EditQuiz',
        element: lazy(() => import('./views/enseignant/QuizEditEnseignant.js'))
      },
      {
        path: '/enseignant/QuizList',
        element: lazy(() => import('./views/enseignant/QuizListEnseignant.js'))      
      },
      {
        path: '/enseignant/StudentList',
        element: lazy(() => import('./views/enseignant/StudentListEnseignant.js'))
      },
      {
        path: '/enseignant/TeacherEdit',
        element: lazy(() => import('./views/enseignant/TeacherEditEnseignant.js'))
      },
      {
        path: '/enseignant/TeacherList',
        element: lazy(() => import('./views/enseignant/TeacherListEnseignant.js'))
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
export default enseignantRoutes;    