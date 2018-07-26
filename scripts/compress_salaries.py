import pandas
import json
from tribeopen.aws.s3_resource import create_s3

pga_tournament_id = 490
year = 2018

df = pandas.read_csv(
    '/Users/christiandrappi/Desktop/salaries/Sheet 2-Table 1.csv',
    dtype={'pga_id': str}
)
df_columns = ['name','pga_id','thursday_tee_timestamp','eth_salary']

# print(json.dumps(df[['pga_id', 'name', 'eth_salary']].to_dict(orient='records'), indent=4))

compressed_salaries_list = []
records = df[df_columns].to_dict(orient='records')
for row in records:
    compressed_salaries_list.append(
        f'{row["pga_id"]}:{row["eth_salary"]}'
    )

compressed_salaries = ' '.join(compressed_salaries_list)

json_salaries_key = f'jsonSalaries/{year}/{pga_tournament_id}.json'
compressed_salaries_key = f'compressedSalaries/{year}/{pga_tournament_id}.json'

s3 = create_s3(bucket_name='ethdfs')

s3.write_data(
    data=json.dumps({
        'compressedSalaries': compressed_salaries
    }),
    key=compressed_salaries_key
)

s3.write_data(
    data=json.dumps(records),
    key=json_salaries_key
)

def set_public_read(key):
    s3._bucket.Object(key).Acl().put(ACL='public-read')

set_public_read(json_salaries_key)
set_public_read(compressed_salaries_key)

compressed_salaries
