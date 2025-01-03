import { createContext, useContext, useReducer, ReactNode } from 'react';

interface PassengerDetails {
  firstName: string;
  lastName: string;
  email: string;
  images: { id: string; dataUrl: string; }[];
}

interface FlightState {
  flightDetails: {
    from: string;
    to: string;
    date: string;
    flightNumber?: string;
    departureTime?: string;
    arrivalTime?: string;
  };
  passengers: {
    person1: PassengerDetails;
    person2: PassengerDetails;
  };
  selectedSeats: string[];
  boardingPass?: {
    gate?: string;
    boardingTime?: string;
    terminal?: string;
    class?: string;
    qrCode?: string;
  };
  checkInStatus: {
    person1Verified: boolean;
    person2Verified: boolean;
  };
}

type FlightAction = 
  | { type: 'SET_FLIGHT_DETAILS'; payload: FlightState['flightDetails'] }
  | { type: 'SET_PASSENGER_DETAILS'; payload: FlightState['passengers'] }
  | { type: 'SET_SELECTED_SEATS'; payload: string[] }
  | { type: 'SET_BOARDING_PASS'; payload: FlightState['boardingPass'] }
  | { type: 'SET_CHECK_IN_STATUS'; payload: FlightState['checkInStatus'] };

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
};

const FlightContext = createContext<{
  state: FlightState;
  dispatch: React.Dispatch<FlightAction>;
} | undefined>(undefined);

function flightReducer(state: FlightState, action: FlightAction): FlightState {
  switch (action.type) {
    case 'SET_FLIGHT_DETAILS':
      return { ...state, flightDetails: action.payload };
    case 'SET_PASSENGER_DETAILS':
      return { ...state, passengers: action.payload };
    case 'SET_SELECTED_SEATS':
      return { ...state, selectedSeats: action.payload };
    case 'SET_BOARDING_PASS':
      return { ...state, boardingPass: action.payload };
    case 'SET_CHECK_IN_STATUS':
      return { ...state, checkInStatus: action.payload };
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

export function useFlightContext() {
  const context = useContext(FlightContext);
  if (context === undefined) {
    throw new Error('useFlightContext must be used within a FlightProvider');
  }
  return context;
} 