"use client";

// React and external dependencies
import { useState } from "react";
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

// Internal types and components
import { Event } from "@/types";
import EventCard from "@/components/EventCard";

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const events: Event[] = [
    {
      eventName: "Event name",
      eventDate: "2024-10-01T00:00:00.000Z",
      eventLocation: "Event location",
      eventDescription: "Event description",
      eventCapacity: 100,
      prefixSeatNumber: "A",
      beginSeatNumber: 1,
      createdAt: "2024-08-10T11:37:07.171Z",
      updatedAt: "2024-08-10T11:37:07.171Z",
      signups: [],
      signupCount: 100,
      availableCapacity: 0,
      id: "66b750e326e929c0f096e5a5",
    },
    {
      eventName: "Event name 2",
      eventDate: "2024-10-01T00:00:00.000Z",
      eventLocation: "Event location",
      eventDescription: "Event description",
      eventCapacity: 100,
      prefixSeatNumber: "A",
      beginSeatNumber: 1,
      createdAt: "2024-08-10T11:37:07.171Z",
      updatedAt: "2024-08-10T11:37:07.171Z",
      signups: [],
      signupCount: 0,
      availableCapacity: 100,
      id: "66b750e326e929c0f096e5a5",
    },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const filteredEvents = events.filter((event) =>
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
          {filteredEvents.map((event) => (
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
