import requests
import pandas
import getpass

pga_tournament_id = '100'
year = '2018'

url = f'https://statdata.pgatour.com/r/{pga_tournament_id}/{year}/leaderboard-v2mini.json'

response = requests.get(url)

results = response.json()

teams = [
    ('mike', [
        ('30925', 'Dustin Johnson'),
        ('29725', 'Tony Finau'),
        ('35450', 'Patrick Cantlay'),
        ('27649', 'Brandt Snedeker'),
        ('24502', 'Adam Scott'),
        ('32757', 'Patton Kizzire'),
        ('29974', 'Branden Grace'),
        ('29461', 'Jamie Lovemark'),
        ('46501', 'Ollie Schniederjans'),
        ('24138', 'Ian Poulter'),
    ]),
    ('drew', [
        ('46970', 'Jon Rahm'),
        ('21209', 'Sergio Garcia'),
        ('26851', 'Marc Leishman'),
        ('48081', 'Xander Schauffele'),
        ('29221', 'Webb Simpson'),
        ('27064', 'Jhonattan Vegas'),
        ('34264', 'Hudson Swafford'),
        ('34021', 'Bud Cauley'),
        ('26499', 'Rafael Cabrera Bello'),
        ('27974', 'Sung-Hoon Kang'),
    ]),
    ('mccool', [
        ('34046', 'Jordan Spieth'),
        ('36689', 'Brooks Koepka'),
        ('24361', 'Pat Perez'),
        ('26329', 'Louis Oosthuizen'),
        ('29420', 'Billy Horschel'),
        ('37455', 'Si Woo Kim'),
        ('25900', 'Lucas Glover'),
        ('35506', 'Mackenzie Hughes'),
        ('39324', 'J.J. Spaun'),
        ('28252', 'Seamus Power'),
    ]),
    ('pacheco', [
        ('33448', 'Justin Thomas'),
        ('21528', 'Henrik Stenson'),
        ('30911', 'Tommy Fleetwood'),
        ('25198', 'Francesco Molinari'),
        ('30110', 'Kyle Stanley'),
        ('33293', 'Thomas Pieters'),
        ('26331', 'Charl Schwartzel'),
        ('29484', 'Peter Uihlein'),
        ('33141', 'Keegan Bradley'),
        ('29926', 'Danny Lee'),
    ]),
    ('drewby', [
        ('32102', 'Rickie Fowler'),
        ('23108', 'Matt Kuchar'),
        ('21961', 'Charles Howell III'),
        ('31323', 'Gary Woodland'),
        ('25686', 'Jason Dufner'),
        ('08793', 'Tiger Woods'),
        ('47959', 'Bryson Dechambeau'),
        ('35891', 'Cameron Smith'),
        ('32448', 'James Hahn'),
        ('23320', 'Ryan Palmer'),
    ]),
    ('christian', [
        ('28237', 'Rory McIlroy'),
        ('25364', 'Paul Casey'),
        ('34360', 'Patrick Reed'),
        ('27644', 'Brian Harman'),
        ('01810', 'Phil Mickelson'),
        ('29518', 'Brendan Steele'),
        ('24924', 'Bill Haas'),
        ('31646', 'Emiliano Grillo'),
        ('26476', 'Chez Reavie'),
        ('31202', 'William McGirt'),
    ]),
    ('logan', [
        ('32839', 'Hideki Matsuyama'),
        ('22405', 'Justin Rose'),
        ('29478', 'Kevin Kisner'),
        ('12716', 'Charley Hoffman'),
        ('24024', 'Zach Johnson'),
        ('25632', 'Jimmy Walker'),
        ('27141', 'J.B. Holmes'),
        ('33122', 'Russell Knox'),
        ('25396', 'Kevin Na'),
        ('33948', 'Byeong Hun An'),
    ]),
    ('ben', [
        ('28089', 'Jason Day'),
        ('40026', 'Daniel Berger'),
        ('33399', 'Adam Hadwin'),
        ('32366', 'Kevin Chappell'),
        ('34098', 'Russell Henley'),
        ('25804', 'Bubba Watson'),
        ('48084', 'Wesley Bryan'),
        ('26596', 'Ryan Moore'),
        ('34363', 'Tyrell Hatton'),
        ('30926', 'Chris Kirk'),
    ]),
 ]

player_id_to_team = {}
for team, players in teams:
    for player_id, _ in players:
        player_id_to_team[player_id] = team

weekly_earnings = {
    player_id: None
    for team, players in teams
    for player_id, _ in players
}

for player in results['leaderboard']['players']:
    player_id = player['player_id']
    if player_id in weekly_earnings:
        weekly_earnings[player_id] = (
            player['rankings']['projected_money_event']
        )

earnings_records = []
for team, players in teams:
    earnings_records.append({
        'team': team,
        **{
            f'player_{i+1}': player_name
            for i, (_, player_name) in enumerate(players)
        }
    })
    earnings_records.append({
        'team': '',
        **{
            f'player_{i+1}': weekly_earnings[player_id]
            for i, (player_id, _) in enumerate(players)
        }
    })
    earnings_records.extend([{}, {}])

player_cols = [f'player_{i}' for i in range(1, 11)]
earnings_df = pandas.DataFrame(
    earnings_records,
    columns=[
        'team',
        *player_cols
    ]
)

tournament_name = results['debug']['tournament_in_schedule_file_name']

earnings_df.to_csv(
    f'/Users/{getpass.getuser()}/Desktop/{year}_seasonal_{pga_tournament_id}_{tournament_name}.csv',
    index=False
)
