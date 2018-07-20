function getPgaCookieName(address) {
    return address + '/pga-r2018-490';
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
    return '';
}

function getPgaIdsFromCookie() {
    var lineupCookie = getCookie(getPgaCookieName());
    if (lineupCookie) {
        return lineupCookie.split(':')
    } else {
        return []
    }
}

function getSelectedGolfersFromCookie() {
    var allGolfers = getGolfers();
    var pgaIdsFromCookie = getPgaIdsFromCookie();
    var selectedGolfersFromCookie = [];
    var index;
    for (index in allGolfers) {
        var golfer = allGolfers[index];
        if (pgaIdsFromCookie.indexOf(String(golfer.pga_id)) > -1) {
            selectedGolfersFromCookie.push(golfer)
        }
    }
    return selectedGolfersFromCookie
}

function getGolfers() {
  return [
    {
        "name": "Tony Finau",
        "pga_id": 29725,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 23
    },
    {
        "name": "Phil Mickelson",
        "pga_id": 1810,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 22
    },
    {
        "name": "Bubba Watson",
        "pga_id": 25804,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 22
    },
    {
        "name": "Webb Simpson",
        "pga_id": 29221,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 21
    },
    {
        "name": "Russell Henley",
        "pga_id": 34098,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 20
    },
    {
        "name": "Xander Schauffele",
        "pga_id": 48081,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 20
    },
    {
        "name": "Joaquin Niemann",
        "pga_id": 45486,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 19
    },
    {
        "name": "Brian Harman",
        "pga_id": 27644,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 19
    },
    {
        "name": "Jimmy Walker",
        "pga_id": 25632,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 18
    },
    {
        "name": "J.B. Holmes",
        "pga_id": 27141,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 18
    },
    {
        "name": "Ryan Moore",
        "pga_id": 26596,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 17
    },
    {
        "name": "Danny Lee",
        "pga_id": 29926,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 17
    },
    {
        "name": "Kevin Na",
        "pga_id": 25396,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 17
    },
    {
        "name": "Kevin Streelman",
        "pga_id": 27214,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 17
    },
    {
        "name": "Keegan Bradley",
        "pga_id": 33141,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 17
    },
    {
        "name": "Brandt Snedeker",
        "pga_id": 27649,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 16
    },
    {
        "name": "Anirban Lahiri",
        "pga_id": 31420,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 16
    },
    {
        "name": "Jamie Lovemark",
        "pga_id": 29461,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 16
    },
    {
        "name": "Brian Gay",
        "pga_id": 19846,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 16
    },
    {
        "name": "Kevin Kisner",
        "pga_id": 29478,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 16
    },
    {
        "name": "Aaron Wise",
        "pga_id": 49964,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Ryan Blaum",
        "pga_id": 27958,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Patrick Rodgers",
        "pga_id": 36699,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Andrew Putnam",
        "pga_id": 34256,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Ryan Armour",
        "pga_id": 19803,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Kevin Chappell",
        "pga_id": 32366,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Ollie Schniederjans",
        "pga_id": 46501,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Scott Piercy",
        "pga_id": 25818,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Austin Cook",
        "pga_id": 46435,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Wesley Bryan",
        "pga_id": 48084,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Keith Mitchell",
        "pga_id": 39546,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Joel Dahmen",
        "pga_id": 34076,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Matt Jones",
        "pga_id": 26300,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "J.J. Spaun",
        "pga_id": 39324,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Richy Werenski",
        "pga_id": 47128,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Brandon Hagy",
        "pga_id": 46550,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Seamus Power",
        "pga_id": 28252,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Nick Watney",
        "pga_id": 27095,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Abraham Ancer",
        "pga_id": 45526,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Stephan Jaeger",
        "pga_id": 36799,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Johnson Wagner",
        "pga_id": 26951,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "David Lingmerth",
        "pga_id": 34409,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Bill Haas",
        "pga_id": 24924,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Kelly Kraft",
        "pga_id": 35879,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Rory Sabbatini",
        "pga_id": 23621,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Trey Mullinax",
        "pga_id": 46601,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "J.T. Poston",
        "pga_id": 49771,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "William McGirt",
        "pga_id": 31202,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "James Hahn",
        "pga_id": 32448,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Tom Hoge",
        "pga_id": 35532,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Brandon Harkins",
        "pga_id": 35421,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Alex Cejka",
        "pga_id": 20472,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Tyler Duncan",
        "pga_id": 45609,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Denny McCarthy",
        "pga_id": 47993,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Ben Crane",
        "pga_id": 23541,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Zac Blair",
        "pga_id": 40058,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "George McNeill",
        "pga_id": 24490,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Chris Stroud",
        "pga_id": 27963,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Brice Garnett",
        "pga_id": 29535,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Robert Streb",
        "pga_id": 34431,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Whee Kim",
        "pga_id": 37454,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Chase Seiffert",
        "pga_id": 39953,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Corey Conners",
        "pga_id": 39997,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Bronson Burgoon",
        "pga_id": 29268,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Cameron Percy",
        "pga_id": 22056,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Jim Furyk",
        "pga_id": 10809,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 14
    },
    {
        "name": "Peter Malnati",
        "pga_id": 34466,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Mackenzie Hughes",
        "pga_id": 35506,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Chad Campbell",
        "pga_id": 12510,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Nick Taylor",
        "pga_id": 25493,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Scott Stallings",
        "pga_id": 30692,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Harris English",
        "pga_id": 34099,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Dominic Bozzelli",
        "pga_id": 40009,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Nicholas Lindheim",
        "pga_id": 37278,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Shawn Stefani",
        "pga_id": 33418,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Jonas Blixt",
        "pga_id": 27895,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Vijay Singh",
        "pga_id": 6567,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Sean O'Hair",
        "pga_id": 24140,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Michael Kim",
        "pga_id": 39975,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Martin Flores",
        "pga_id": 28500,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Robert Garrigus",
        "pga_id": 24358,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "John Huh",
        "pga_id": 34174,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Michael Thompson",
        "pga_id": 32150,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "John Peterson",
        "pga_id": 35541,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Sam Ryder",
        "pga_id": 37275,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Vaughn Taylor",
        "pga_id": 23325,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Patton Kizzire",
        "pga_id": 32757,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Hudson Swafford",
        "pga_id": 34264,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Ken Duke",
        "pga_id": 20104,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Jason Kokrak",
        "pga_id": 30944,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Derek Fathauer",
        "pga_id": 31416,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Sam Saunders",
        "pga_id": 29223,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Ben Silverman",
        "pga_id": 39327,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Tom Lovelady",
        "pga_id": 50526,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Lanto Griffin",
        "pga_id": 35310,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Conrad Shindler",
        "pga_id": 39328,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "David Hearn",
        "pga_id": 26758,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Cody Gribble",
        "pga_id": 39954,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Scott Brown",
        "pga_id": 29479,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Geoff Ogilvy",
        "pga_id": 22046,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Tyrone Van Aswegen",
        "pga_id": 28132,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "J.J. Henry",
        "pga_id": 23353,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Steve Marino",
        "pga_id": 28158,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Cameron Tringale",
        "pga_id": 33419,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Brett Stegmaier",
        "pga_id": 29485,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Steve Wheatcroft",
        "pga_id": 25892,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Daniel Summerhays",
        "pga_id": 25834,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Tim Herron",
        "pga_id": 12782,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "John Merrick",
        "pga_id": 27933,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Sam O'Dell",
        "pga_id": 47958,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Norman Xiong",
        "pga_id": 54328,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Omar Uresti",
        "pga_id": 8385,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Rob Oppenheim",
        "pga_id": 27942,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Zecheng Dou",
        "pga_id": 37338,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Andrew Yun",
        "pga_id": 35544,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Will Claxton",
        "pga_id": 28455,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Ricky Barnes",
        "pga_id": 24846,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Stuart Appleby",
        "pga_id": 20098,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Parker McLachlin",
        "pga_id": 24449,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Matt Every",
        "pga_id": 28307,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Blayne Barber",
        "pga_id": 35545,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Bob Estes",
        "pga_id": 1320,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Martin Piller",
        "pga_id": 32876,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Talor Gooch",
        "pga_id": 46402,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Adam Schenk",
        "pga_id": 47347,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Ethan Tracy",
        "pga_id": 47287,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Jonathan Byrd",
        "pga_id": 24925,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Jason Gore",
        "pga_id": 22892,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Robert Allenby",
        "pga_id": 10885,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Troy Matteson",
        "pga_id": 27120,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Smylie Kaufman",
        "pga_id": 46440,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Tommy Gainey",
        "pga_id": 30750,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "John Daly",
        "pga_id": 1249,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Davey Jude",
        "pga_id": 51833,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Devin Gee",
        "pga_id": 37065,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Jon Curran",
        "pga_id": 34262,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Chris Couch",
        "pga_id": 11123,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Xinjun Zhang",
        "pga_id": 32254,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Jonathan Randolph",
        "pga_id": 34358,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Matt Atkins",
        "pga_id": 47125,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Kyle Thompson",
        "pga_id": 22582,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Brendon de Jonge",
        "pga_id": 23638,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Steven Bowditch",
        "pga_id": 25274,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 12
    },
    {
        "name": "Ted Potter, Jr.",
        "pga_id": 27556,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 15
    },
    {
        "name": "Fabi\u00e1n G\u00f3mez",
        "pga_id": 28679,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    },
    {
        "name": "Billy Hurley III",
        "pga_id": 29222,
        "thursday_tee_timestamp": 1530791760,
        "eth_salary": 13
    }
  ]
}

export {getGolfers, getSelectedGolfersFromCookie, getPgaCookieName};
