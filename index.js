const bodyParser = require('body-parser'),
  fs = require('fs'),
  path = require('path'),
  express = require('express'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  cors = require('cors'),
  uuid = require('uuid'),
  Models = require('./models.js');

const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

const dotenv = require('dotenv');
dotenv.config();
const database = process.env.CONNECTION_URI;

const app = express();

// test - comment in both bodyParsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// creates write stream, logs to log.txt - TODO: delete
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log.txt'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.static('public'));

// connect to MongoDB Atlas database via .env variable
mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('strictQuery', false);

// connect to MongoDB Atlas database - does not work, URI string error
// mongoose.connect(process.env.CONNECTION_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// connect locally to database
// mongoose.connect('mongodb://localhost:27017/moviepooldb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// GENERAL

app.get('/', (req, res) => {
  res.status(200).send('Check this API out.');
});

app.get('/documentation', (req, res) => {
  res.status(200).send('API Documentation found.');
});

// CREATE

// post / add user
app.post('/users',
  [
    check('userName')
      .isLength({ min: 5 })
      .withMessage('Username must be at least 5 characters long.')
      .isAlphanumeric()
      .withMessage('Username contains non-alphanumeric characters - not allowed.')
      .not().isEmpty()
      .withMessage('Username must not be empty.'),
    check('password')
      .not().isEmpty()
      .withMessage('Password is required.'),
    check('email')
      .isEmail()
      .withMessage('Email does not appear to be valid.'),
  ], (req, res) => {

    // check validation object for errors
    let errors = validationResult(req);

    // if any error the rest of the code will not execute
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);

    Users.findOne({
      // does user already exist
      userName: req.body.userName
    }).then((user) => {
      if (user) {
        // if yes:
        return res.status(400).send(req.body.userName + ' already exists');
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
      { userName: req.params.userName },
      { $push: { favoriteMovies: req.params.movieid } },
      { new: true }
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
app.put('/users/:userName',
  [
    check('userName')
      .isLength({ min: 5 })
      .withMessage('Username is required.')
      .isAlphanumeric()
      .withMessage('Username contains non-alphanumeric characters - not allowed.')
      .not().isEmpty()
      .withMessage('Username must not be empty.'),
    check('password')
      .not().isEmpty()
      .withMessage('Password is required.'),
    check('email')
      .isEmail()
      .withMessage('Email does not appear to be valid.'),
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
      { userName: req.params.userName },
      {
        $set: {
          userName: req.body.userName,
          password: hashedPassword,
          email: req.body.email,
          birthDate: req.body.birthDate
        }
      },
      { new: true }
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
      { userName: req.params.userName },
      {
        $pull: {
          favoriteMovies: req.params.movieid
        }
      },
      { new: true }
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

const port = process.env.PORT || 8080;

app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
