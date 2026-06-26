#Small blog software Built on Django and React.

#Install python, in python install dependencies:
python -m pip install --upgrade pip
pip install -r requirements.txt

#Django Backend with UI
##migrate database:
python manage.py migrate
##run backend:
python manage.py runserver 0.0.0.0:8000

#React Frontend
cd frontend
npm install
npm start

#To run tests:
##Pytest
pytest-v
##Playwright:
npm test
##Postman:
npm install -g postman-cli
postman collection run "postman/collections/api"