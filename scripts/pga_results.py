import requests
import json
from tribeopen.aws.s3_resource import create_s3

pga_tournament_id = '490'
year = '2018'

url = f'https://statdata.pgatour.com/r/{pga_tournament_id}/{year}/leaderboard-v2mini.json'

response = requests.get(url)
results = response.json()

scores_list = []
for player in results['leaderboard']['players']:
    fantasy_points = 0
    total_strokes = 0
    for rd in player['rounds']:
        round_strokes = rd['strokes']
        if not round_strokes:
            pass
        elif round_strokes + total_strokes <= player['total_strokes']:
            fantasy_points += (80 - round_strokes)
            total_strokes += round_strokes
        else:
            print(f'WARNING: {player["rounds"]}')
            break
    scores_list.append(f'{int(player["player_id"])}:{fantasy_points}')

scores_string = ' '.join(scores_list)

s3 = create_s3(bucket_name='ethdfs')
s3.write_data(
    data=json.dumps({
        'compressedScores': scores_string
    }),
    key=f'compressedScores/{year}/{pga_tournament_id}.json'
)

scores_string
