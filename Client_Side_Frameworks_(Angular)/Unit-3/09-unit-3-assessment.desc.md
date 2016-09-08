# Reddit Clone, The Final Chapter

## Resources
Angular Application goes here [Front End Repository](https://github.com/gSchool/reddit-clone-front-end).

Express API goes here [Back End Repository](https://github.com/gSchool/reddit-clone-back-end).

## Intro

Congratulations - you have completed our Angular Unit. By now you should have an strong understanding of how to build and structure MEAN stack applications and how to add authentication and authorization to a single page application. To put these skills to the test, let's rewrite our reddit clone from our [Angular Reddit Clone](/redirects/articles/4886) CCF and expand it's functionality to have the following.

## Required

**Backend**

- You will need to store users, posts and comments in a SQL database
- Users should have at least a username and password (which should be hashed using bcrypt).
- All of your API routes should be handled by express

**Front End**

- This should be a single page application and angular should handle the routing of all views.
- You should be using `services` to manage business logic, keep your controllers as skinny as possible.
- When your HTML starts to get bloated, think about writing some custom directives to clean up your code

**Authentication and Authorization**

- Users do not need to log in to view posts and comments
- Users **must** log in to create / update posts and comments
- Users should be able to see other users posts and comments
- Users should **only** be able to edit and delete their own posts and comments

**Deployment**

- Deploy the front-end to Firebase.
- Deploy the back-end to Heroku.

**README.MD**

Include `README.md` files in both of the repositories for this project. The following should be included in there:

- Location of deployed application.
- Instructions on how to install your application from scratch.

## Optional

- Using of Mongo instead of Postgres.
- Using features of ES2015.

## Bonus
- Create admin functionality where an admin has full CRUD over users, posts and comments
- Use `$resource` to manage (at least most) of your API calls
- Style the application!