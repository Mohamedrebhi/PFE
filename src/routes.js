import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import EnseignantLayout from './layouts/AdminLayout/indexEnseignant.js';
import AdminLayout from './layouts/AdminLayout/indexAdmin.js';
import EtudiantLayout from './layouts/AdminLayout/indexEtudiant.js';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: 'true',
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    exact: 'true',
    path: '/home',
    element: lazy(() => import('./views/landing-page/Home'))
  },
  {
    exact: 'true',
    path: '/about',
    element: lazy(() => import('./views/landing-page/About'))
  },
  {
    exact: 'true',
    path: '/contact',
    element: lazy(() => import('./views/landing-page/Contact'))
  },
  {
    exact: 'true',
    path: '/courses',
    element: lazy(() => import('./views/landing-page/Courses'))
  },
  {
    path: '/admin/*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/dashboard',
        element: lazy(() => import('./views/dashboard/Admin.js'))
      },
      {
        exact: 'true',
        path: 'basic/TeacherAdd',
        element: lazy(() => import('./views/ui-elements/basic/TeacherAdd'))
      },
      {
        exact: 'true',
        path: 'basic/TeacherEdit',
        element: lazy(() => import('./views/ui-elements/basic/TeacherEdit'))
      },
      {
        exact: 'true',
        path: 'basic/TeacherList',
        element: lazy(() => import('./views/ui-elements/basic/TeacherList'))
      },
      {
        exact: 'true',
        path: 'basic/TeacherVerif',
        element: lazy(() => import('./views/ui-elements/basic/TeacherVerif'))
      },
      {
        exact: 'true',
        path: 'basic/StudentAdd',
        element: lazy(() => import('./views/ui-elements/basic/StudentAdd'))
      },
      {
        exact: 'true',
        path: 'basic/StudentEdit',
        element: lazy(() => import('./views/ui-elements/basic/StudentEdit'))
      },
      {
        exact: 'true',
        path: 'basic/StudentList',
        element: lazy(() => import('./views/ui-elements/basic/StudentList'))
      },
      {
        exact: 'true',
        path: 'basic/StudentVerif',
        element: lazy(() => import('./views/ui-elements/basic/StudentVerif'))
      },
      {
        exact: 'true',
        path: 'basic/CourList',
        element: lazy(() => import('./views/ui-elements/basic/CourList.js'))
      },
      {
        exact: true,
        path: 'Cours/:ProfessorID',
        element: lazy(() => import('./views/ui-elements/basic/CoursDetail.js'))
      },
      {
        exact: true,
        path: 'Modules/:ModuleID',
        element: lazy(() => import('./views/ui-elements/basic/CoursDetail.js'))
      },
      {
        exact: true,
        path: 'basic/CoursDetail',
        element: lazy(() => import('./views/ui-elements/basic/CoursDetail.js'))      
      },
      {
        exact: 'true',
        path: 'Quiz/:ProfessorID',
        element: lazy(() => import('./views/ui-elements/basic/QuizDetail.js'))
      },
      {
        exact: 'true',
        path: 'Examens/:ProfessorID',
        element: lazy(() => import('./views/ui-elements/basic/ExamList.js'))
      },
      {
        exact: 'true',
        path: 'basic/CourAdd',
        element: lazy(() => import('./views/ui-elements/basic/CourAdd'))
      },
      {
        exact: 'true',
        path: 'basic/CourEdit',
        element: lazy(() => import('./views/ui-elements/basic/CourEdit'))
      },
      {
        exact: 'true',
        path: 'basic/DepartmentList',
        element: lazy(() => import('./views/ui-elements/basic/DepartmentList'))
      },
      {
        exact: 'true',
        path: 'basic/DepartmentAdd',
        element: lazy(() => import('./views/ui-elements/basic/DepartmentAdd'))
      },
      {
        exact: 'true',
        path: 'basic/DepartmentEdit',
        element: lazy(() => import('./views/ui-elements/basic/DepartmentEdit'))
      },
      {
        exact: 'true',
        path: 'basic/pagination',
        element: lazy(() => import('./views/ui-elements/basic/BasicPagination'))
      },
      {
        exact: 'true',
        path: 'basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: 'true',
        path: 'basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: 'true',
        path: 'basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      {
        exact: 'true',
        path: 'forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements'))
      },
      {
        exact: 'true',
        path: 'tables/bootstrap',
        element: lazy(() => import('./views/tables/BootstrapTable'))
      },
      {
        exact: 'true',
        path: 'setting.js',
        element: lazy(() => import('./layouts/AdminLayout/NavBar/NavRight/setting.js'))
      },
      {
        exact: true,
        path: '/admin/profile',
        element: lazy(() => import('./layouts/AdminLayout/NavBar/NavRight/profile.js'))
      },
      {
        exact: true,
        path: '/admin/Lock',
        element: lazy(() => import('./layouts/AdminLayout/NavBar/NavRight/Lock.js'))
      }
    ]
  },
  {
    path: '/enseignant/*',
    layout: EnseignantLayout,
    routes: [
      {
        exact: 'true',
        path: '/dashboard',
        element: lazy(() => import('./views/dashboard/enseignant.js'))
      },
      {
        exact: 'true',
        path: '/enseignant/AddchapterEnseignant',
        element: lazy(() => import('./views/enseignant/AddchapterEnseignant.js'))
      },
      {
        exact: 'true',
        path: '/enseignant/RecommandechapterEnseignant',
        element: lazy(() => import('./views/enseignant/RecommandechapterEnseignant.js'))
      },
      {
        exact: 'true',
        path: '/enseignant/AddExamEnseignant',
        element: lazy(() => import('./views/enseignant/AddExamEnseignant.js'))
      },
      {
        exact: 'true',
        path: '/enseignant/AllchapterEnseignant',
        element: lazy(() => import('./views/enseignant/AllchapterEnseignant.js'))
      },
      {
        exact: 'true',
        path: '/enseignant/AllExamEnseignant',
        element: lazy(() => import('./views/enseignant/AllExamEnseignant.js'))
      },
      {
        exact: 'true',
        path: '/enseignant/CourAddEnseignant',
        element: lazy(() => import('./views/enseignant/CourAddEnseignant.js'))
      },
      {
        exact: 'true',
        path: '/enseignant/EditCourEnseignant',
        element: lazy(() => import('./views/enseignant/CourEditEnseignant.js'))
      },
      {
        exact: 'true',
        path: '/enseignant/CourListEnseignant',
        element: lazy(() => import('./views/enseignant/CourListEnseignant.js'))
      },
      {
        exact: 'true',
        path: '/enseignant/EditchapterEnseignant',
        element: lazy(() => import('./views/enseignant/EditchapterEnseignant.js'))
      },
      {
        exact: 'true',
        path: '/enseignant/EditExamEnseignant',
        element: lazy(() => import('./views/enseignant/EditExamEnseignant.js'))
      },
      {
        exact: true,
        path: '/enseignant/QuizAddEnseignant',
        element: lazy(() => import('./views/enseignant/QuizAddEnseignant.js'))
      },
      {
        exact: true,
        path: '/enseignant/EditQuizEnseignant',
        element: lazy(() => import('./views/enseignant/QuizEditEnseignant.js'))
      },
      {
        exact: true,
        path: '/enseignant/QuizListEnseignant',
        element: lazy(() => import('./views/enseignant/QuizListEnseignant.js'))      
      },
      {
        exact: true,
        path: '/enseignant/RecommandeQuiz',
        element: lazy(() => import('./views/enseignant/RecommandationQuiz.js'))      
      },
      {
        exact: 'true',
        path: '/enseignant/StudentListEnseignant',
        element: lazy(() => import('./views/enseignant/StudentListEnseignant.js'))
      },
      {
        exact: 'true',
        path: '/enseignant/TeacherEditEnseignant',
        element: lazy(() => import('./views/enseignant/TeacherEditEnseignant.js'))
      },
      {
        exact: 'true',
        path: '/enseignant/TeacherListEnseignant',
        element: lazy(() => import('./views/enseignant/TeacherListEnseignant.js'))
      },
      {
        exact: 'true',
        path: 'basic/pagination',
        element: lazy(() => import('./views/ui-elements/basic/BasicPagination'))
      },
      {
        exact: 'true',
        path: 'basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: 'true',
        path: 'basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: 'true',
        path: 'basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      {
        exact: 'true',
        path: '/enseignant/settings',
        element: lazy(() => import('../src/settings/Settings.js'))
      },
      {
        exact: true,
        path: '/enseignant/profile',
        element: lazy(() => import('./layouts/AdminLayout/NavBar/NavRight/profile.js'))
      },
      {
        exact: true,
        path: '/enseignant/Lock',
        element: lazy(() => import('./layouts/AdminLayout/NavBar/NavRight/Lock.js'))
      }
    ]
  },
  //etudiant
  {
    path: '/etudiant/*',
    layout: EtudiantLayout,
    routes: [
      {
        exact: 'true',
        path: '/dashboard',
        element: lazy(() => import('./views/dashboard/etudiant.js'))
      },
      {
        exact: true,
        path: '/etudiant/profile',
        element: lazy(() => import('./layouts/AdminLayout/NavBar/NavRight/profile.js'))
      },
      {
        exact: true,
        path: '/etudiant/quiz',
        element: lazy(() => import('./views/dashboard/passerquiz.js'))
      }
    ]
  },
  {
    path: '*',
    exact: 'true',
    element: () => <Navigate to={BASE_URL} />
  }
];

export default routes;