import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';


export interface FlightDetails {
  from: string;
  to: string;
  date: string;
  flightNumber?: string;
  departureTime?: string;
  arrivalTime?: string;
  airline?: string;
  airlineCode?: string;
  terminal?: string;
  gate?: string;
  duration?: string;
}

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  logo: string;
  flightNumber: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  type: string;
  price: number;
  seatsAvailable: number;
  terminal: string;
  gate: string;
  specialOffer?: {
    tag: string;
    originalPrice: number;
  };
}

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  images: string[];
}

export interface BoardingPass {
  passenger: {
    firstName: string;
    lastName: string;
    seat: string;
  };
  flight: {
    number: string;
    airline: string;
    from: string;
    to: string;
    date: string;
    departureTime: string;
    gate: string;
    terminal: string;
    boardingTime: string;
    duration: string;
  };
  seq: string;
  pnr: string;
  services: string;
}

interface FlightState {
  verificationStatus: any;
  flightDetails: FlightDetails;
  passengers: {
    person1: Passenger;
    person2: Passenger;
  };
  selectedSeats: string[];
  boardingPass?: BoardingPass;
  checkInStatus: {
    person1Verified: boolean;
    person2Verified: boolean;
  };
}

interface PassengerDetails {
  person1: Passenger;
  person2: Passenger;
}

export type FlightAction = 
  | { type: 'SET_FLIGHT_DETAILS'; payload: FlightDetails }
  | { type: 'SET_PASSENGER_DETAILS'; payload: PassengerDetails }
  | { type: 'SET_SELECTED_SEATS'; payload: string[] }
  | { type: 'SET_BOARDING_PASS'; payload: BoardingPass }
  | { type: 'SET_VERIFICATION_STATUS'; payload: { person1Verified: boolean; person2Verified: boolean } };

const initialState: FlightState = {
  flightDetails: {
    from: '',
    to: '',
    date: '',
    flightNumber: '',
    departureTime: '',
    arrivalTime: '',
  },
  passengers: {
    person1: {
      firstName: '',
      lastName: '',
      email: '',
      images: [],
    },
    person2: {
      firstName: '',
      lastName: '',
      email: '',
      images: [],
    },
  },
  selectedSeats: [],
  checkInStatus: {
    person1Verified: false,
    person2Verified: false,
  },
  boardingPass: undefined,
  verificationStatus: undefined
};

const FlightContext = createContext<{
  state: FlightState;
  dispatch: Dispatch<FlightAction>;
} | undefined>(undefined);

function flightReducer(state: FlightState, action: FlightAction): FlightState {
  switch (action.type) {
    case 'SET_FLIGHT_DETAILS':
      return { ...state, flightDetails: action.payload };
    case 'SET_PASSENGER_DETAILS':
      return { ...state, passengers: action.payload as { person1: Passenger; person2: Passenger } };
    case 'SET_SELECTED_SEATS':
      return { ...state, selectedSeats: action.payload };
    case 'SET_BOARDING_PASS':
      return { ...state, boardingPass: action.payload };
    case 'SET_VERIFICATION_STATUS':
      return { ...state, checkInStatus: { ...state.checkInStatus, ...action.payload } };
    default:
      return state;
  }
}

export function FlightProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(flightReducer, initialState);
  return (
    <FlightContext.Provider value={{ state, dispatch }}>
      {children}
    </FlightContext.Provider>
  );
}

export const useFlightContext = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error('useFlightContext must be used within a FlightProvider');
  }
  return context;
}; 