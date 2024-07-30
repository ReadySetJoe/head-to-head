import { useQuery } from '@apollo/client';
import {
  Autocomplete,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { subMonths, subWeeks, subYears } from 'date-fns';
import { useState } from 'react';
import {
  GetEntrantsDocument,
  GetMatchupDocument,
  GetVideogamesDocument,
} from '../../generated/graphql';

const timeFilterOptions = [
  { value: 'all', label: 'All time' },
  { value: subWeeks(new Date(), 3).toISOString(), label: 'Last 3 weeks' },
  { value: subMonths(new Date(), 3).toISOString(), label: 'Last 3 months' },
  { value: subYears(new Date(), 1).toISOString(), label: 'Last year' },
];

const HeadToHead = () => {
  const [id1, setId1] = useState<number>();
  const [id2, setId2] = useState<number>();
  const [videogameId, setVideogameId] = useState<number>();
  const [timeFilter, setTimeFilter] = useState(timeFilterOptions[0].value);

  const { data: entrantsData } = useQuery(GetEntrantsDocument);
  const entrants = entrantsData?.getEntrants || [];
  const { data: videogamesData } = useQuery(GetVideogamesDocument);
  const videogames = videogamesData?.getVideogames || [];
  const { data: matchupData } = useQuery(GetMatchupDocument, {
    skip: !id1 || !id2,
    variables: {
      input: {
        entrantId1: id1,
        entrantId2: id2,
        videogameId,
        startAfter: timeFilter === 'all' ? undefined : timeFilter,
      },
    },
  });

  return (
    <Stack spacing={4} flex={1} alignItems="center">
      <Typography variant="h3">Head to head</Typography>
      <Stack direction="row" width="100%" spacing={4}>
        <Autocomplete
          options={entrants.filter(o => o.id !== id2)}
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
          options={entrants.filter(o => o.id !== id1)}
          getOptionLabel={option => option.name}
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
      <Autocomplete
        options={videogames}
        getOptionLabel={option => option.name}
        value={videogames.find(o => o.id === videogameId)}
        onChange={(_, value) => setVideogameId(value?.id)}
        renderInput={params => <TextField {...params} label="Videogame" />}
        sx={{ width: '50%' }}
      />
      <RadioGroup
        defaultValue={timeFilterOptions[0].value}
        sx={{ width: '50%' }}
        onChange={e => setTimeFilter(e.target.value)}
      >
        {timeFilterOptions.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </Stack>
  );
};

export default HeadToHead;
