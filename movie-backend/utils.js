
 export function randomDirector(){
    const famousDirectors = [
        "Steven Spielberg", "Martin Scorsese", "Christopher Nolan", "Quentin Tarantino",
        "Alfred Hitchcock", "Stanley Kubrick", "James Cameron", "Ridley Scott",
        "Francis Ford Coppola", "Akira Kurosawa", "Peter Jackson", "Tim Burton",
        "David Fincher", "Guillermo del Toro", "Wes Anderson", "Denis Villeneuve",
        "The Coen Brothers", "Sergio Leone", "Clint Eastwood", "Hayao Miyazaki",
        "Orson Welles", "Federico Fellini", "Robert Zemeckis", "George Lucas",
        "Ang Lee", "Darren Aronofsky", "Paul Thomas Anderson", "M. Night Shyamalan",
        "John Carpenter", "Roman Polanski", "Frank Capra", "Brian De Palma",
        "Michael Bay", "David Lynch", "Sam Mendes", "Satyajit Ray",
        "Jean-Luc Godard", "Luis Buñuel", "Fritz Lang", "Howard Hawks",
        "Billy Wilder", "Mike Flanagan", "Baz Luhrmann", "Pedro Almodóvar",
        "Richard Linklater", "Gore Verbinski", "Rian Johnson", "Bong Joon-ho",
        "Park Chan-wook", "Taika Waititi", "Greta Gerwig", "Kathryn Bigelow",
        "Spike Lee", "Mel Brooks", "Robert Altman", "John Ford",
        "Ken Loach", "James Wan", "Edgar Wright", "Guy Ritchie",
        "David Cronenberg", "Yasujirō Ozu", "Terrence Malick", "Lars von Trier",
        "Alejandro González Iñárritu", "Ingmar Bergman", "Sidney Lumet", "Jean Renoir",
        "John Woo", "Luc Besson", "Michelangelo Antonioni", "Kenneth Branagh",
        "The Wachowskis", "Tom Hooper", "Paul Verhoeven", "George Miller",
        "Zack Snyder", "J.J. Abrams", "Chloé Zhao", "Alejandro Jodorowsky",
        "Robert Eggers", "Damien Chazelle", "Danny Boyle", "Gaspar Noé",
        "Takashi Miike", "Hideo Kojima", "Joaquin Phoenix", "David O. Russell",
        "Joseph Kosinski", "Gareth Edwards", "Alex Garland", "Brad Bird",
        "Ron Howard", "Rob Reiner", "Richard Donner", "Michael Mann",
        "Joe Dante", "Ivan Reitman", "Penny Marshall", "Paul Feig",
        "Jonathan Demme", "Blake Edwards", "Sidney Pollack", "George Cukor",
        "Christopher McQuarrie", "Bryan Singer", "Milos Forman", "Luchino Visconti",
        "Frank Darabont", "Spike Jonze", "F. Gary Gray", "Robert Rodriguez",
        "Taylor Sheridan", "John Huston", "Gareth Evans", "Ben Affleck",
        "Steve McQueen", "Joe Johnston", "Ethan Coen", "Joel Coen",
        "Rupert Sanders", "Karyn Kusama", "Lana Wachowski", "Lilly Wachowski",
        "James Gunn", "Taika Waititi", "Barry Jenkins", "Ari Aster",
        "Todd Phillips", "Adam McKay", "Lynne Ramsay", "Sean Baker",
        "Bo Burnham", "Jordan Peele", "Olivia Wilde", "Ryan Coogler",
        "Makoto Shinkai", "Mamoru Hosoda", "Hirokazu Kore-eda", "Isao Takahata",
        "Garth Jennings", "Andrew Stanton", "Pete Docter", "Genndy Tartakovsky",
        "Chris Sanders", "Brad Silberling", "Chris Columbus", "Henry Selick",
        "Bob Fosse", "Mira Nair", "Lee Daniels", "Kim Jee-woon",
        "Sion Sono", "Park Hoon-jung", "Yorgos Lanthimos", "Matthias Glasner",
        "Agnès Varda", "Jafar Panahi", "Apichatpong Weerasethakul", "Naomi Kawase",
        "Ruben Östlund", "Michel Gondry", "Alfonso Cuarón", "Luca Guadagnino",
        "Matthieu Kassovitz", "Céline Sciamma", "Paolo Sorrentino", "Joon-ho Bong",
        "James Ivory", "Florian Henckel von Donnersmarck", "Tom Tykwer", "Fatih Akin",
        "Fernando Meirelles", "Carlos Reygadas", "Gus Van Sant", "Ava DuVernay",
        "John Waters", "Sofia Coppola", "David Slade", "Justin Lin",
        "Timur Bekmambetov", "Paul W.S. Anderson", "Nicolas Winding Refn", "Olivier Assayas",
        "Andrew Niccol", "Stephen Chow", "Ralph Bakshi", "Sergei Eisenstein",
        "Buster Keaton", "Charlie Chaplin", "Mel Gibson", "John Singleton",
        "Barry Levinson", "Don Bluth", "Henry Hathaway", "King Vidor",
        "Sam Peckinpah", "Curtis Hanson", "Peter Weir", "Claude Chabrol",
        "Jia Zhangke", "Hany Abu-Assad", "Vittorio De Sica", "Rob Zombie",
        "Jorge Furtado", "Errol Morris", "Werner Herzog", "Sergio Corbucci"
    ];


    let randomNumber=Math.floor(Math.random()*famousDirectors.length);

    return famousDirectors[randomNumber]
    
}

export function randomYear(year) {
    let  randomYear = Math.floor(Math.random()*11)-5
    let answer= year + randomYear 
    return String(answer)
 }



 



export function randomActor(){
    const famousActors = [
        "Robert De Niro", "Al Pacino", "Marlon Brando", "Leonardo DiCaprio", "Denzel Washington",
        "Tom Hanks", "Johnny Depp", "Brad Pitt", "Morgan Freeman", "Jack Nicholson",
        "Anthony Hopkins", "Matt Damon", "Christian Bale", "Joaquin Phoenix", "Samuel L. Jackson",
        "Tom Cruise", "Will Smith", "Robert Downey Jr.", "Chris Hemsworth", "Chris Evans",
        "Hugh Jackman", "Jake Gyllenhaal", "Ryan Reynolds", "Keanu Reeves", "Mark Ruffalo",
        "Michael Fassbender", "Benedict Cumberbatch", "Daniel Day-Lewis", "Russell Crowe", "Javier Bardem",
        "Gary Oldman", "Edward Norton", "James McAvoy", "Ewan McGregor", "Colin Farrell",
        "Idris Elba", "Viggo Mortensen", "Andy Serkis", "Sean Connery", "Harrison Ford",
        "George Clooney", "Clint Eastwood", "Sylvester Stallone", "Arnold Schwarzenegger", "Bruce Willis",
        "Mel Gibson", "Nicolas Cage", "Kevin Spacey", "Steve Carell", "Jim Carrey",
        "Robin Williams", "Bill Murray", "Adam Sandler", "Ben Stiller", "Owen Wilson",
        "Zach Galifianakis", "Jason Bateman", "Paul Rudd", "Steve Buscemi", "John Travolta",
        "Jude Law", "Chiwetel Ejiofor", "Mahershala Ali", "Tom Hardy", "Joseph Gordon-Levitt",
        "Jesse Eisenberg", "Andrew Garfield", "Oscar Isaac", "Donald Glover", "Rami Malek",
        "Pedro Pascal", "Dave Bautista", "John Cena", "Dwayne Johnson", "Vin Diesel",
        "Timothée Chalamet", "Florence Pugh", "Zendaya", "Anya Taylor-Joy", "Saoirse Ronan",
        "Emma Stone", "Scarlett Johansson", "Natalie Portman", "Anne Hathaway", "Jessica Chastain",
        "Charlize Theron", "Meryl Streep", "Viola Davis", "Frances McDormand", "Cate Blanchett",
        "Angelina Jolie", "Julia Roberts", "Sandra Bullock", "Nicole Kidman", "Reese Witherspoon",
        "Margot Robbie", "Lupita Nyong'o", "Gal Gadot", "Tilda Swinton", "Rachel McAdams",
        "Kate Winslet", "Helen Mirren", "Glenn Close", "Sigourney Weaver", "Jodie Foster",
        "Winona Ryder", "Drew Barrymore", "Sarah Paulson", "Rosamund Pike", "Gillian Anderson",
        "Jennifer Lawrence", "Amy Adams", "Emma Watson", "Kristen Stewart", "Elizabeth Olsen",
        "Melissa McCarthy", "Maggie Smith", "Helena Bonham Carter", "Emily Blunt", "Toni Collette",
        "Salma Hayek", "Penélope Cruz", "Sofia Vergara", "Monica Bellucci", "Zoe Saldana",
        "Michelle Yeoh", "Lucy Liu", "Awkwafina", "Sandra Oh", "Ming-Na Wen",
        "Maggie Q", "Rinko Kikuchi", "Gong Li", "Zhang Ziyi", "Fan Bingbing",
        "Chow Yun-Fat", "Tony Leung", "Jackie Chan", "Jet Li", "Donnie Yen",
        "Ken Watanabe", "Hiroyuki Sanada", "Song Kang-ho", "Lee Byung-hun", "Park Seo-joon",
        "Irrfan Khan", "Nawazuddin Siddiqui", "Rajkummar Rao", "Shah Rukh Khan", "Amitabh Bachchan",
        "Salman Khan", "Aamir Khan", "Hrithik Roshan", "Ranveer Singh", "Varun Dhawan",
        "Vicky Kaushal", "Deepika Padukone", "Priyanka Chopra", "Kangana Ranaut", "Alia Bhatt",
        "Anushka Sharma", "Kareena Kapoor", "Madhuri Dixit", "Rani Mukerji", "Vidya Balan",
        "Naseeruddin Shah", "Om Puri", "Paresh Rawal", "Anupam Kher", "Manoj Bajpayee",
        "Mammootty", "Mohanlal", "Vijay Sethupathi", "Suriya", "Dhanush",
        "Mahesh Babu", "Pawan Kalyan", "Allu Arjun", "Ram Charan", "NTR Jr.",
        "Yash", "Prabhas", "Rajinikanth", "Kamal Haasan", "Dulquer Salmaan",
        "Fahadh Faasil", "Nani", "Vijay Deverakonda", "Tovino Thomas", "Jayam Ravi",
        "Samantha Ruth Prabhu", "Nayanthara", "Keerthy Suresh", "Rashmika Mandanna", "Tamannaah Bhatia",
        "Jennifer Aniston", "Courteney Cox", "Lisa Kudrow", "David Schwimmer", "Matthew Perry",
        "Matt LeBlanc", "Bryan Cranston", "Aaron Paul", "Bob Odenkirk", "Giancarlo Esposito",
        "Jon Hamm", "Elisabeth Moss", "Christina Hendricks", "Kiernan Shipka", "January Jones",
        "Sterling K. Brown", "Mandy Moore", "Milo Ventimiglia", "Maggie Gyllenhaal", "Jake Gyllenhaal",
        "Cillian Murphy", "Brendan Gleeson", "Colin Farrell", "Saoirse Ronan", "Pierce Brosnan",
        "Daniel Craig", "Sean Bean", "Timothy Dalton", "Roger Moore", "David Tennant",
        "Matt Smith", "Peter Capaldi", "Jodie Whittaker", "Christopher Eccleston", "Hugh Grant",
        "Rowan Atkinson", "Stephen Fry", "Emma Thompson", "Kenneth Branagh", "Helena Bonham Carter",
        "Ben Kingsley", "Dev Patel", "Riz Ahmed", "Indira Varma", "Felicity Jones",
        "Eddie Redmayne", "Tom Hiddleston", "Taron Egerton", "Richard Madden", "Kit Harington",
        "Maisie Williams", "Sophie Turner", "Lena Headey", "Nikolaj Coster-Waldau", "Peter Dinklage",
        "Jason Momoa", "Emilia Clarke", "Mark Hamill", "Carrie Fisher", "Harrison Ford",
        "Billy Dee Williams", "Daisy Ridley", "Adam Driver", "Oscar Isaac", "John Boyega",
        "Michael B. Jordan", "Chadwick Boseman", "Lupita Nyong'o", "Danai Gurira", "Letitia Wright",
        "Chris Pratt", "Zoe Saldana", "Vin Diesel", "Dave Bautista", "Karen Gillan",
        "Jeremy Renner", "Paul Bettany", "Elizabeth Debicki", "Jeff Goldblum", "Sam Neill",
        "Laura Dern", "Bryce Dallas Howard", "Chris Pine", "Karl Urban", "Zachary Quinto",
        "Simon Pegg", "John Cho", "Anton Yelchin", "Rebecca Ferguson", "Sean Penn",
        "Adrien Brody", "Jared Leto", "Willem Dafoe", "Christoph Waltz", "Daniel Brühl",
        "Jean Dujardin", "Omar Sy", "Vincent Cassel", "Gérard Depardieu", "Tahar Rahim",
        "Gael García Bernal", "Diego Luna", "Pedro Almodóvar", "Javier Cámara", "Ricardo Darín",
        "Lino Ventura", "Alain Delon", "Jean-Paul Belmondo", "Toshiro Mifune", "Setsuko Hara",
        "Masaki Kobayashi", "Ken Takakura", "Takashi Shimura", "Issei Takahashi", "Joe Odagiri"
    ];


    let randomNumber=Math.floor(Math.random()*famousActors.length)
    return famousActors[randomNumber]
    
}


export function getARandomMovie(){

    const famousMovies = [
        "The Godfather", "The Shawshank Redemption", "Schindler's List", "Forrest Gump",
        "The Dark Knight", "Inception", "Pulp Fiction", "Fight Club", "The Matrix",
        "The Lord of the Rings: The Return of the King", "The Lord of the Rings: The Fellowship of the Ring",
        "The Lord of the Rings: The Two Towers", "Titanic", "Gladiator", "Interstellar",
        "Goodfellas", "Saving Private Ryan", "The Silence of the Lambs", "The Green Mile",
        "Parasite", "Joker", "Se7en", "Django Unchained", "Avengers: Endgame",
        "Avengers: Infinity War", "The Prestige", "The Departed", "The Lion King (1994)",
        "Back to the Future", "Star Wars: A New Hope", "Star Wars: The Empire Strikes Back",
        "Star Wars: Return of the Jedi", "Indiana Jones: Raiders of the Lost Ark",
        "Indiana Jones: The Last Crusade", "The Grand Budapest Hotel", "Whiplash",
        "A Beautiful Mind", "The Truman Show", "Blade Runner", "Blade Runner 2049",
        "No Country for Old Men", "There Will Be Blood", "12 Angry Men", "Casablanca",
        "Citizen Kane", "The Shining", "It’s a Wonderful Life", "The Pianist",
        "One Flew Over the Cuckoo’s Nest", "Spirited Away", "Grave of the Fireflies",
        "Your Name", "Coco", "Up", "WALL-E", "Finding Nemo", "Ratatouille",
        "Toy Story", "Toy Story 3", "The Incredibles", "The Iron Giant",
        "Howl’s Moving Castle", "Akira", "The Wolf of Wall Street", "A Clockwork Orange",
        "Requiem for a Dream", "The Sixth Sense", "The Social Network", "The Revenant",
        "Mad Max: Fury Road", "The Hateful Eight", "Kill Bill: Vol. 1",
        "Kill Bill: Vol. 2", "The Big Lebowski", "Eternal Sunshine of the Spotless Mind",
        "The Irishman", "Once Upon a Time in Hollywood", "Bohemian Rhapsody",
        "La La Land", "Arrival", "Her", "Prisoners", "Shutter Island",
        "The Girl with the Dragon Tattoo", "Logan", "Deadpool", "Spider-Man: Into the Spider-Verse",
        "Guardians of the Galaxy", "The Batman (2022)", "Doctor Strange", "Thor: Ragnarok",
        "John Wick", "John Wick: Chapter 2", "John Wick: Chapter 3 – Parabellum",
        "Casino Royale", "Skyfall", "The Bourne Identity", "The Bourne Ultimatum",
        "The Hunt", "Oldboy", "Train to Busan", "The Handmaiden"
    ];
    
    
    let randomNumber=Math.floor(Math.random()*famousMovies.length)
    return famousMovies[randomNumber]
}




export const getQuizQuestionType=()=>{
    const types =["director","cast","year","plot"];
    return types[Math.floor(Math.random()*types.length)]
}


export const getMovieOrDialogue = () => {return Math.random()>0.3?"movie":"dialogue"}


