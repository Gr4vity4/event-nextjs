"use client";

import React, { useEffect, useState } from "react";
import { fetchEventById } from "@/slices/eventSlice";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Link,
  Snackbar,
  SnackbarCloseReason,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatDate } from "@/utils/dateUtils";
import {
  Event,
  LocationOn,
  NavigateNext,
  PeopleAlt,
} from "@mui/icons-material";
import SignupTable from "@/components/SignupTable";
import RegistrationModal from "@/components/RegistrationModal";
import { useTheme } from "@mui/material/styles";

const EventPage = ({ params }: { params: { id: string } }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { events, status, error } = useAppSelector((state) => state.event);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const fetchEventDetail = async (id: string) => {
    dispatch(fetchEventById(id));
  };

  useEffect(() => {
    if (params.id) {
      fetchEventDetail(params.id);
    }
  }, [params.id]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRegistrationSuccess = () => {
    setShowSnackbar(true);
    handleCloseModal();
    fetchEventDetail(params.id);
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

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
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              align="center"
              sx={{ mt: 4 }}
            >
              {events[0].eventName}
            </Typography>
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              alignItems={isMobile ? "flex-start" : "center"}
              justifyContent={isMobile ? "flex-start" : "center"}
              p={2}
              gap={isMobile ? 2 : 4}
            >
              <Box display="flex" alignItems="center">
                <LocationOn sx={{ mr: 1 }} />
                <Typography variant="body1" component="p" align="center">
                  {events[0].eventLocation}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Event sx={{ mr: 1 }} />
                <Typography variant="body1" component="p" align="center">
                  {formatDate(events[0].eventDate)}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <PeopleAlt sx={{ mr: 1 }} />
                <Typography variant="body1" component="p" align="center">
                  {events[0].signupCount}/{events[0].eventCapacity} spots filled
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth={isMobile}
                color={
                  events[0].availableCapacity > 0 ? "primary" : "secondary"
                }
                onClick={
                  events[0].availableCapacity > 0 ? handleOpenModal : undefined
                }
              >
                {events[0].availableCapacity > 0 ? "Register" : "Event Full"}
              </Button>
            </Box>
            <Divider />
            <Box p={4}>
              <Typography variant="body1" component="p" align="center">
                {events[0].eventDescription}
              </Typography>
            </Box>

            <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
              Registered Participants
            </Typography>
            <SignupTable signups={events[0].signups} />
            <Snackbar
              open={showSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                sx={{ width: "100%" }}
              >
                Successfully registered for the event!
              </Alert>
            </Snackbar>
            <RegistrationModal
              open={isModalOpen}
              handleClose={handleCloseModal}
              eventId={events[0].id}
              onSubmitSuccess={handleRegistrationSuccess}
            />
          </>
        )}
      </Box>
    </Container>
  );
};

export default EventPage;
