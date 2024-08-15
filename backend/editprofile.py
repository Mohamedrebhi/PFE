from flask import request
from pymongo import MongoClient
from backend import app, client

db = client['Users']
collection = db['Apprenants']

@app.route('/edit-profile', methods=['POST'])
def update_profile():
    # Get form data
    first_name = request.form['firstName']
    last_name = request.form['lastName']
    birthday = request.form['birthday']
    gender = request.form['gender']
    email = request.form['email']
    phone = request.form['phone']
    address = request.form['address']
    street_number = request.form['streetNumber']
    city = request.form['city']
    state = request.form['state']
    zip_code = request.form['zipCode']
    profile_picture = request.files['profilePicture']

    # Save profile picture to a file or database
    # profile_picture.save('path/to/save/profile_picture.jpg')

    # Update user information in the database
    user = {
        'first_name': first_name,
        'last_name': last_name,
        'birthday': birthday,
        'gender': gender,
        'email': email,
        'phone': phone,
        'address': address,
        'street_number': street_number,
        'city': city,
        'state': state,
        'zip_code': zip_code
    }
    collection.update_one({'email': email}, {'$set': user}, upsert=True)

    return 'Profile updated successfully'
