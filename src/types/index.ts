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
