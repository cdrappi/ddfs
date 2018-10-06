function getPgaCookieName(address) {
    return address + '/pga-r2018-490';
}

function getCookie(name) {
    return localStorage.getItem(name);
}

function getPgaIdsFromCookie(address) {
    var lineupCookie = getCookie(getPgaCookieName(address));
    if (lineupCookie) {
        return lineupCookie.split(':')
    } else {
        return []
    }
}

function getRevealKeyFromCookie(address) {
    return getCookie(getPgaCookieName(address)+'key');
}

function getSelectedGolfersFromCookie(address) {
    var allGolfers = getGolfers();
    var pgaIdsFromCookie = getPgaIdsFromCookie(address);
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
            "pga_id": "29725",
            "name": "Tony Finau",
            "eth_salary": 23
        },
        {
            "pga_id": "01810",
            "name": "Phil Mickelson",
            "eth_salary": 22
        },
        {
            "pga_id": "25804",
            "name": "Bubba Watson",
            "eth_salary": 22
        },
        {
            "pga_id": "29221",
            "name": "Webb Simpson",
            "eth_salary": 21
        },
        {
            "pga_id": "34098",
            "name": "Russell Henley",
            "eth_salary": 20
        },
        {
            "pga_id": "48081",
            "name": "Xander Schauffele",
            "eth_salary": 20
        },
        {
            "pga_id": "45486",
            "name": "Joaquin Niemann",
            "eth_salary": 19
        },
        {
            "pga_id": "27644",
            "name": "Brian Harman",
            "eth_salary": 19
        },
        {
            "pga_id": "25632",
            "name": "Jimmy Walker",
            "eth_salary": 18
        },
        {
            "pga_id": "27141",
            "name": "J.B. Holmes",
            "eth_salary": 18
        },
        {
            "pga_id": "26596",
            "name": "Ryan Moore",
            "eth_salary": 17
        },
        {
            "pga_id": "29926",
            "name": "Danny Lee",
            "eth_salary": 17
        },
        {
            "pga_id": "25396",
            "name": "Kevin Na",
            "eth_salary": 17
        },
        {
            "pga_id": "27214",
            "name": "Kevin Streelman",
            "eth_salary": 17
        },
        {
            "pga_id": "33141",
            "name": "Keegan Bradley",
            "eth_salary": 17
        },
        {
            "pga_id": "27649",
            "name": "Brandt Snedeker",
            "eth_salary": 16
        },
        {
            "pga_id": "31420",
            "name": "Anirban Lahiri",
            "eth_salary": 16
        },
        {
            "pga_id": "29461",
            "name": "Jamie Lovemark",
            "eth_salary": 16
        },
        {
            "pga_id": "19846",
            "name": "Brian Gay",
            "eth_salary": 16
        },
        {
            "pga_id": "29478",
            "name": "Kevin Kisner",
            "eth_salary": 16
        },
        {
            "pga_id": "49964",
            "name": "Aaron Wise",
            "eth_salary": 15
        },
        {
            "pga_id": "27958",
            "name": "Ryan Blaum",
            "eth_salary": 15
        },
        {
            "pga_id": "36699",
            "name": "Patrick Rodgers",
            "eth_salary": 15
        },
        {
            "pga_id": "34256",
            "name": "Andrew Putnam",
            "eth_salary": 15
        },
        {
            "pga_id": "19803",
            "name": "Ryan Armour",
            "eth_salary": 15
        },
        {
            "pga_id": "32366",
            "name": "Kevin Chappell",
            "eth_salary": 15
        },
        {
            "pga_id": "46501",
            "name": "Ollie Schniederjans",
            "eth_salary": 15
        },
        {
            "pga_id": "25818",
            "name": "Scott Piercy",
            "eth_salary": 15
        },
        {
            "pga_id": "46435",
            "name": "Austin Cook",
            "eth_salary": 15
        },
        {
            "pga_id": "48084",
            "name": "Wesley Bryan",
            "eth_salary": 15
        },
        {
            "pga_id": "39546",
            "name": "Keith Mitchell",
            "eth_salary": 15
        },
        {
            "pga_id": "34076",
            "name": "Joel Dahmen",
            "eth_salary": 15
        },
        {
            "pga_id": "26300",
            "name": "Matt Jones",
            "eth_salary": 15
        },
        {
            "pga_id": "39324",
            "name": "J.J. Spaun",
            "eth_salary": 14
        },
        {
            "pga_id": "47128",
            "name": "Richy Werenski",
            "eth_salary": 14
        },
        {
            "pga_id": "46550",
            "name": "Brandon Hagy",
            "eth_salary": 14
        },
        {
            "pga_id": "28252",
            "name": "Seamus Power",
            "eth_salary": 14
        },
        {
            "pga_id": "27095",
            "name": "Nick Watney",
            "eth_salary": 14
        },
        {
            "pga_id": "45526",
            "name": "Abraham Ancer",
            "eth_salary": 14
        },
        {
            "pga_id": "36799",
            "name": "Stephan Jaeger",
            "eth_salary": 14
        },
        {
            "pga_id": "26951",
            "name": "Johnson Wagner",
            "eth_salary": 14
        },
        {
            "pga_id": "34409",
            "name": "David Lingmerth",
            "eth_salary": 14
        },
        {
            "pga_id": "24924",
            "name": "Bill Haas",
            "eth_salary": 14
        },
        {
            "pga_id": "35879",
            "name": "Kelly Kraft",
            "eth_salary": 14
        },
        {
            "pga_id": "23621",
            "name": "Rory Sabbatini",
            "eth_salary": 14
        },
        {
            "pga_id": "46601",
            "name": "Trey Mullinax",
            "eth_salary": 14
        },
        {
            "pga_id": "49771",
            "name": "J.T. Poston",
            "eth_salary": 14
        },
        {
            "pga_id": "31202",
            "name": "William McGirt",
            "eth_salary": 14
        },
        {
            "pga_id": "32448",
            "name": "James Hahn",
            "eth_salary": 14
        },
        {
            "pga_id": "35532",
            "name": "Tom Hoge",
            "eth_salary": 14
        },
        {
            "pga_id": "35421",
            "name": "Brandon Harkins",
            "eth_salary": 14
        },
        {
            "pga_id": "20472",
            "name": "Alex Cejka",
            "eth_salary": 14
        },
        {
            "pga_id": "45609",
            "name": "Tyler Duncan",
            "eth_salary": 14
        },
        {
            "pga_id": "47993",
            "name": "Denny McCarthy",
            "eth_salary": 14
        },
        {
            "pga_id": "23541",
            "name": "Ben Crane",
            "eth_salary": 14
        },
        {
            "pga_id": "40058",
            "name": "Zac Blair",
            "eth_salary": 14
        },
        {
            "pga_id": "24490",
            "name": "George McNeill",
            "eth_salary": 14
        },
        {
            "pga_id": "27963",
            "name": "Chris Stroud",
            "eth_salary": 14
        },
        {
            "pga_id": "29535",
            "name": "Brice Garnett",
            "eth_salary": 14
        },
        {
            "pga_id": "34431",
            "name": "Robert Streb",
            "eth_salary": 14
        },
        {
            "pga_id": "37454",
            "name": "Whee Kim",
            "eth_salary": 14
        },
        {
            "pga_id": "39953",
            "name": "Chase Seiffert",
            "eth_salary": 14
        },
        {
            "pga_id": "39997",
            "name": "Corey Conners",
            "eth_salary": 14
        },
        {
            "pga_id": "29268",
            "name": "Bronson Burgoon",
            "eth_salary": 14
        },
        {
            "pga_id": "22056",
            "name": "Cameron Percy",
            "eth_salary": 14
        },
        {
            "pga_id": "10809",
            "name": "Jim Furyk",
            "eth_salary": 14
        },
        {
            "pga_id": "34466",
            "name": "Peter Malnati",
            "eth_salary": 13
        },
        {
            "pga_id": "35506",
            "name": "Mackenzie Hughes",
            "eth_salary": 13
        },
        {
            "pga_id": "12510",
            "name": "Chad Campbell",
            "eth_salary": 13
        },
        {
            "pga_id": "25493",
            "name": "Nick Taylor",
            "eth_salary": 13
        },
        {
            "pga_id": "30692",
            "name": "Scott Stallings",
            "eth_salary": 13
        },
        {
            "pga_id": "34099",
            "name": "Harris English",
            "eth_salary": 13
        },
        {
            "pga_id": "40009",
            "name": "Dominic Bozzelli",
            "eth_salary": 13
        },
        {
            "pga_id": "37278",
            "name": "Nicholas Lindheim",
            "eth_salary": 13
        },
        {
            "pga_id": "33418",
            "name": "Shawn Stefani",
            "eth_salary": 13
        },
        {
            "pga_id": "27895",
            "name": "Jonas Blixt",
            "eth_salary": 13
        },
        {
            "pga_id": "06567",
            "name": "Vijay Singh",
            "eth_salary": 13
        },
        {
            "pga_id": "24140",
            "name": "Sean O'Hair",
            "eth_salary": 13
        },
        {
            "pga_id": "39975",
            "name": "Michael Kim",
            "eth_salary": 13
        },
        {
            "pga_id": "28500",
            "name": "Martin Flores",
            "eth_salary": 13
        },
        {
            "pga_id": "24358",
            "name": "Robert Garrigus",
            "eth_salary": 13
        },
        {
            "pga_id": "34174",
            "name": "John Huh",
            "eth_salary": 13
        },
        {
            "pga_id": "32150",
            "name": "Michael Thompson",
            "eth_salary": 13
        },
        {
            "pga_id": "35541",
            "name": "John Peterson",
            "eth_salary": 13
        },
        {
            "pga_id": "37275",
            "name": "Sam Ryder",
            "eth_salary": 13
        },
        {
            "pga_id": "23325",
            "name": "Vaughn Taylor",
            "eth_salary": 13
        },
        {
            "pga_id": "32757",
            "name": "Patton Kizzire",
            "eth_salary": 13
        },
        {
            "pga_id": "34264",
            "name": "Hudson Swafford",
            "eth_salary": 13
        },
        {
            "pga_id": "20104",
            "name": "Ken Duke",
            "eth_salary": 13
        },
        {
            "pga_id": "30944",
            "name": "Jason Kokrak",
            "eth_salary": 13
        },
        {
            "pga_id": "31416",
            "name": "Derek Fathauer",
            "eth_salary": 13
        },
        {
            "pga_id": "29223",
            "name": "Sam Saunders",
            "eth_salary": 13
        },
        {
            "pga_id": "39327",
            "name": "Ben Silverman",
            "eth_salary": 13
        },
        {
            "pga_id": "50526",
            "name": "Tom Lovelady",
            "eth_salary": 13
        },
        {
            "pga_id": "35310",
            "name": "Lanto Griffin",
            "eth_salary": 13
        },
        {
            "pga_id": "39328",
            "name": "Conrad Shindler",
            "eth_salary": 13
        },
        {
            "pga_id": "26758",
            "name": "David Hearn",
            "eth_salary": 13
        },
        {
            "pga_id": "39954",
            "name": "Cody Gribble",
            "eth_salary": 13
        },
        {
            "pga_id": "29479",
            "name": "Scott Brown",
            "eth_salary": 13
        },
        {
            "pga_id": "22046",
            "name": "Geoff Ogilvy",
            "eth_salary": 13
        },
        {
            "pga_id": "28132",
            "name": "Tyrone Van Aswegen",
            "eth_salary": 13
        },
        {
            "pga_id": "23353",
            "name": "J.J. Henry",
            "eth_salary": 13
        },
        {
            "pga_id": "28158",
            "name": "Steve Marino",
            "eth_salary": 13
        },
        {
            "pga_id": "33419",
            "name": "Cameron Tringale",
            "eth_salary": 13
        },
        {
            "pga_id": "29485",
            "name": "Brett Stegmaier",
            "eth_salary": 13
        },
        {
            "pga_id": "25892",
            "name": "Steve Wheatcroft",
            "eth_salary": 13
        },
        {
            "pga_id": "25834",
            "name": "Daniel Summerhays",
            "eth_salary": 13
        },
        {
            "pga_id": "12782",
            "name": "Tim Herron",
            "eth_salary": 13
        },
        {
            "pga_id": "27933",
            "name": "John Merrick",
            "eth_salary": 13
        },
        {
            "pga_id": "47958",
            "name": "Sam O'Dell",
            "eth_salary": 13
        },
        {
            "pga_id": "54328",
            "name": "Norman Xiong",
            "eth_salary": 13
        },
        {
            "pga_id": "08385",
            "name": "Omar Uresti",
            "eth_salary": 13
        },
        {
            "pga_id": "27942",
            "name": "Rob Oppenheim",
            "eth_salary": 13
        },
        {
            "pga_id": "37338",
            "name": "Zecheng Dou",
            "eth_salary": 13
        },
        {
            "pga_id": "35544",
            "name": "Andrew Yun",
            "eth_salary": 13
        },
        {
            "pga_id": "28455",
            "name": "Will Claxton",
            "eth_salary": 13
        },
        {
            "pga_id": "24846",
            "name": "Ricky Barnes",
            "eth_salary": 13
        },
        {
            "pga_id": "20098",
            "name": "Stuart Appleby",
            "eth_salary": 13
        },
        {
            "pga_id": "24449",
            "name": "Parker McLachlin",
            "eth_salary": 13
        },
        {
            "pga_id": "28307",
            "name": "Matt Every",
            "eth_salary": 12
        },
        {
            "pga_id": "35545",
            "name": "Blayne Barber",
            "eth_salary": 12
        },
        {
            "pga_id": "01320",
            "name": "Bob Estes",
            "eth_salary": 12
        },
        {
            "pga_id": "32876",
            "name": "Martin Piller",
            "eth_salary": 12
        },
        {
            "pga_id": "46402",
            "name": "Talor Gooch",
            "eth_salary": 12
        },
        {
            "pga_id": "47347",
            "name": "Adam Schenk",
            "eth_salary": 12
        },
        {
            "pga_id": "47287",
            "name": "Ethan Tracy",
            "eth_salary": 12
        },
        {
            "pga_id": "24925",
            "name": "Jonathan Byrd",
            "eth_salary": 12
        },
        {
            "pga_id": "22892",
            "name": "Jason Gore",
            "eth_salary": 12
        },
        {
            "pga_id": "10885",
            "name": "Robert Allenby",
            "eth_salary": 12
        },
        {
            "pga_id": "27120",
            "name": "Troy Matteson",
            "eth_salary": 12
        },
        {
            "pga_id": "46440",
            "name": "Smylie Kaufman",
            "eth_salary": 12
        },
        {
            "pga_id": "30750",
            "name": "Tommy Gainey",
            "eth_salary": 12
        },
        {
            "pga_id": "01249",
            "name": "John Daly",
            "eth_salary": 12
        },
        {
            "pga_id": "51833",
            "name": "Davey Jude",
            "eth_salary": 12
        },
        {
            "pga_id": "37065",
            "name": "Devin Gee",
            "eth_salary": 12
        },
        {
            "pga_id": "34262",
            "name": "Jon Curran",
            "eth_salary": 12
        },
        {
            "pga_id": "11123",
            "name": "Chris Couch",
            "eth_salary": 12
        },
        {
            "pga_id": "32254",
            "name": "Xinjun Zhang",
            "eth_salary": 12
        },
        {
            "pga_id": "34358",
            "name": "Jonathan Randolph",
            "eth_salary": 12
        },
        {
            "pga_id": "47125",
            "name": "Matt Atkins",
            "eth_salary": 12
        },
        {
            "pga_id": "22582",
            "name": "Kyle Thompson",
            "eth_salary": 12
        },
        {
            "pga_id": "23638",
            "name": "Brendon de Jonge",
            "eth_salary": 12
        },
        {
            "pga_id": "25274",
            "name": "Steven Bowditch",
            "eth_salary": 12
        },
        {
            "pga_id": "27556",
            "name": "Ted Potter, Jr.",
            "eth_salary": 15
        },
        {
            "pga_id": "28679",
            "name": "Fabi\u00e1n G\u00f3mez",
            "eth_salary": 13
        },
        {
            "pga_id": "29222",
            "name": "Billy Hurley III",
            "eth_salary": 13
        }
    ]
}

export {getGolfers, getSelectedGolfersFromCookie, getPgaCookieName, getRevealKeyFromCookie};
