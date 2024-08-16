import React from "react";
import {
  Box,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { Event as EventDataType } from "@/types";
import { formatDate } from "@/utils/dateUtils";

interface EventListItemProps {
  event: EventDataType;
  onEventClick: (id: string) => void;
  onEdit: (event: EventDataType) => void;
  onDeleteConfirm: (id: string) => void;
}

const EventListItem: React.FC<EventListItemProps> = ({
  event,
  onEventClick,
  onEdit,
  onDeleteConfirm,
}) => {
  return (
    <ListItem key={event.id} onClick={() => onEventClick(event.id)}>
      <ListItemText
        primary={event.eventName}
        secondary={`${event.eventDescription} - ${formatDate(event.eventDate)}`}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event);
          }}
        >
          <EditIcon />
        </IconButton>
        <Box component="span" sx={{ width: 8 }} />
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteConfirm(event.id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default EventListItem;
