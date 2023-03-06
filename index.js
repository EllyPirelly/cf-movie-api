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
    description: 'In the colorful future, a cab driver unwittingly becomes the central figure in the search for a legendary cosmic weapon to keep Evil and Mr. Zorg at bay.',
    genre: {
      name: 'Sci-Fi',
      description: 'Science fiction (sometimes shortened to sf or sci-fi) is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.',
    },
    director: {
      name: 'Luc Besson',
      bio: 'Luc Besson spent the first years of his life following his parents, scuba diving instructors, around the world. His early life was entirely aquatic. He already showed amazing creativity as a youth, writing early drafts of Im Rausch der Tiefe (1988) and Das fünfte Element (1997), as an adolescent bored in school. He planned on becoming a marine biologist specializing in dolphins until a diving accident at age 17 which rendered him unable to dive any longer. He moved back to Paris, where he was born, and only at age 18 did he first have an urban life or television. He realized that film was a medium which he could combine all his interests in various arts together, so he began taking odd jobs on various films. He moved to America for three years, then returned to France and formed Les Films de Loups - his own production company, which later changed its name to Les Films de Dauphins. He is now able to dive again.',
      birthYear: '1959',
      deathYear: '-',
    },
    imgUrl: 'https://xl.movieposterdb.com/07_10/1997/119116/xl_119116_392c38e7.jpg?v=2023-02-14%2022:51:07',
  },
  {
    title: 'Terminator',
    releasedate: '1984',
    description: 'A human soldier is sent from 2029 to 1984 to stop an almost indestructible cyborg killing machine, sent from the same year, which has been programmed to execute a young woman whose unborn son is the key to humanity\'s future salvation.',
    genre: {
      name: 'Sci-Fi',
      description: 'Science fiction (sometimes shortened to sf or sci-fi) is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.',
    },
    director: {
      name: 'James Cameron',
      bio: 'James Francis Cameron was born on August 16, 1954 in Kapuskasing, Ontario, Canada. He moved to the United States in 1971. The son of an engineer, he majored in physics at California State University before switching to English, and eventually dropping out. He then drove a truck to support his screenwriting ambition. He landed his first professional film job as art director, miniature-set builder, and process-projection supervisor on Roger Corman\'s Sador - Herrscher im Weltraum(1980) and had his first experience as a director with a two week stint on Fliegende Killer - Piranha II(1981) before being fired. He then wrote and directed Terminator(1984), a futuristic action - thriller starring Arnold Schwarzenegger, Michael Biehn and Linda Hamilton.It was a low budget independent film, but Cameron\'s superb, dynamic direction made it a surprise mainstream success and it is now regarded as one of the most iconic pictures of the 1980s. After this came a string of successful, bigger budget science-fiction action films such as Alien 2 - Die Rückkehr (1986), Abyss - Abgrund des Todes (1989) and Terminator 2: Tag der Abrechnung (1991). In 1990, Cameron formed his own production company, Lightstorm Entertainment. In 1997, he wrote and directed Titanic (1997), a romance epic about two young lovers from different social classes who meet on board the famous ship. The movie went on to break all box office records and earned eleven Academy Awards. It became the highest grossing movie of all time until 12 years later, Avatar - Aufbruch nach Pandora (2009), which invented and pioneered 3D film technology, and it went on to beat "Titanic", and became the first film to cost two billion dollars until 2019 when Marvel took the record. James Cameron is now one of the most sought - after directors in Hollywood.He was formerly married to producer Gale Anne Hurd, who produced several of his films.In 2000, he married actress Suzy Amis, who appeared in Titanic, and they have three children.',
      birthYear: '1954',
      deathYear: '-',
    },
    imgUrl: 'https://xl.movieposterdb.com/22_11/1991/301928/xl_the-terminator-movie-poster_c32bbde4.jpg?v=2022-11-27%2005:34:51',
  },
  {
    title: 'The Deer Hunter',
    releasedate: '1978',
    description: 'An in-depth examination of the ways in which the Vietnam War impacts and disrupts the lives of several friends in a small steel mill town in Pennsylvania.',
    genre: {
      name: 'War Drama',
      description: 'War films typically tells the story of a small group of isolated individuals who – one by one – get killed (literally or metaphorically) by an outside force until there is a final fight to the death; the idea of the protagonists facing death is a central expectation in a war film. In a war film even though the enemy may out-number, or out-power, the hero, we assume that the enemy can be defeated if only the hero can figure out how.',
    },
    director: {
      name: 'Michael Cimino',
      bio: 'Michael Cimino studied architecture and dramatic arts; later he filmed advertisements and documentaries and also wrote scripts until the actor, producer and director Clint Eastwood gave him the opportunity to direct the thriller Die Letzten beißen die Hunde (1974). But his biggest success was Die durch die Hölle gehen (1978) which won the Oscar for Best Picture. For another successful film, Der Sizilianer (1987), he got into trouble with critics when they accused him of portraying as a hero the Italian criminal Salvatore Giuliano.',
      birthYear: '1939',
      deathYear: '2016',
    },
    imgUrl: 'https://xl.movieposterdb.com/05_11/1978/0077416/xl_66645_0077416_bccd4291.jpg?v=2023-03-01%2022:47:33',
  },
  {
    title: 'Three Billboards Outside Ebbing, Missouri',
    releasedate: '2017',
    description: 'A mother personally challenges the local authorities to solve her daughter\'s murder when they fail to catch the culprit.',
    genre: {
      name: 'Drama',
      description: 'Crime dramas explore themes of truth, justice, and freedom, and contain the fundamental dichotomy of "criminal vs. lawman". Crime films make the audience jump through a series of mental "hoops"; it is not uncommon for the crime drama to use verbal gymnastics to keep the audience and the protagonist on their toes.',
    },
    director: {
      name: 'Martin McDonagh',
      bio: 'Martin McDonagh was born on March 26, 1970 in Camberwell, London, England, UK. He is a writer and director, known for Brügge sehen... und sterben? (2008), 7 Psychos (2012) and Three Billboards Outside Ebbing, Missouri (2017).',
      birthYear: '1970',
      deathYear: '-',
    },
    imgUrl: 'https://xl.movieposterdb.com/22_12/2017/5027774/xl_three-billboards-outside-ebbing-missouri-movie-poster_5a617962.jpg?v=2022-12-14%2009:05:08',
  },
  {
    title: 'Metropolis',
    releasedate: '1927',
    description: 'In a futuristic city sharply divided between the working class and the city planners, the son of the city\'s mastermind falls in love with a working-class prophet who predicts the coming of a savior to mediate their differences.',
    genre: {
      name: 'Sci-Fi',
      description: 'Science fiction (sometimes shortened to sf or sci-fi) is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.',
    },
    director: {
      name: 'Fritz Lang',
      bio: 'Fritz Lang was born in Vienna, Austria, in 1890. His father managed a construction company. His mother, Pauline Schlesinger, was Jewish but converted to Catholicism when Lang was ten. After high school, he enrolled briefly at the Technische Hochschule Wien and then started to train as a painter. From 1910 to 1914, he traveled in Europe, and he would later claim, also in Asia and North Africa. He studied painting in Paris from 1913-14. At the start of World War I, he returned to Vienna, enlisting in the army in January 1915. Severely wounded in June 1916, he wrote some scenarios for films while convalescing. In early 1918, he was sent home shell-shocked and acted briefly in Viennese theater before accepting a job as a writer at Erich Pommer\'s production company in Berlin, Decla. In Berlin, Lang worked briefly as a writer and then as a director, at Ufa and then for Nero-Film, owned by the American Seymour Nebenzal. In 1920, he began a relationship with actress and writer Thea von Harbou (1889-1954), who wrote with him the scripts for his most celebrated films: Dr. Mabuse, der Spieler (1922), Die Nibelungen: Siegfrieds Tod (1924), Metropolis (1927) and M: Eine Stadt sucht einen Mörder (1931) (credited to von Harbou alone). They married in 1922 and divorced in 1933. In that year, Nazi propaganda minister Joseph Goebbels offered Lang the job of head of the German Cinema Institute. Lang--who was an anti-Nazi mainly because of his Catholic background--did not accept the position (it was later offered to and accepted by filmmaker Leni Riefenstahl) and, after secretly sending most of his money out of the country, fled Germany to Paris. After about a year in Paris, Lang moved to the United States in mid-1934, initially under contract to MGM. Over the next 20 years, he directed numerous American films. In the 1950s, in part because the film industry was in economic decline and also because of Lang\'s long-standing reputation for being difficult with, and abusive to, actors, he found it increasingly hard to get work. At the end of the 1950s, he traveled to Germany and made what turned out to be his final three films there, none of which were well received.',
      birthYear: '1890',
      deathYear: '1976',
    },
    imgUrl: 'https://xl.movieposterdb.com/11_10/1927/17136/xl_17136_72f10c1b.jpg?v=2022-05-05%2003:01:51',
  },
  {
    title: 'Lawrence of Arabia',
    releasedate: '1962',
    description: 'The story of T.E. Lawrence, the English officer who successfully united and led the diverse, often warring, Arab tribes during World War I in order to fight the Turks.',
    genre: {
      name: 'Biography',
      description: 'A biographical film or biopic (/ˈbaɪoʊpɪk/)[1] is a film that dramatizes the life of a non-fictional or historically-based person or people. Such films show the life of a historical person and the central character\'s real name is used.[2] They differ from docudrama films and historical drama films in that they attempt to comprehensively tell a single person\'s life story or at least the most historically important years of their lives.',
    },
    director: {
      name: 'David Lean',
      bio: 'An important British filmmaker, David Lean was born in Croydon on March 25, 1908 and brought up in a strict Quaker family (ironically, as a child he wasn\'t allowed to go to the movies). During the 1920s, he briefly considered the possibility of becoming an accountant like his father before finding a job at Gaumont British Studios in 1927. He worked as tea boy, clapper boy, messenger, then cutting room assistant. By 1935, he had become chief editor of Gaumont British News until in 1939 when he began to edit feature films, notably for Anthony Asquith, Paul Czinner and Michael Powell. Amongst films he worked on were Der Roman eines Blumenmädchens (1938), Major Barbara (1941) and One of Our Aircraft Is Missing (1942). By the end of the 1930s, Lean\'s reputation as an editor was very well established.In 1942, Noël Coward gave Lean the chance to co- direct with him the war film In Which We Serve(1942).Shortly after, with the encouragement of Coward, Lean, cinematographer Ronald Neame and producer "Anthony Havelock-Allan" launched a production company called Cineguild.For that firm Lean first directed adaptations of three plays by Coward: the chronicle Wunderbare Zeiten(1944), the humorous ghost story Geisterkomödie(1945) and, most notably, the sentimental drama Begegnung(1945).Originally a box- office failure in England, "Brief Encounter" was presented at the very first Cannes film festival(1946), where it won almost unanimous praises as well as a Grand Prize. There\s more bio but too much to add here.',
      birthYear: '1908',
      deathYear: '1991',
    },
    imgUrl: 'https://xl.movieposterdb.com/12_09/1962/56172/xl_56172_0cac8e1e.jpg?v=2023-02-18%2017:25:00',
  },
  {
    title: 'Rear Window',
    releasedate: '1954',
    description: 'A wheelchair-bound photographer spies on his neighbors from his Greenwich Village courtyard apartment window, and becomes convinced one of them has committed murder, despite the skepticism of his fashion-model girlfriend.',
    genre: {
      name: 'Thiller',
      description: 'Thriller film, also known as suspense film or suspense thriller, is a broad film genre that evokes excitement and suspense in the audience.[1] The suspense element found in most films\' plots is particularly exploited by the filmmaker in this genre. Tension is created by delaying what the audience sees as inevitable, and is built through situations that are menacing or where escape seems impossible.[',
    },
    director: {
      name: 'Alfred Hitchcock',
      bio: 'Alfred Joseph Hitchcock was born in Leytonstone, Essex, England. He was the son of Emma Jane (Whelan; 1863 - 1942) and East End greengrocer William Hitchcock (1862 - 1914). His parents were both of half English and half Irish ancestry. He had two older siblings, William Hitchcock (born 1890) and Eileen Hitchcock (born 1892). Raised as a strict Catholic and attending Saint Ignatius College, a school run by Jesuits, Hitch had very much of a regular upbringing. His first job outside of the family business was in 1915 as an estimator for the Henley Telegraph and Cable Company. His interest in movies began at around this time, frequently visiting the cinema and reading US trade journals. Hitchcock entering the film industry in 1919 as a title card designer. It was there that he met Alma Reville, though they never really spoke to each other. It was only after the director for Always Tell Your Wife (1923) fell ill and Hitchcock was named director to complete the film that he and Reville began to collaborate. Hitchcock had his first real crack at directing a film, start to finish, in 1923 when he was hired to direct the film Number 13 (1922), though the production wasn\'t completed due to the studio\'s closure (he later remade it as a sound film). Hitchcock didn\'t give up then. He directed Irrgarten der Leidenschaft (1925), a British/German production, which was very popular. Hitchcock made his first trademark film in 1927, Der Mieter - Eine Geschichte aus dem Londoner Nebel (1927) . In the same year, on the 2nd of December, Hitchcock married Alma Reville. They had one child, Patricia Hitchcock who was born on July 7th, 1928. His success followed when he made a number of films in Britain such as Eine Dame verschwindet (1938) and Riff-Piraten (1939), some of which also gained him fame in the USA.',
      birthYear: '1899',
      deathYear: '1980',
    },
    imgUrl: 'https://xl.movieposterdb.com/13_02/1954/47396/xl_47396_9d38a56b.jpg?v=2023-02-18%2019:54:43',
  },
  {
    title: 'Interstellar',
    releasedate: '2014',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genre: {
      name: 'Sci-Fi',
      description: 'Science fiction (sometimes shortened to sf or sci-fi) is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.',
    },
    director: {
      name: 'Christopher Nolan',
      bio: 'Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970, in London, England. Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made. At 7 years old, Nolan began making short movies with his father\'s Super-8 camera. While studying English Literature at University College London, he shot 16-millimeter films at U.C.L.\'s film society, where he learned the guerrilla techniques he would later use to make his first feature, Following (1998), on a budget of around $6,000. The noir thriller was recognized at a number of international film festivals prior to its theatrical release and gained Nolan enough credibility that he was able to gather substantial financing for his next film.',
      birthYear: '1970',
      deathYear: '-',
    },
    imgUrl: 'https://xl.movieposterdb.com/15_03/2014/816692/xl_816692_284eb9d5.jpg?v=2023-02-20%2018:23:18',
  },
  {
    title: 'The Silence of the Lambs',
    releasedate: '1991',
    description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.',
    genre: {
      name: 'Thiller',
      description: 'Thriller film, also known as suspense film or suspense thriller, is a broad film genre that evokes excitement and suspense in the audience.[1] The suspense element found in most films\' plots is particularly exploited by the filmmaker in this genre. Tension is created by delaying what the audience sees as inevitable, and is built through situations that are menacing or where escape seems impossible.[',
    },
    director: {
      name: 'Jonathan Demme',
      bio: 'Jonathan Demme was born on February 22, 1944 in Baldwin, Long Island, New York, USA. He was a director and producer, known for Das Schweigen der Lämmer (1991), Philadelphia (1993) and Rachels Hochzeit (2008). He was previously married to Joanne Howard and Evelyn Purcell. He died on April 26, 2017 in Manhattan, New York City, New York, USA.',
      birthYear: '1944',
      deathYear: '2017',
    },
    imgUrl: 'https://xl.movieposterdb.com/22_10/0/305676/xl_inside-the-labyrinth-the-making-of-the-silence-of-the-lambs-movie-poster_3ff43c8d.jpg?v=2022-10-30%2022:09:42',
  },
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
