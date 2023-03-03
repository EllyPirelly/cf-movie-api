const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

// TODO

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
