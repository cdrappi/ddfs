import requests
import pandas
import datetime
import pytz

pga_tournament_id = '490'
url = f'https://statdata.pgatour.com/r/{pga_tournament_id}/setup.json'

field = requests.get(url).json()

to_df_rows = []

eastern = pytz.timezone('US/Eastern')
thursday_tee_timestamp = int(
    datetime.datetime(2018, 7, 5, 7, tzinfo=eastern).timestamp()
)

for player in field['trn']['field']:
    name = player['name']
    to_df_rows.append({
        'pga_id': player['id'],
        'name': f'{name["first"]} {name["last"]}',
        'thursday_tee_timestamp': thursday_tee_timestamp
    })

df = pandas.DataFrame(to_df_rows)
df.to_csv('/Users/christiandrappi/Desktop/pga_field.csv', index=False)
