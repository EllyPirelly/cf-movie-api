# MoviePool API

### What is this about?
RESTful API for movie lovers that want to be able to access information about different movies, genres, directors... <br>
It's the "M", "E" and "N" from the MERN stack (MongoDB, Express.js, React, Node.js). <br>
[Find the "R" here.](https://github.com/EllyPirelly/cf-movie-client)

This RESTful API was built split into several tasks for Achievement 2 and 3 in [Career Foundry's Full-Stack Web Development Program](https://careerfoundry.com/en/courses/become-a-web-developer/).

### Project Requirements
- MERN stack must be used
- API must at least use commonly used HTTP methods (`GET`, `POST`, `PUT`, `DELETE`), following CRUD
- API must at least use 3 middleware modules
- the database
  - as a first step a relational database must be build (PostgreSQL)
  - later in the process a non-relational database must be build using MongoDB (MongoDB Community Server, Mongo Shell, MongoDB Database Tools)
  - code first approch: first design endpoints, then design database
- the business logic must be modeled with Mongoose
- API must be tested in Postman
- API must include user authentication and authorization
- API must include data validation logic
- API must meet data security regulations
- WIP:
  - API must be documented (Postman)

### API functionality
`users`
- new users
  - are able to sign up
    - userName
    - password
    - email
    - birthDate
- registered users
  - are able to update their personal information
    - userName
    - password
    - email
    - birthDate
  - have access to various information about movies
  - are able to add a movie to their list of favorite movies
  - are able to delete a movie off of their list of favorite movies
    - heads-up: we need to know all the movies that a certain user favorites but NOT all the users who've liked a certain movie
  - are able to de-register

`movies`
- return a list of all movies
- return data about a single movie by title
  - title
  - description
  - genre
    - genreName
    - description
  - director
    - directorName
    - bio
    - birthDate
    - deathDate
  - imagePath
  - featured
- return data about a genre by name (e.g. "Thriller")
- return data about a director by name
  - bio
  - birthDate
  - deathDate

### Optional
- have a `log.txt` file to dynamically populate and log recent requests made to server
- log information is "processed by" Morgan middleware

### API documentation
Work in Progress! https://documenter.getpostman.com/view/26201251/2s93RRvDAq

### Languages, Libraries, Frameworks, Tools
- HTML
- CSS
- JavaScript

#### Node.js
- https://nodejs.org/en/

#### Node.js repl terminal
- `cd` into correct directory and start Node.js repl terminal with `node index.js`
- stop Node.js repl terminal with `ctl c`
- log information is "processed by" Morgan middleware

#### Nodemon
- optional
- to not always manually exit and restart Node.js repl terminal after each change made to the code
- https://www.npmjs.com/package/nodemon
- you can immediately run `npm run dev`, this will run/watch the Node.js repl terminal
- stop with `ctl c`

#### Express.js
- server-side minimalist web framework for Node.js
- https://www.npmjs.com/package/express

#### Morgan Middleware
- logs information to Node.js repl terminal (and to the `log.txt`)
- https://www.npmjs.com/package/morgan

#### Body Parser Middleware
- reads the body of HTTP requests to get additional information not stored in the request URLs
- https://www.npmjs.com/package/body-parser

#### uuid Middleware
- generates unique IDs
- https://www.npmjs.com/package/uuid

#### PostgreSQL
- to in a first step create a relational database (using pgAdmin 4)
- https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/

#### MongoDB and MongoDB Community Server
- to build the document-based, non-relational database
- https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/
- https://github.com/mongodb/homebrew-brew
- MongoDB Communit Server will install the latest:
  - MongoDB Community Server
    - locally needs to run any time one wants to interact with the database, view the app or use Mongo Shell
    - start `brew services start mongodb-community`
    - stop `brew services stop mongodb-community`
  - Mongo Shell (local)
    - start MongoDB Community Server
    - run `mongosh`
    - exit with `exit` or `quit()`
    - stop MongoDB Community Server
  - MongoDB Database Tools

#### Mongoose
- to configure data models / schemas
- https://www.npmjs.com/package/mongoose
- (to install Mongoose, the MongoDB Server must be up)

#### Postman
- to test endpoints and API documentation
- https://www.postman.com/
- `cd` into correct directory and start Node.js repl terminal with `node index.js`
- go to Postman (either browser or app)
- test

#### CORS
- Cross-Origin Resource Sharing
- to control which domains have access to the API

#### bcrypt
- to hash passwords

#### express-validator
- for server-side input validation

### How to run this?
- clone project
- `npm install`
- TODO......
