import pandas

contest_entries = pandas.read_csv(
    filepath_or_buffer='/Users/christiandrappi/Downloads/DkEntries.csv',
    header=0,
    usecols=[0, 1, 2, 3],
    index_col=False,
    error_bad_lines=False,
    encoding='latin-1',
    warn_bad_lines=True,
)

contest_entries.head(5)
contest_entries.dropna(inplace=True)

entry_counts = contest_entries.groupby(['Contest ID'], as_index=False).agg({'Entry ID': 'count'})
entry_counts.rename(columns={'Entry ID': 'Entry Count'}, inplace=True)

df = pandas.merge(contest_entries, entry_counts, how='left', on='Contest ID')
df.sort_values(['Entry Count', 'Contest ID', 'Entry ID'], inplace=True)

df.to_csv('/Users/christiandrappi/Downloads/sorted_entries.csv', index=False)
