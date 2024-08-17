'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRegistrations, setSortField, setSortOrder } from '@/slices/registrationSlice';

import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from '@mui/icons-material';

const RegistrationPage: React.FC = () => {
  const { registrations, status, error, total, limit, sortField, sortOrder } = useAppSelector(
    (state) => state.registration,
  );
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(
      fetchRegistrations({
        page: currentPage,
        limit: 10,
        sortField: 'createdAt',
        sortOrder: 'desc',
        search: searchTerm,
      }),
    );
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(
      fetchRegistrations({
        page: newPage + 1,
        limit,
        sortField,
        sortOrder,
        search: searchTerm,
      }),
    );
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(
      fetchRegistrations({
        page: 1,
        limit: newLimit,
        sortField,
        sortOrder,
        search: searchTerm,
      }),
    );
  };

  const handleSort = (field: string) => {
    const newOrder = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setSortField(field));
    dispatch(setSortOrder(newOrder));
    dispatch(
      fetchRegistrations({
        page: currentPage,
        limit,
        sortField: field,
        sortOrder: newOrder,
        search: searchTerm,
      }),
    );
  };

  const handleOpenDialog = (id: string) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleCancel = () => {
    if (selectedId) {
      handleCloseDialog();
    }
  };

  console.log('registrations', registrations);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Registrations
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search..."
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
      <TableContainer sx={{ mt: 3 }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Created At
                <IconButton size="small" onClick={() => handleSort('createdAt')}>
                  <SortIcon />
                </IconButton>
              </TableCell>
              <TableCell>Event</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Seat Number</TableCell>

              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
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
              registrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>{new Date(registration.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/events/${registration.event._id}`} target="_blank">
                      {registration.event.eventName}
                    </Link>
                  </TableCell>
                  <TableCell>{registration.firstName}</TableCell>
                  <TableCell>{registration.lastName}</TableCell>
                  <TableCell>{registration.phoneNumber}</TableCell>
                  <TableCell>{registration.seatNumber}</TableCell>

                  <TableCell>
                    <Tooltip title={registration.isActive ? 'Active' : 'Inactive'}>
                      {registration.isActive ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" />
                      )}
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenDialog(registration.id)}>Cancel</Button>
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this registration? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No, Keep Registration</Button>
          <Button onClick={handleCancel} color="error">
            Yes, Cancel Registration
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RegistrationPage;
