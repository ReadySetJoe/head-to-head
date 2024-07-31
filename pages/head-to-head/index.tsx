import { useQuery } from '@apollo/client';
import {
  Autocomplete,
  Avatar,
  Box,
  CircularProgress,
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
  GetEntrantsQuery,
  GetMatchupDocument,
  GetVideogamesDocument,
} from '../../generated/graphql';

const timeFilterOptions = [
  { value: 'all', label: 'All time' },
  { value: subWeeks(new Date(), 3).toISOString(), label: 'Last 3 weeks' },
  { value: subMonths(new Date(), 3).toISOString(), label: 'Last 3 months' },
  { value: subYears(new Date(), 1).toISOString(), label: 'Last year' },
];

const EntrantAutocomplete = ({
  entrants,
  otherId,
  setId,
}: {
  entrants: GetEntrantsQuery['getEntrants'];
  otherId: number;
  setId: (id: number) => void;
}) => {
  return (
    <Autocomplete
      options={entrants.filter(o => o.id !== otherId)}
      getOptionLabel={option => option.name}
      renderOption={(props, option) => (
        <Box key={option.id} component="li" {...props}>
          <Stack direction="row" alignItems="center" sx={{ p: 0.25 }}>
            <Avatar src={option.image} alt={option.name} sx={{ mr: 2 }} />
            <Typography>{option.name}</Typography>
          </Stack>
        </Box>
      )}
      onChange={(_, value) => setId(value?.id)}
      renderInput={params => <TextField {...params} />}
      fullWidth
    />
  );
};

const HeadToHead = () => {
  const [id1, setId1] = useState<number>();
  const [id2, setId2] = useState<number>();
  const [videogameId, setVideogameId] = useState<number>();
  const [timeFilter, setTimeFilter] = useState(timeFilterOptions[0].value);

  const { data: entrantsData } = useQuery(GetEntrantsDocument);
  const entrants = entrantsData?.getEntrants || [];
  const { data: videogamesData } = useQuery(GetVideogamesDocument);
  const videogames = videogamesData?.getVideogames || [];
  const { data: matchupData, loading } = useQuery(GetMatchupDocument, {
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
      <Typography variant="h4">Head to head</Typography>
      <Stack direction="row" width="100%" spacing={4}>
        <EntrantAutocomplete entrants={entrants} otherId={id2} setId={setId1} />
        <Typography variant="h4">vs</Typography>
        <EntrantAutocomplete entrants={entrants} otherId={id1} setId={setId2} />
      </Stack>
      {loading && <CircularProgress />}
      {matchupData && (
        <Stack direction="row" alignItems="center" spacing={4}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
            }}
            src={entrants.find(o => o.id === id1)?.image}
          />
          <Typography variant="h3">
            {matchupData.getMatchup.score1} - {matchupData.getMatchup.score2}
          </Typography>
          <Avatar
            sx={{
              width: 100,
              height: 100,
            }}
            src={entrants.find(o => o.id === id2)?.image}
          />
        </Stack>
      )}
      <Autocomplete
        options={videogames}
        getOptionLabel={option => option.name}
        value={videogames.find(o => o.id === videogameId)}
        onChange={(_, value) => setVideogameId(value?.id)}
        renderInput={params => (
          <TextField {...params} label="Videogame (leave blank for all)" />
        )}
        fullWidth
      />
      <RadioGroup
        defaultValue={timeFilterOptions[0].value}
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
