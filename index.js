const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const dotenv = require('dotenv');
dotenv.config();
const database = process.env.CONNECTION_URI;

// to connect to database
// test
mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// does not work
// mongoose.connect(process.env.CONNECTION_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// to connect locally to database
// mongoose.connect('mongodb://localhost:27017/moviepooldb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

const app = express();

// creates write stream, logs to log.txt
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log.txt'),
  {
    flags: 'a'
  }
);

// needed to comment out urlencoded AGAIN to have this work...
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common', { stream: accessLogStream }));
app.use(express.static('public'));

// AUTH
const cors = require('cors');

// default -  all origins have access
app.use(cors());
// only CERTAIN origins have access
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
// app use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       // if a specific origin isn't found on the list of allwed origins
//       let message = 'The CORS policy for this app does NOT allow access from origin ' + origin;
//       return callback(new Error(message), false);
//     }
//     return callback(null, true);
//   }
// }));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// GENERAL

app.get('/', (req, res) => {
  res.status(200).send('Check this API out.');
});

app.get('/documentation', (req, res) => {
  res.status(200).send('API Documentation found.');
});

// CREATE

// post / add user
// we expect JSON in this format
// {
//   id: Integer,
//   userName: String,
//   password: String,
//   email: String,
//   birthDate: Date
// }
app.post('/users',
  [
    check('userName', 'Username is required.').isLength({ min: 5 }),
    check('userName', 'Username contains non-alphanumeric characters - not allowed.').not().isEmpty(),
    // check('userName', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required.').not().isEmpty(),
    check('email', 'Email does not appear to be valid.').isEmail(),
  ], (req, res) => {

    // checks validation object for errors
    let errors = validationResult(req);

    // if any error the rest of the code will not execute
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    let hashedPassword = Users.hashPassword(req.body.password);

    Users.findOne({
      // does user already exist
      userName: req.body.userName
    }).then((user) => {
      if (user) {
        // if yes:
        return res.status(400).send(req.body.userName + 'already exists');
      } else {
        // if no, create
        Users.create({
          userName: req.body.userName,
          password: hashedPassword,
          email: req.body.email,
          birthDate: req.body.birthDate
        }).then((user) => {
          res.status(201).json(user)
        }).catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        })
      }
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// post / add movie via movieid to user's favorites list
app.post('/users/:userName/movies/:movieid',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate(
      {
        userName: req.params.userName
      },
      {
        $push: {
          favoriteMovies: req.params.movieid
        }
      },
      {
        new: true
      }
    ).then((updatedUser) => {
      res.json(updatedUser);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// READ

// get all users
app.get('/users',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find().then((users) => {
      res.status(201).json(users);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// get all movies
app.get('/movies',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find().then((movies) => {
      res.status(201).json(movies);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  }
);

// get a specific user by userName
app.get('/users/:userName',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({
      userName: req.params.userName
    }).then((user) => {
      res.json(user);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// get a specific movie by title
app.get('/movies/:title',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({
      title: req.params.title
    }).then((movie) => {
      res.json(movie);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// get a specific movie genre by genreName
app.get('/movies/genres/:genreName',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({
      'genre.genreName': req.params.genreName
    }).then((movie) => {
      res.json(movie.genre);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// get a specific director by directorName
app.get('/movies/directors/:directorName',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({
      'director.directorName': req.params.directorName
    }).then((movie) => {
      res.json(movie.director);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// UPDATE

// update user by userName
// we expect JSON in this format
// {
//   userName: String, (required)
//   password: String, (required)
//   email: String, (required)
//   birthDate: Date
// }
app.put('/users/:userName',
  [
    check('userName', 'Username is required.').isLength({ min: 5 }),
    check('userName', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required.').not().isEmpty(),
    check('email', 'Email does not appear to be valid.').isEmail(),
  ],
  passport.authenticate('jwt', { session: false }), (req, res) => {

    // checks validation object for errors
    let errors = validationResult(req);

    // if any error the rest of the code will not execute
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    let hashedPassword = Users.hashPassword(req.body.password);

    Users.findOneAndUpdate(
      {
        userName: req.params.userName
      },
      {
        $set: {
          userName: req.body.userName,
          password: hashedPassword,
          email: req.body.email,
          birthDate: req.body.birthDate
        }
      },
      {
        new: true
      }
    ).then((updatedUser) => {
      res.json(updatedUser);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// DELETE

// delete user by userName
app.delete('/users/:userName',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({
      userName: req.params.userName
    }).then((user) => {
      if (!user) {
        res.status(400).send(req.params.userName + ' was not found');
      } else {
        res.status(200).send(req.params.userName + ' was deleted.');
      }
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// delete movie via movieid off of user's favorites list
app.delete('/users/:userName/movies/:movieid',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate(
      {
        userName: req.params.userName
      },
      {
        $pull: {
          favoriteMovies: req.params.movieid
        }
      },
      {
        new: true
      }
    ).then((updatedUser) => {
      res.json(updatedUser);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// error handling middleware
app.use((err, req, res, next) => {
  console.log('error handling middleware called');
  console.error(err.stack);
  res.status(500).send('There seems to be an error. ' + err);
});

// alternative error handling
// app.use((req, res, next) => {
//   const err = new Error('Not found.');
//   console.log(err);
//   err.status = 404;
//   res.send('Route not found');
//   next(err);
// });

// listen to port 8080
// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });

const port = process.env.PORT || 8080;

app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
