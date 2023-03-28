const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

// basic HTTP authentication for login
// bugfix: tying the old way of password.use
passport.use(new LocalStrategy(
  {
    usernameField: 'userName',
    passwordField: 'password',
  },
  (username, password, callback) => {
    console.log(username + ' ' + password);
    Users.findOne({ userName: username }, (error, user) => {
      if (error) {
        console.log(error);
        return callback(error);
      }

      if (!user) {
        console.log('Incorrect username.');
        return callback(null, false, {
          message: 'Incorrect username.',
        });
      }

      if (!user.validatePassword(password)) {
        console.log('Incorrect password.');
        return callback(null, false, {
          message: 'Incorrect password.',
        });
      }

      console.log('finished');
      return callback(null, user);
    });
  }
));

// with promises, commented out for the moment
// passport.use(new LocalStrategy(
//   {
//     usernameField: 'userName',
//     passwordField: 'password'
//   },
//   (userName, password, callback) => {
//     console.log(userName + ' ' + password);

//     Users.findOne(
//       {
//         userName: userName
//       }
//     ).then((user) => {
//       if (!user) {
//         console.log('Incorrect username.');
//         return callback(null, false, {
//           message: 'Incorrect username.'
//         });
//       }
//     }).then((user) => {
//       if (!user.validatePassword(password)) {
//         console.log('Incorrect password.');
//         return callback(null, false, {
//           message: 'Incorrect password.'
//         });
//       }

//       console.log('finished');
//       return callback(null, user);

//     }).catch((err) => {
//       console.log(err);
//       return callback(err);
//     });
//   }
// ));

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