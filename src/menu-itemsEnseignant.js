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
          url: '/enseignant/dashboard'
        },
        
        {
          id: 'Students',
          title: 'Students',
          type: 'collapse',
          icon: 'feather icon-users',
          children: [
            
            {
              id: 'All Student',
              title: 'All Student',
              type: 'item',
              url: '/enseignant/enseignant/StudentListEnseignant'
            },
          ]
        },
        {
          id: 'Courses',
          title: 'Courses',
          type: 'collapse',
          icon: 'feather icon-book',
          children: [
            {
              id: 'Add Courses',
              title: 'Add Courses',
              type: 'item',
              url: '/enseignant/enseignant/CourAddEnseignant'
            },
            /*{
              id: 'Edit Courses',
              title: 'Edit Courses',
              type: 'item',
              url: '/basic/CourEdit'
            },*/
            {
              id: 'All Courses',
              title: 'All Courses',
              type: 'item',
              url: '/enseignant/enseignant/CourListEnseignant'
            },
            
          
          ]
        },
        {
          id: 'Chapters',
          title: 'Chapters',
          type: 'collapse',
          icon: 'feather icon-layers',
          children: [
            {
              id: 'View Recommendation',
              title: 'View Recommendation',
              type: 'item',
              url: 'http://localhost:8503', // Replace with your Streamlit app URL
              external: true, // Ensures the link opens in a new tab
            },
          
            {
              id: 'Add Chapter',
              title: 'Add Chapter',
              type: 'item',
              url: '/enseignant/enseignant/AddchapterEnseignant'
            },
            {
              id: 'All Chapter',
              title: 'All Chapter',
              type: 'item',
              url: '/enseignant/enseignant/AllchapterEnseignant'
            },
    
          ]
        },
    {
      id: 'quizs',
      title: 'Quiz',
      type: 'collapse',
      icon: 'feather icon-check-square',
      children: [
        
          {
            id: 'Add Question',
            title: 'Add Question',
            type: 'item',
            url: '/enseignant/enseignant/QuizAddEnseignant'
          },
          {
            id: 'Edit quiz',
            title: 'Edit Question',
            type: 'item',
            url: 'enseignant/EditQuizEnseignant'
          },
          {
            id: 'All quizs',
            title: 'All Quizs',
            type: 'item',
            url: '/enseignant/enseignant/QuizListEnseignant'
          },
          

        
      ]
    },
    {
      id: 'exams',
      title: 'Exams',
      type: 'collapse',
      icon: 'feather icon-award',
      children: [
        {
          id: 'Add Exam',
          title: 'Add Exam',
          type: 'item',
          url: '/enseignant/enseignant/AddExamEnseignant'
        },
        {
          id: 'Edit exam',
          title: 'Edit Exam',
          type: 'item',
          url: '/enseignant/enseignant/EditExamEnseignant'
        },
        

        {
          id: 'All exam',
          title: 'All Exam',
          type: 'item',
          url: '/enseignant/enseignant/AllExamEnseignant'
        },

      ]
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
    },
    
    
  ]
}
  ]
};

export default menuItems ;