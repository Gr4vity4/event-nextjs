// React and external dependencies
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Event, LocationOn, People } from "@mui/icons-material";

// Internal types and components
import { EventCardProps } from "@/types";

const EventCard = ({ event }: EventCardProps) => {
  const {
    eventName,
    eventDate,
    eventLocation,
    eventDescription,
    eventCapacity,
    signupCount,
    availableCapacity,
  } = event;

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {eventName}
        </Typography>
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
          color={availableCapacity > 0 ? "primary" : "secondary"}
        >
          {availableCapacity > 0 ? "Register" : "Event Full"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
