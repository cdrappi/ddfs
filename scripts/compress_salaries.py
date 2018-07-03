import pandas
import json
from tribeopen.aws.s3_resource import create_s3

pga_tournament_id = 490
year = 2018

df = pandas.read_csv('/Users/christiandrappi/Desktop/salaries/Sheet 2-Table 1.csv')
df_columns = ['name','pga_id','thursday_tee_timestamp','eth_salary']

compressed_salaries_list = []
records = df[df_columns].to_dict(orient='records')
for row in records:
    compressed_salaries_list.append(
        f'{row["pga_id"]}:{row["thursday_tee_timestamp"]}:{row["eth_salary"]}'
    )

compressed_salaries = ' '.join(compressed_salaries_list)


s3 = create_s3(bucket_name='ethdfs')
s3.write_data(
    data=json.dumps({
        'compressedSalaries': compressed_salaries
    }),
    key=f'compressedSalaries/{year}/{pga_tournament_id}.json'
)

s3.write_data(
    data=json.dumps(records),
    key=f'jsonSalaries/{year}/{pga_tournament_id}.json'
)
