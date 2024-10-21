# Description
web application that allows users to search for information on a variety of topics. The application will fetch relevant questions and answers from popular Q&A platforms like Stack Overflow and Reddit, and display them in a good manner.

# Functionality:
● Search Functionality
● Result Display
● Filtering and Sorting
● Email Generation
● Data Caching
● Language Translation

# Getting Started
## Pre-Requisites
- NodeJs

# Steps to Run

1. Clone the Repository and Nevigate to the main directory

# backend setup :-
  
1. cd backend

2. npm i

3. make .env file and add this strings :

     - MONGO_URI
     - EMAIL_USER
     - EMAIL_PASS  (for node mailer set this)

5. start the server using node or nodemon :-

    node server.js  or  nodemon server.js

# Frontend setup :-

1. go to the frontend from root directory using :- 

    cd frontend

2. npm i

3. make .env file and add this strings :

     - REACT_APP_API_KEY = 'wg_d06f13c3d7995024e20d1673371917796'  (weglot api key for language translate)

4. start the frontend server :-

    npm start