const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

// basic HTTP authentication for login
passport.use(
  new LocalStrategy(
    {
      usernameField: 'userName',
      passwordField: 'password',
    },
    (username, password, callback) => {
      // console.log(username + ' ' + password);
      Users.findOne({ userName: username })
        .then((user) => {
          if (!user) {
            // console.log('Incorrect username.');
            return callback(null, false, {
              message: 'Incorrect username.'
            });
          }
          if (!user.validatePassword(password)) {
            // console.log('Incorrect password');
            return callback(null, false, {
              message: 'Incorrect password.'
            });
          }
          // console.log('finished');
          return callback(null, user);
        }).catch((error) => {
          // console.log(error);
          return callback(error, false);
        });
    }
  )
);

// JWT authentication
passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret',
  },
  (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
      .then((user) => {
        return callback(null, user);
      })
      .catch((error) => {
        return callback(error);
      });
  }
));