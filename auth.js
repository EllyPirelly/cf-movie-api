// same key as in JWTStrategy!
const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport');

let generateJWToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    // username, encoded in JWT
    subject: user.userName,
    // expiration date
    expiresIn: '7d',
    // encoding
    algorithm: 'HS256',
  });
};

// POST - login
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate(
      'local',
      { session: false },
      (error, user, info) => {
        if (error || !user) {
          return res.status(400).json({
            message: 'Something is not right.',
            user: user,
          });
        }
        req.login(user, { session: false }, (error) => {
          if (error) {
            res.send(error);
          }
          let token = generateJWToken(user.toJSON());
          return res.json({ user, token });
        });
      }
    )(req, res);
  });
};