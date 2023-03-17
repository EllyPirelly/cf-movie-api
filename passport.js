const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Models = require('./models.js');
const passportJWT = require('passport-jwt');

let Users = Models.User;
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

// basic HTTP authentication for login
passport.use(new LocalStrategy(
  {
    usernameField: 'userName',
    passwordField: 'password'
  },
  (userName, password, callback) => {
    console.log(userName + ' ' + password);

    Users.findOne(
      {
        userName: userName
      }
    ).then((user) => {
      if (!user) {
        console.log('Incorrect username.');
        return callback(null, false, {
          message: 'Incorrect username or password.'
        });
      }

      console.log('finished');
      return callback(null, user);

    }).catch((err) => {
      console.log(err);
      return callback(err);
    });
  }
));

// JWT authentication
passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
  },
  (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
      .then((user) => {
        return callback(null, user);
      })
      .catch((err) => {
        return callback(err);
      });
  }
));