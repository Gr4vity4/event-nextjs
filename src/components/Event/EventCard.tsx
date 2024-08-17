import React, { useState } from 'react';
import { Box, Button, Card, CardContent, LinearProgress, Link, Typography } from '@mui/material';
import { Event, LocationOn, People } from '@mui/icons-material';
import RegistrationModal from '../RegistrationModal';
import { ExtendedEventCardProps } from '@/types';
import { formatDate } from '@/utils/dateUtils';

const EventCard: React.FC<ExtendedEventCardProps> = ({ event, onRegistrationSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    id,
    eventName,
    eventDate,
    eventLocation,
    eventDescription,
    eventCapacity,
    signupCount,
    availableCapacity,
  } = event;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitSuccess = (): void => {
    handleCloseModal();
    onRegistrationSuccess();
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Link href={`/events/${id}`}>
            <Typography gutterBottom variant="h5" component="div">
              {eventName}
            </Typography>
          </Link>
          <Box display="flex" alignItems="center" mb={1}>
            <Event sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(eventDate)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <LocationOn sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {eventLocation}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {eventDescription}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <People sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {signupCount}/{eventCapacity} spots filled
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(signupCount / eventCapacity) * 100}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            color={availableCapacity > 0 ? 'primary' : 'secondary'}
            onClick={availableCapacity > 0 ? handleOpenModal : undefined}
          >
            {availableCapacity > 0 ? 'Register' : 'Event Full'}
          </Button>
        </CardContent>
      </Card>
      <RegistrationModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        eventId={id}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </>
  );
};

export default EventCard;
