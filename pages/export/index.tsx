import { useLazyQuery, useQuery } from '@apollo/client';
import { Cancel } from '@mui/icons-material';
import { Avatar, Button, IconButton, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import { utils, writeFile } from 'xlsx';
import {
  Entrant,
  GetEntrantsDocument,
  GetMatchupSpreadDocument,
} from '../../generated/graphql';
import { EntrantAutocomplete } from '../head-to-head';

const Export = () => {
  const [selectedEntrants, setSelectedEntrants] = useState<Partial<Entrant>[]>(
    []
  );

  const { data: entrantsData } = useQuery(GetEntrantsDocument);
  const entrants = entrantsData?.getEntrants || [];

  const [getMatchupSpread] = useLazyQuery(GetMatchupSpreadDocument);

  const handleExport = async () => {
    const { data } = await getMatchupSpread({
      variables: {
        input: {
          entrantSlugs: selectedEntrants.map(e => e.slug),
        },
      },
    });
    const matchups = data?.getMatchupSpread || [];

    const entrantNames = selectedEntrants.map(e => e.name);
    const headers = [''].concat(entrantNames);
    const rows = entrantNames.map(name => {
      return [
        name,
        ...entrantNames.map(opponent => {
          const matchup1 = matchups.find(
            m => m.entrant1?.name === name && m.entrant2?.name === opponent
          );
          const matchup2 = matchups.find(
            m => m.entrant1?.name === opponent && m.entrant2?.name === name
          );
          if (!matchup1 && !matchup2) {
            return '';
          }
          return matchup1
            ? `${matchup1.score1} - ${matchup1.score2}`
            : `${matchup2?.score2} - ${matchup2?.score1}`;
        }),
      ];
    });
    const sheet = utils.aoa_to_sheet([headers, ...rows]);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, sheet, 'Matchups');

    writeFile(
      workbook,
      `matchups-${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`
    );
  };

  return (
    <Stack spacing={4} paddingTop={1}>
      <Typography variant="h4">
        Search entrants to create a matchup spreadsheet
      </Typography>
      {selectedEntrants.map(entrant => (
        <Stack key={entrant.id} direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={() =>
              setSelectedEntrants(
                selectedEntrants.filter(e => e.id !== entrant.id)
              )
            }
          >
            <Cancel />
          </IconButton>
          <Avatar src={entrant.image} />
          <Typography>{entrant.name}</Typography>
        </Stack>
      ))}
      <EntrantAutocomplete
        setId={id => {
          if (id) {
            setSelectedEntrants([
              ...selectedEntrants,
              entrants.find(e => e.id === id)!,
            ]);
          }
        }}
      />
      {selectedEntrants.length > 1 && (
        <Button variant="contained" onClick={handleExport}>
          Export
        </Button>
      )}
    </Stack>
  );
};

export default Export;
