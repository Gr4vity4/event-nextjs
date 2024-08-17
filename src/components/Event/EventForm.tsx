import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

interface EventFormProps {
  open: boolean;
  isEditing: boolean;
  formData: {
    id: string;
    eventName: string;
    eventDescription: string;
    eventDate: string;
    eventLocation: string;
    eventCapacity: number;
    prefixSeatNumber: string;
    beginSeatNumber: number;
  };
  onClose: () => void;
  onSubmit: (formData: EventFormProps['formData']) => void;
  onFormChange: (field: string, value: string) => void;
}

const EventForm: React.FC<EventFormProps> = ({
  open,
  isEditing,
  formData,
  onClose,
  onSubmit,
  onFormChange,
}) => {
  // Function to safely format the date from ISO 8601 to YYYY-MM-DD
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return '';
    }

    return date.toISOString().split('T')[0];
  };

  // Function to handle date change and convert it back to ISO 8601
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value; // This will be in YYYY-MM-DD format
    if (inputDate) {
      const date = new Date(inputDate);
      if (!isNaN(date.getTime())) {
        onFormChange('eventDate', date.toISOString());
      } else {
        console.error('Invalid date input:', inputDate);
      }
    } else {
      onFormChange('eventDate', '');
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.eventName.trim()) newErrors.eventName = 'Event Name is required';
    if (!formData.eventDescription.trim())
      newErrors.eventDescription = 'Event Description is required';
    if (!formData.eventLocation.trim()) newErrors.eventLocation = 'Event Location is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event Date is required';
    if (!formData.eventCapacity) newErrors.eventCapacity = 'Event Capacity is required';
    if (!formData.prefixSeatNumber.trim())
      newErrors.prefixSeatNumber = 'Prefix Seat Number is required';
    if (!formData.beginSeatNumber) newErrors.beginSeatNumber = 'Begin Seat Number is required';

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Name"
            type="text"
            fullWidth
            value={formData.eventName}
            onChange={(e) => onFormChange('eventName', e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Event Description"
            multiline
            rows={4}
            fullWidth
            value={formData.eventDescription}
            onChange={(e) => onFormChange('eventDescription', e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Event Location"
            type="text"
            fullWidth
            value={formData.eventLocation}
            onChange={(e) => onFormChange('eventLocation', e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Event Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formatDate(formData.eventDate)}
            onChange={handleDateChange}
            required
          />
          <TextField
            margin="dense"
            label="Event Capacity"
            type="number"
            fullWidth
            value={formData.eventCapacity}
            onChange={(e) => onFormChange('eventCapacity', e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Prefix Seat Number"
            type="text"
            fullWidth
            value={formData.prefixSeatNumber}
            onChange={(e) => onFormChange('prefixSeatNumber', e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Begin Seat Number"
            type="number"
            fullWidth
            value={formData.beginSeatNumber}
            onChange={(e) => onFormChange('beginSeatNumber', e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">{isEditing ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventForm;
