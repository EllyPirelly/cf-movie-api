const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();

// creates write stream, appends logs to log file log.txt
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log.txt'),
  {
    flags: 'a'
  }
);

app.use(morgan('common', { stream: accessLogStream }));
app.use(express.static('public'));

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
  console.log('Check out my favorite movies.');
  res.send('Check out my favorite movies.');
});

app.get('/movies', (req, res) => {
  console.log('Favorite Movies');
  res.json(favMovies);
});

app.get('/documentation', (req, res) => {
  console.log('Documentation found.');
  res.send('API documentation');
})

// error handling middleware
// app.use((err, req, res, next) => {
//   console.log('error handling middleware called');
//   console.error(err.stack);
//   res.send('Error' + err);
//   res.status(500).send('There seems to be an error.');
// });

// alternative error handling middleware
app.use((req, res, next) => {
  const err = new Error('Not found.');
  console.log(err);
  err.status = 404;
  res.send('Route not found');
  next(err);
})

// listen to port 8080
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
