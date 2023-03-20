// same key as in JWTStrategy!
const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport');

let generateJWToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    // username, encoded in JWT
    subject: user.userName,
    // expiration date
    expiresIn: '7d',
    // encoding
    algorithm: 'HS256'
  });
};

// POST - login
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local',
      { session: false },
      (err, user, info) => {
        if (err || !user) {
          return res.status(400).json({
            message: 'Something is not right.',
            user: user
          });
        }

        req.login(user,
          { session: false },
          (err) => {
            if (err) {
              res.send(err);
            }
            let token = generateJWToken(user.toJSON());
            // ES6 shorthand for res.json({ user: user, token: token })
            return res.json({
              user,
              token
            });
          });
      })
      (req, res);
  });
}