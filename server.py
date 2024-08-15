from backend import app
# ALWAYS REMEMBER TO IMPORT CONTROLLERS
from backend import course, editprofile, professor, profile, Admin, AppCRUD, chapitres, enscrud, ExamCRUD, department, notification, quizcrud


if __name__ == '__main__':
    app.run(debug=True)
