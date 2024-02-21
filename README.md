

## Dependencies
- Node - 20.10.0
- NPM - 9.5.1
- Local mongoDB Running On ("mongodb://localhost:27017")

## Information
Implement a RESTful API with the following functionalities:User authentication: Register, login and allUsers.
Tweet functionality: Allow users to create, read, update, and delete tweets.
Follow/unfollow functionality: Enable users to follow/unfollow other users.
Tweet feed: Fetch and display a user's tweet feed, including their own tweets and tweets from the users they follow.

## Setup Project
```sh
Clone -> git clone https://github.com/shubhampatel9977/Task-Supersourcing.git
Rename -> .env.example To .env
```

## Application Start
```sh
Install Dependencies -> npm install
Start Project -> npm start || node server.js
Unit Testing -> npm test
```

## Api Collection On Postman
```sh
Postman collection of all Apis also we have put 'Task-Supersourcing.postman_collection.json' file.
By registering the user, the user can generate token upon login.
The token is used for autorization as a `Bearer Token` for all other APIs.
```