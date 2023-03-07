const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();

// creates write stream, logs to log file log.txt
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'log.txt'),
  {
    flags: 'a'
  }
);

app.use(bodyParser.json());
app.use(morgan('common', { stream: accessLogStream }));
app.use(express.static('public'));

// static users json
let users = [
  {
    id: 1,
    userName: 'John Doe',
    favorites: [
      "movie", "another movie"
    ],
  },
  {
    id: 2,
    userName: 'Paul Smith',
    favorites: [],
  },
  {
    id: 3,
    userName: 'Mary Miller',
    favorites: [
      "another movie", "some very good movie"
    ],
  }
];

// static movies json
let movies = [
  {
    movieTitle: 'The Fifth Element',
    releaseDate: '1997',
    description: 'In the colorful future, a cab driver unwittingly becomes the central figure in the search for a legendary cosmic weapon to keep Evil and Mr. Zorg at bay.',
    genre: {
      genreName: 'Sci-Fi',
      genreDescription: 'Science fiction (sometimes shortened to sf or sci-fi) is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.',
    },
    director: {
      directorName: 'Luc Besson',
      bio: 'Luc Besson spent the first years of his life following his parents, scuba diving instructors, around the world. His early life was entirely aquatic. He already showed amazing creativity as a youth, writing early drafts of Im Rausch der Tiefe (1988) and Das fünfte Element (1997), as an adolescent bored in school. He planned on becoming a marine biologist specializing in dolphins until a diving accident at age 17 which rendered him unable to dive any longer. He moved back to Paris, where he was born, and only at age 18 did he first have an urban life or television. He realized that film was a medium which he could combine all his interests in various arts together, so he began taking odd jobs on various films. He moved to America for three years, then returned to France and formed Les Films de Loups - his own production company, which later changed its name to Les Films de Dauphins. He is now able to dive again.',
      birthYear: '1959',
      deathYear: '-',
    },
    imgUrl: 'https://xl.movieposterdb.com/07_10/1997/119116/xl_119116_392c38e7.jpg?v=2023-02-14%2022:51:07',
  },
  {
    movieTitle: 'Terminator',
    releaseDate: '1984',
    description: 'A human soldier is sent from 2029 to 1984 to stop an almost indestructible cyborg killing machine, sent from the same year, which has been programmed to execute a young woman whose unborn son is the key to humanity\'s future salvation.',
    genre: {
      genreName: 'Sci-Fi',
      genreDescription: 'Science fiction (sometimes shortened to sf or sci-fi) is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.',
    },
    director: {
      directorName: 'James Cameron',
      bio: 'James Francis Cameron was born on August 16, 1954 in Kapuskasing, Ontario, Canada. He moved to the United States in 1971. The son of an engineer, he majored in physics at California State University before switching to English, and eventually dropping out. He then drove a truck to support his screenwriting ambition. He landed his first professional film job as art director, miniature-set builder, and process-projection supervisor on Roger Corman\'s Sador - Herrscher im Weltraum(1980) and had his first experience as a director with a two week stint on Fliegende Killer - Piranha II(1981) before being fired. He then wrote and directed Terminator(1984), a futuristic action - thriller starring Arnold Schwarzenegger, Michael Biehn and Linda Hamilton.',
      birthYear: '1954',
      deathYear: '-',
    },
    imgUrl: 'https://xl.movieposterdb.com/22_11/1991/301928/xl_the-terminator-movie-poster_c32bbde4.jpg?v=2022-11-27%2005:34:51',
  },
  {
    movieTitle: 'The Deer Hunter',
    releaseDate: '1978',
    description: 'An in-depth examination of the ways in which the Vietnam War impacts and disrupts the lives of several friends in a small steel mill town in Pennsylvania.',
    genre: {
      genreName: 'War Drama',
      genreDescription: 'War films typically tells the story of a small group of isolated individuals who – one by one – get killed (literally or metaphorically) by an outside force until there is a final fight to the death; the idea of the protagonists facing death is a central expectation in a war film. In a war film even though the enemy may out-number, or out-power, the hero, we assume that the enemy can be defeated if only the hero can figure out how.',
    },
    director: {
      directorName: 'Michael Cimino',
      bio: 'Michael Cimino studied architecture and dramatic arts; later he filmed advertisements and documentaries and also wrote scripts until the actor, producer and director Clint Eastwood gave him the opportunity to direct the thriller Die Letzten beißen die Hunde (1974). But his biggest success was Die durch die Hölle gehen (1978) which won the Oscar for Best Picture. For another successful film, Der Sizilianer (1987), he got into trouble with critics when they accused him of portraying as a hero the Italian criminal Salvatore Giuliano.',
      birthYear: '1939',
      deathYear: '2016',
    },
    imgUrl: 'https://xl.movieposterdb.com/05_11/1978/0077416/xl_66645_0077416_bccd4291.jpg?v=2023-03-01%2022:47:33',
  },
  {
    movieTitle: 'Three Billboards Outside Ebbing, Missouri',
    releaseDate: '2017',
    description: 'A mother personally challenges the local authorities to solve her daughter\'s murder when they fail to catch the culprit.',
    genre: {
      genreName: 'Drama',
      genreDescription: 'Crime dramas explore themes of truth, justice, and freedom, and contain the fundamental dichotomy of "criminal vs. lawman". Crime films make the audience jump through a series of mental "hoops"; it is not uncommon for the crime drama to use verbal gymnastics to keep the audience and the protagonist on their toes.',
    },
    director: {
      directorName: 'Martin McDonagh',
      bio: 'Martin McDonagh was born on March 26, 1970 in Camberwell, London, England, UK. He is a writer and director, known for Brügge sehen... und sterben? (2008), 7 Psychos (2012) and Three Billboards Outside Ebbing, Missouri (2017).',
      birthYear: '1970',
      deathYear: '-',
    },
    imgUrl: 'https://xl.movieposterdb.com/22_12/2017/5027774/xl_three-billboards-outside-ebbing-missouri-movie-poster_5a617962.jpg?v=2022-12-14%2009:05:08',
  },
  {
    movieTitle: 'Metropolis',
    releaseDate: '1927',
    description: 'In a futuristic city sharply divided between the working class and the city planners, the son of the city\'s mastermind falls in love with a working-class prophet who predicts the coming of a savior to mediate their differences.',
    genre: {
      genreName: 'Sci-Fi',
      genreDescription: 'Science fiction (sometimes shortened to sf or sci-fi) is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.',
    },
    director: {
      directorName: 'Fritz Lang',
      bio: 'Fritz Lang was born in Vienna, Austria, in 1890. His father managed a construction company. His mother, Pauline Schlesinger, was Jewish but converted to Catholicism when Lang was ten. After high school, he enrolled briefly at the Technische Hochschule Wien and then started to train as a painter. From 1910 to 1914, he traveled in Europe, and he would later claim, also in Asia and North Africa. He studied painting in Paris from 1913-14. At the start of World War I, he returned to Vienna, enlisting in the army in January 1915. Severely wounded in June 1916, he wrote some scenarios for films while convalescing. In early 1918, he was sent home shell-shocked and acted briefly in Viennese theater before accepting a job as a writer at Erich Pommer\'s production company in Berlin, Decla. In Berlin, Lang worked briefly as a writer and then as a director, at Ufa and then for Nero-Film, owned by the American Seymour Nebenzal. In 1920, he began a relationship with actress and writer Thea von Harbou (1889-1954), who wrote with him the scripts for his most celebrated films: Dr. Mabuse, der Spieler (1922), Die Nibelungen: Siegfrieds Tod (1924), Metropolis (1927) and M: Eine Stadt sucht einen Mörder (1931) (credited to von Harbou alone).',
      birthYear: '1890',
      deathYear: '1976',
    },
    imgUrl: 'https://xl.movieposterdb.com/11_10/1927/17136/xl_17136_72f10c1b.jpg?v=2022-05-05%2003:01:51',
  },
  {
    movieTitle: 'Lawrence of Arabia',
    releaseDate: '1962',
    description: 'The story of T.E. Lawrence, the English officer who successfully united and led the diverse, often warring, Arab tribes during World War I in order to fight the Turks.',
    genre: {
      genreName: 'Biography',
      genreDescription: 'A biographical film or biopic is a film that dramatizes the life of a non-fictional or historically-based person or people. Such films show the life of a historical person and the central character\'s real name is used. They differ from docudrama films and historical drama films in that they attempt to comprehensively tell a single person\'s life story or at least the most historically important years of their lives.',
    },
    director: {
      directorName: 'David Lean',
      bio: 'An important British filmmaker, David Lean was born in Croydon on March 25, 1908 and brought up in a strict Quaker family (ironically, as a child he wasn\'t allowed to go to the movies). During the 1920s, he briefly considered the possibility of becoming an accountant like his father before finding a job at Gaumont British Studios in 1927. He worked as tea boy, clapper boy, messenger, then cutting room assistant. By 1935, he had become chief editor of Gaumont British News until in 1939 when he began to edit feature films, notably for Anthony Asquith, Paul Czinner and Michael Powell. Amongst films he worked on were Der Roman eines Blumenmädchens (1938), Major Barbara (1941) and One of Our Aircraft Is Missing (1942). By the end of the 1930s, Lean\'s reputation as an editor was very well established.In 1942, Noël Coward gave Lean the chance to co- direct with him the war film In Which We Serve(1942).',
      birthYear: '1908',
      deathYear: '1991',
    },
    imgUrl: 'https://xl.movieposterdb.com/12_09/1962/56172/xl_56172_0cac8e1e.jpg?v=2023-02-18%2017:25:00',
  },
  {
    movieTitle: 'Rear Window',
    releaseDate: '1954',
    description: 'A wheelchair-bound photographer spies on his neighbors from his Greenwich Village courtyard apartment window, and becomes convinced one of them has committed murder, despite the skepticism of his fashion-model girlfriend.',
    genre: {
      genreName: 'Thiller',
      genreDescription: 'Thriller film, also known as suspense film or suspense thriller, is a broad film genre that evokes excitement and suspense in the audience. The suspense element found in most films\' plots is particularly exploited by the filmmaker in this genre. Tension is created by delaying what the audience sees as inevitable, and is built through situations that are menacing or where escape seems impossible.',
    },
    director: {
      directorName: 'Alfred Hitchcock',
      bio: 'Alfred Joseph Hitchcock was born in Leytonstone, Essex, England. He was the son of Emma Jane (Whelan; 1863 - 1942) and East End greengrocer William Hitchcock (1862 - 1914). His parents were both of half English and half Irish ancestry. He had two older siblings, William Hitchcock (born 1890) and Eileen Hitchcock (born 1892). Raised as a strict Catholic and attending Saint Ignatius College, a school run by Jesuits, Hitch had very much of a regular upbringing. His first job outside of the family business was in 1915 as an estimator for the Henley Telegraph and Cable Company. His interest in movies began at around this time, frequently visiting the cinema and reading US trade journals. Hitchcock entering the film industry in 1919 as a title card designer. It was there that he met Alma Reville, though they never really spoke to each other.',
      birthYear: '1899',
      deathYear: '1980',
    },
    imgUrl: 'https://xl.movieposterdb.com/13_02/1954/47396/xl_47396_9d38a56b.jpg?v=2023-02-18%2019:54:43',
  },
  {
    movieTitle: 'Interstellar',
    releaseDate: '2014',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genre: {
      genreName: 'Sci-Fi',
      genreDescription: 'Science fiction (sometimes shortened to sf or sci-fi) is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.',
    },
    director: {
      directorName: 'Christopher Nolan',
      bio: 'Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made. At 7 years old, Nolan began making short movies with his father\'s Super-8 camera. While studying English Literature at University College London, he shot 16-millimeter films at U.C.L.\'s film society, where he learned the guerrilla techniques he would later use to make his first feature, Following (1998), on a budget of around $6,000.',
      birthYear: '1970',
      deathYear: '-',
    },
    imgUrl: 'https://xl.movieposterdb.com/15_03/2014/816692/xl_816692_284eb9d5.jpg?v=2023-02-20%2018:23:18',
  },
  {
    movieTitle: 'The Silence of the Lambs',
    releaseDate: '1991',
    description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.',
    genre: {
      genreName: 'Thiller',
      genreDescription: 'Thriller film, also known as suspense film or suspense thriller, is a broad film genre that evokes excitement and suspense in the audience. The suspense element found in most films\' plots is particularly exploited by the filmmaker in this genre. Tension is created by delaying what the audience sees as inevitable, and is built through situations that are menacing or where escape seems impossible.',
    },
    director: {
      directorName: 'Jonathan Demme',
      bio: 'Jonathan Demme was born on February 22, 1944 in Baldwin, Long Island, New York, USA. He was a director and producer, known for Das Schweigen der Lämmer (1991), Philadelphia (1993) and Rachels Hochzeit (2008). He was previously married to Joanne Howard and Evelyn Purcell. He died on April 26, 2017 in Manhattan, New York City, New York, USA.',
      birthYear: '1944',
      deathYear: '2017',
    },
    imgUrl: 'https://xl.movieposterdb.com/22_10/0/305676/xl_inside-the-labyrinth-the-making-of-the-silence-of-the-lambs-movie-poster_3ff43c8d.jpg?v=2022-10-30%2022:09:42',
  },
];

// GENERAL

app.get('/', (req, res) => {
  res.status(200).send('Check this API out.');
});

app.get('/documentation', (req, res) => {
  res.status(200).send('API Documentation found.');
});

// USERS

// create user - response JSON
// an entire JSON object is too complex to include in URL - request body is needed
app.post('/users', (req, res) => {
  res.status(201).json(users);
  res.send('Success in creating a new user.');
});

// read all users - response JSON
app.get('/users', (req, res) => {
  res.status(200).json(users);
  res.send('Success in returning all user data.');
});

// update user (user name) - response text
// only updating one piece of data - no request body needed
app.put('/users/:userName', (req, res) => {
  res.status(201).send('Success in updating a user.');
});

// delete user by id - response text
app.delete('/users/:id', (req, res) => {
  res.status(201).send('Success in deleting a user.');
});

// add movie to user's favorites, assuming that there's an existing (empty) list already - response text
// only updating one piece of data - no request body needed
app.put('/users/:userName/:favoriteMovies', (req, res) => {
  res.status(201).send('Success in adding a new favorite movie to the favorites list.');
});

// delete movie off of user's favorites - response text
app.delete('/users/:userName/:favoriteMovies', (req, res) => {
  res.status(201).send('Success in deleting a movie off of the favorites list.');
});

// MOVIES

// all movies - response JSON
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
  res.send('Success in returning all movie data');
})

// single movie by movie title - response JSON
app.get('movies/:movieTitle', (req, res) => {
  res.status(200).json(movies.movieTitle);
  res.send('Success in returning a movie by title');
});

// movie genre by genre name - response JSON
app.get('movies/genres/:genreName', (req, res) => {
  res.status(200).json(movies.genre.genreDescription);
  res.send('Success in returning a genre description');
});

// single director by director name - response JSON
app.get('movies/directors/:directorName', (req, res) => {
  res.status(200).json(movies.director.directorName);
  res.send('Success in returning a director by name');
});

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
