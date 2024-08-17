'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Snackbar,
  SnackbarCloseReason,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEvents } from '@/slices/eventSlice';

import { Event as EventDataType } from '@/types';
import EventCard from '@/components/Event/EventCard';

const EventsPage = () => {
  const { events, status, error, total, limit } = useAppSelector((state) => state.event);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    dispatch(
      fetchEvents({
        page: currentPage,
        limit: 10,
        sortField: 'eventDate',
        sortOrder: 'asc',
        search: searchTerm,
      }),
    );
  }, [dispatch, currentPage, searchTerm, limit]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleRegistrationSuccess = () => {
    setShowSnackbar(true);
    // Re-fetch events data
    dispatch(
      fetchEvents({
        page: currentPage,
        limit: 10,
        sortField: 'eventDate',
        sortOrder: 'desc',
        search: searchTerm,
      }),
    );
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnackbar(false);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Upcoming Events
        </Typography>
        <Box mb={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Grid container spacing={3}>
          {status === 'loading' && <p>Loading...</p>}
          {status === 'failed' && <p>Error: {error}</p>}
          {status === 'succeeded' &&
            events.map((event: EventDataType) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard event={event} onRegistrationSuccess={handleRegistrationSuccess} />
              </Grid>
            ))}
        </Grid>
        <Stack spacing={2} alignItems="end" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </Box>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Successfully registered for the event!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EventsPage;
