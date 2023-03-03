const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));

// error handling via function - does not work?
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

app.use(errorHandler);

// error handling middleware - does not work?
// app.use((err, req, res, next) => {
//   console.log('error handling middleware called');
//   console.error(err.stack);
//   res.send('Error' + err);
//   res.status(500).send('There seems to be an error.');
// });

// static fav movies json
let favMovies = [
  {
    title: 'The Fifth Element',
    releasedate: '1997',
  },
  {
    title: 'Terminator',
    releasedate: '1984',
  },
  {
    title: 'The Deer Hunter',
    releasedate: '1978',
  },
  {
    title: 'Three Billboards Outside Ebbing, Missouri',
    releasedate: '2017',
  },
  {
    title: 'Metropolis',
    releasedate: '1927',
  },
  {
    title: 'Lawrence of Arabia',
    releasedate: '1962',
  },
  {
    title: 'Rear Window',
    releasedate: '1954',
  },
  {
    title: 'Interstellar',
    releasedate: '2014',
  },
  {
    title: 'The Silence of the Lambs',
    releasedate: '1991',
  },
  {
    title: 'One Flew Over the Cuckoo\'s Nest',
    releasedate: '1991',
  },
  {
    title: 'Fight Club',
    releasedate: '1999',
  },
  {
    title: 'Forrest Gumb',
    releasedate: '1994',
  },
  {
    title: 'Ghostbusters',
    releasedate: '1984',
  },
  {
    title: 'The Odd Couple',
    releasedate: '1968',
  }
];

// GET requests
app.get('/', (req, res) => {
  res.send('Check out my favorite movies.');
});

app.get('/movies', (req, res) => {
  res.json(favMovies);
});

// listen to port 8080
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
