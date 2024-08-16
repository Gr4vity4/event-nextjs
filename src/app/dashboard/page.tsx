"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  List,
  Pagination,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { Clear as ClearIcon, Search as SearchIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addEvent,
  deleteEvent,
  fetchEvents,
  updateEvent,
} from "@/slices/dashboardSlice";
import { Event as EventDataType } from "@/types";
import { useRouter } from "next/navigation";
import EventForm from "@/components/Event/EventForm";
import EventListItem from "@/components/Event/EventListItem";

const DashboardPage = () => {
  const router = useRouter();
  const { events, status, error, total, limit } = useAppSelector(
    (state) => state.event,
  );
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarOptions, setSnackbarOptions] = useState<any>({
    message: "",
    severity: "",
  });
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: "",
    eventName: "",
    eventDescription: "",
    eventDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const fetchEventData = () => {
    dispatch(
      fetchEvents({
        page: currentPage,
        limit: 10,
        sortField: "createdAt",
        sortOrder: "desc",
        search: searchTerm,
      }),
    );
  };

  useEffect(() => {
    fetchEventData();
  }, [dispatch, currentPage, searchTerm, limit]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setIsEditing(false);
    setFormData({ id: "", eventName: "", eventDescription: "", eventDate: "" });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    let actionResult;
    if (isEditing) {
      actionResult = await dispatch(updateEvent(formData));
    } else {
      actionResult = await dispatch(addEvent(formData));
    }

    if (actionResult.type.endsWith("/fulfilled")) {
      setSnackbarOptions({
        message: isEditing
          ? "Event updated successfully!"
          : "Event added successfully!",
        severity: "success",
      });
    } else if (actionResult.type.endsWith("/rejected")) {
      setSnackbarOptions({
        message: actionResult.payload || "Failed to process event",
        severity: "error",
      });
    }

    handleClose();
    setShowSnackbar(true);
    fetchEventData();
  };

  const handleEdit = (event: EventDataType) => {
    setFormData(event);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteConfirmOpen = (id: string) => {
    setEventToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setEventToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (eventToDelete) {
      const actionResult = await dispatch(deleteEvent(eventToDelete));

      if (actionResult.type.endsWith("/fulfilled")) {
        setSnackbarOptions({
          message: "Event deleted successfully!",
          severity: "success",
        });
      } else if (actionResult.type.endsWith("/rejected")) {
        setSnackbarOptions({
          message: actionResult.payload || "Failed to delete event",
          severity: "error",
        });
      }

      setShowSnackbar(true);
      fetchEventData();
    }
    handleDeleteConfirmClose();
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar(false);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const totalPages = Math.ceil(total / limit);

  const handleEventClick = (eventId: string) => {
    router.push(`/dashboard/events/${eventId}`);
  };

  return (
    <>
      <Container maxWidth="lg">
        <Box my={4}>
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
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleClickOpen}
              sx={{ mb: 2 }}
            >
              Add New Event
            </Button>
          </Box>
          <Grid container spacing={3}>
            {status === "loading" && <p>Loading...</p>}
            {status === "failed" && <p>Error: {error}</p>}
            {status === "succeeded" && (
              <Grid item xs={12}>
                <List>
                  {events.map((event: EventDataType) => (
                    <EventListItem
                      key={event.id}
                      event={event}
                      onEventClick={handleEventClick}
                      onEdit={handleEdit}
                      onDeleteConfirm={handleDeleteConfirmOpen}
                    />
                  ))}
                </List>
              </Grid>
            )}
          </Grid>
          <Stack spacing={2} alignItems="center" mt={4}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </Box>
      </Container>
      <EventForm
        open={open}
        isEditing={isEditing}
        formData={formData}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onFormChange={handleFormChange}
      />
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this event? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarOptions.severity}
          sx={{ width: "100%" }}
        >
          {snackbarOptions.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DashboardPage;
