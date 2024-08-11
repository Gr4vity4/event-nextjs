"use client";

// React and external dependencies
import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Clear as ClearIcon, Search as SearchIcon } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchEvents } from "@/slices/eventSlice";

// Internal types and components
import { Event } from "@/types";
import EventCard from "@/components/EventCard";

const EventsPage = () => {
  const { events, status, error } = useAppSelector((state) => state.event);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      fetchEvents({
        page: 1,
        limit: 10,
        sortField: "eventDate",
        sortOrder: "desc",
      }),
    );
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const filteredEvents: Event[] = events.filter((event: Event) =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          {status === "loading" && <p>Loading...</p>}
          {status === "failed" && <p>Error: {error}</p>}
          {status === "succeeded" &&
            filteredEvents.map((event: Event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default EventsPage;
