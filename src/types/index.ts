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
  _id?: string;
  id: string;
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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  total: number;
  currentPage: number;
  limit: number;
  sortField: string;
  sortOrder: string;
  searchTerm: string;
}

export interface EventState extends FetchDataState {
  events: Event[];
}

export interface UserSignup {
  id: string;
  eventId: string;
  event: Event;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  seatNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FetchDataParams {
  page: number;
  limit: number;
  sortField: string;
  sortOrder: string;
  search: string;
}

export interface FetchDataState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  total: number;
  currentPage: number;
  limit: number;
  sortField: string;
  sortOrder: string;
  searchTerm: string;
}

export interface RegistrationState extends FetchDataState {
  registrations: UserSignup[];
}
