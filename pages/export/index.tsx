import { useQuery } from '@apollo/client';
import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Entrant, GetEntrantsDocument } from '../../generated/graphql';
import { EntrantAutocomplete } from '../head-to-head';

const Export = () => {
  const [selectedEntrants, setSelectedEntrants] = useState<Partial<Entrant>[]>(
    []
  );

  const { data: entrantsData } = useQuery(GetEntrantsDocument);
  const entrants = entrantsData?.getEntrants || [];

  return (
    <Stack spacing={4} paddingTop={1}>
      <Typography variant="h4">
        Search entrants to create a matchup spreadsheet
      </Typography>
      {selectedEntrants.map(entrant => (
        <Typography key={entrant.id}>{entrant.name}</Typography>
      ))}
      <EntrantAutocomplete
        entrants={entrants}
        otherIds={selectedEntrants.map(e => e.id) || []}
        setId={id => {
          if (id) {
            setSelectedEntrants([
              ...selectedEntrants,
              entrants.find(e => e.id === id)!,
            ]);
          }
        }}
      />
    </Stack>
  );
};

export default Export;
