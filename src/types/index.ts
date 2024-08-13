export interface Signup {
  _id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  seatNumber: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isActive: boolean;
}

export interface Event {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  eventCapacity: number;
  prefixSeatNumber: string;
  beginSeatNumber: number;
  createdAt: string;
  updatedAt: string;
  signups: Signup[];
  signupCount: number;
  availableCapacity: number;
  id: string;
}

export interface EventCardProps {
  event: Event;
}

export interface RegistrationModalProps {
  open: boolean;
  handleClose: () => void;
  eventId: string;
  onSubmitSuccess: () => void;
}

export interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface ExtendedEventCardProps extends EventCardProps {
  onRegistrationSuccess: () => void;
}

export interface EventState {
  events: Event[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  total: number;
  currentPage: number;
  limit: number;
  sortField: string;
  sortOrder: string;
  searchTerm: string;
}

export const initialEventState: EventState = {
  events: [],
  status: "idle",
  error: null,
  total: 0,
  currentPage: 1,
  limit: 10,
  sortField: "eventDate",
  sortOrder: "desc",
  searchTerm: "",
};
