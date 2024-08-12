"use client";

import React, { useEffect } from "react";
import { fetchEventById } from "@/slices/eventSlice";
import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Link,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Event as EventDataType } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import { Event, LocationOn, NavigateNext } from "@mui/icons-material";

const EventPage = ({ params }: { params: { id: string } }) => {
  const { events, status, error } = useAppSelector((state) => state.event);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (params.id) {
      dispatch(fetchEventById(params.id));
    }
  }, [dispatch, params.id]);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>Error: {error}</p>}
        {status === "succeeded" && (
          <>
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link color="inherit" href="/">
                Home
              </Link>
              <Typography color="text.primary">
                {events[0].eventName}
              </Typography>
            </Breadcrumbs>

            {events.map((event: EventDataType) => (
              <React.Fragment key={event.id}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  align="center"
                  sx={{ mt: 4 }}
                >
                  {event.eventName}
                </Typography>
                <Box display="flex" justifyContent="center" p={2} gap={4}>
                  <Box display="flex" alignItems="center">
                    <LocationOn sx={{ mr: 1 }} />
                    <Typography variant="body1" component="p" align="center">
                      {event.eventLocation}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Event sx={{ mr: 1 }} />
                    <Typography variant="body1" component="p" align="center">
                      {formatDate(event.eventDate)}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Box p={4}>
                  <Typography variant="body1" component="p" align="center">
                    {event.eventDescription}
                  </Typography>
                </Box>
              </React.Fragment>
            ))}
          </>
        )}
      </Box>
    </Container>
  );
};

export default EventPage;
