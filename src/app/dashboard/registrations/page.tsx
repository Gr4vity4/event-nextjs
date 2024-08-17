"use client";

import React, { useState } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  seatNumber: string;
  createdAt: Date;
  isCancelled: boolean;
}

const RegistrationTable: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "123-456-7890",
      seatNumber: "A1",
      createdAt: new Date("2024-08-17T10:00:00"),
      isCancelled: false,
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      phoneNumber: "098-765-4321",
      seatNumber: "B2",
      createdAt: new Date("2024-08-17T11:30:00"),
      isCancelled: false,
    },
    // Add more mock data as needed
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
      setRegistrations(
        registrations.map((reg) =>
          reg.id === selectedId ? { ...reg, isCancelled: true } : reg,
        ),
      );
      handleCloseDialog();
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Registrations
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="registration table">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Seat Number</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrations.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  backgroundColor: row.isCancelled ? "#ffebee" : "inherit",
                }}
              >
                <TableCell component="th" scope="row">
                  {row.firstName}
                </TableCell>
                <TableCell>{row.lastName}</TableCell>
                <TableCell>{row.phoneNumber}</TableCell>
                <TableCell>{row.seatNumber}</TableCell>
                <TableCell>{row.createdAt.toLocaleString()}</TableCell>
                <TableCell align="center">
                  {row.isCancelled ? "Cancelled" : "Active"}
                </TableCell>
                <TableCell align="center">
                  <Tooltip
                    title={
                      row.isCancelled
                        ? "Already cancelled"
                        : "Cancel registration"
                    }
                  >
                    <span>
                      <IconButton
                        aria-label="cancel"
                        onClick={() => handleOpenDialog(row.id)}
                        color="error"
                        disabled={row.isCancelled}
                      >
                        <CancelIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Cancellation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel this registration? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No, Keep Registration</Button>
          <Button onClick={handleCancel} color="error" autoFocus>
            Yes, Cancel Registration
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RegistrationTable;
