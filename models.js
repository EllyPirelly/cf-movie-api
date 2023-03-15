const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  genre: {
    genreName: String,
    description: String
  },
  director: {
    directorName: String,
    bio: String,
    birthDate: Date,
    deathDate: Date
  },
  // actors is not in use atm
  actors: [String],
  imagePath: String,
  featured: Boolean
});

let userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  birthDate: Date,
  favoriteMovies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    }
  ]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;