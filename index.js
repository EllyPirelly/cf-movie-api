const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

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

app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
  res.send('Check out my favorite movies.');
});

app.get('/movies', (req, res) => {
  res.json(favMovies);
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
