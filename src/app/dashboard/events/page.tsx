'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addEvent,
  deleteEvent,
  fetchEvents,
  setCurrentPage,
  setLimit,
  setSearchTerm,
  setSortField,
  setSortOrder,
  updateEvent,
} from '@/slices/dashboardSlice';
import {
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

import { Event as EventDataType } from '@/types';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/Event/EventForm';
import { formatDate } from '@/utils/dateUtils';
import Notification from '@/components/Notification';

const EventPage = () => {
  const router = useRouter();
  const { events, status, error, total, currentPage, limit, sortField, sortOrder, searchTerm } =
    useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: '',
    eventName: '',
    eventDescription: '',
    eventDate: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  useEffect(() => {
    dispatch(
      fetchEvents({
        page: currentPage,
        limit,
        sortField,
        sortOrder,
        search: searchTerm,
      }),
    );
  }, [dispatch, currentPage, limit, sortField, sortOrder, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
    dispatch(setCurrentPage(1));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setCurrentPage(newPage + 1));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(setLimit(newLimit));
    dispatch(setCurrentPage(1));
  };

  const handleClickOpen = () => {
    setOpen(true);
    setIsEditing(false);
    setFormData({ id: '', eventName: '', eventDescription: '', eventDate: '' });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    let status: boolean;
    if (isEditing) {
      const resultAction = await dispatch(updateEvent(formData));
      status = updateEvent.fulfilled.match(resultAction);
    } else {
      const resultAction = await dispatch(addEvent(formData));
      status = addEvent.fulfilled.match(resultAction);
    }

    if (status) {
      setNotification({
        open: true,
        message: isEditing ? 'Event updated successfully!' : 'Event added successfully!',
        severity: 'success',
      });
      dispatch(
        fetchEvents({
          page: currentPage,
          limit,
          sortField: 'createdAt',
          sortOrder: 'desc',
          search: searchTerm,
        }),
      );
    } else {
      setNotification({
        open: true,
        message: 'Failed to process event',
        severity: 'error',
      });
    }

    handleClose();
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
      try {
        const resultAction = await dispatch(deleteEvent(eventToDelete));

        if (deleteEvent.fulfilled.match(resultAction)) {
          setNotification({
            open: true,
            message: 'Event deleted successfully!',
            severity: 'success',
          });
          dispatch(
            fetchEvents({ page: currentPage, limit, sortField, sortOrder, search: searchTerm }),
          );
        } else if (deleteEvent.rejected.match(resultAction)) {
          throw new Error(resultAction.error.message || 'Failed to delete event');
        }
      } catch (error) {
        setNotification({
          open: true,
          message: error instanceof Error ? error.message : 'An unknown error occurred',
          severity: 'error',
        });
      } finally {
        handleDeleteConfirmClose();
      }
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/dashboard/events/${eventId}`);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSort = (field: string) => {
    const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSortField(field));
    dispatch(setSortOrder(newOrder));
  };

  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Events
        </Typography>
        <Box mb={4}>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={10}>
              <Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  size="small"
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
            </Grid>
            <Grid item xs={12} md={2}>
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleClickOpen} fullWidth>
                  Add Event
                </Button>
              </Box>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="event table">
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>
                    Capacity
                    <IconButton size="small" onClick={() => handleSort('signupCount')}>
                      <SortIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    Created At
                    <IconButton size="small" onClick={() => handleSort('createdAt')}>
                      <SortIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {status === 'loading' && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {status === 'failed' && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Error: {error}
                    </TableCell>
                  </TableRow>
                )}
                {status === 'succeeded' &&
                  events.map((event: EventDataType) => (
                    <TableRow
                      key={event.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        onClick={() => handleEventClick(event.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {event.eventName}
                      </TableCell>
                      <TableCell>{event.eventDescription}</TableCell>
                      <TableCell>{event.eventLocation}</TableCell>
                      <TableCell>
                        {/*{new Date(event.eventDate).toLocaleDateString()}*/}
                        {formatDate(event.eventDate)}
                      </TableCell>
                      <TableCell>
                        {event.signupCount}/{event.eventCapacity}
                      </TableCell>
                      <TableCell>{new Date(event.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{new Date(event.updatedAt).toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => router.push(`/dashboard/events/${event.id}`)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(event)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteConfirmOpen(event.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={currentPage - 1}
            onPageChange={handleChangePage}
            rowsPerPage={limit}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
        <DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </>
  );
};

export default EventPage;
