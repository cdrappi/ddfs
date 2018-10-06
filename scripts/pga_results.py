import requests
import json
from tribeopen.aws.s3_resource import create_s3

pga_tournament_id = '471'
year = '2018'

url = f'https://statdata.pgatour.com/r/{pga_tournament_id}/{year}/leaderboard-v2mini.json'

response = requests.get(url)
results = response.json()

scores_list = []
for player in results['leaderboard']['players']:
    fantasy_points = sum(
        80 - int(rd['strokes'])  # must be int-able
        for rd in player['rounds']
        if rd['strokes']  # want to prevent 0s and Nones
    )
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
