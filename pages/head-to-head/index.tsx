import { useQuery } from '@apollo/client';
import { Autocomplete, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import {
  GetEntrantsDocument,
  GetMatchupDocument,
} from '../../generated/graphql';

const HeadToHead = () => {
  const [id1, setId1] = useState<number>();
  const [id2, setId2] = useState<number>();

  const { data: entrantsData } = useQuery(GetEntrantsDocument);

  const { data: matchupData } = useQuery(GetMatchupDocument, {
    skip: !id1 || !id2,
    variables: {
      input: {
        entrantId1: id1,
        entrantId2: id2,
      },
    },
  });

  return (
    <Stack spacing={4} flex={1} alignItems="center">
      <Typography variant="h3">Head to head</Typography>
      <Stack direction="row" width="100%" spacing={4}>
        <Autocomplete
          options={entrantsData?.getEntrants.filter(o => o.id !== id2)}
          getOptionLabel={option => option.name}
          // renderOption={(_props, option) => (
          //   <Stack direction="row" alignItems="center" spacing={2}>
          //     <img
          //       src={option.image}
          //       alt={option.name}
          //       width={24}
          //       height={24}
          //     />
          //     <Typography>{option.name}</Typography>
          //   </Stack>
          // )}
          filterOptions={(options, params) => {
            const filtered = options.filter(
              o =>
                o.name
                  .toLowerCase()
                  .indexOf(params.inputValue.toLowerCase()) !== -1
            );

            return filtered;
          }}
          onChange={(_, value) => setId1(value?.id)}
          renderInput={params => <TextField {...params} label="Player 1" />}
          fullWidth
        />
        <Typography variant="h4">vs</Typography>
        <Autocomplete
          options={entrantsData?.getEntrants.filter(o => o.id !== id1)}
          getOptionLabel={option => option.name}
          // renderOption={(_props, option) => (
          //   <Stack direction="row" alignItems="center" spacing={2}>
          //     <img
          //       src={option.image}
          //       alt={option.name}
          //       width={24}
          //       height={24}
          //     />
          //     <Typography>{option.name}</Typography>
          //   </Stack>
          // )}
          onChange={(_, value) => setId2(value?.id)}
          renderInput={params => <TextField {...params} label="Player 2" />}
          fullWidth
        />
      </Stack>
      {matchupData && (
        <Typography variant="h3">
          {matchupData.getMatchup.score1} - {matchupData.getMatchup.score2}
        </Typography>
      )}
    </Stack>
  );
};

export default HeadToHead;
