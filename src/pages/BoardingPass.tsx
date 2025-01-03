import {
  Container,
  Paper,
  Grid,
  Typography,
  Box,
  Divider,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Zoom,
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useFlightContext } from '../context/FlightContext';
import { useEffect, useState, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { StateDebugger } from '../components/StateDebugger';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface FlightDetails {
  from: string;
  to: string;
  date: string;
}

interface Passenger {
  firstName: string;
  lastName: string;
}

interface FlightState {
  flightDetails: FlightDetails;
  passengers: Record<string, Passenger>;
  selectedSeats: string[];
}

interface BoardingPass {
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
  };
  seq: string;
  pnr: string;
  services: string;
}

const ApprovalStamp = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  right: '8%',
  transform: 'rotate(-30deg) translateY(-50%)',
  border: '3px solid #4CAF50',
  borderRadius: '50%',
  width: '120px',
  height: '120px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#4CAF50',
  backgroundColor: 'rgba(76, 175, 80, 0.1)',
  fontSize: '20px',
  fontWeight: 'bold',
  opacity: 0.9,
  zIndex: 1,
  boxShadow: '0 0 10px rgba(76, 175, 80, 0.3)'
}));

const generateQRCode = (data: any) => {
  try {
    const qrData = {
      flight: {
        number: data.flightDetails.flightNumber,
        airline: data.flightDetails.airline,
        from: data.flightDetails.from,
        to: data.flightDetails.to,
        date: data.flightDetails.date,
        departureTime: data.flightDetails.departureTime,
        arrivalTime: data.flightDetails.arrivalTime,
        terminal: data.flightDetails.terminal,
        gate: data.flightDetails.gate
      },
      passenger: {
        name: `${data.currentPassenger.firstName} ${data.currentPassenger.lastName}`,
        seat: data.currentPassenger.seat
      },
      boardingTime: data.boardingPass.flight.boardingTime,
      pnr: data.boardingPass.pnr,
      seq: data.boardingPass.seq
    };
    return JSON.stringify(qrData);
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

const validateFlightData = (state: Partial<FlightState>): boolean => {
  // Add detailed logging
  console.log('Validating state:', state);

  if (!state) {
    console.error('State is null or undefined');
    return false;
  }

  // Check flight details
  if (!state.flightDetails?.from || !state.flightDetails?.to || !state.flightDetails?.date) {
    console.error('Missing flight details:', state.flightDetails);
    return false;
  }

  // Check passengers
  if (!state.passengers?.person1 || !state.passengers?.person2) {
    console.error('Missing passenger details:', state.passengers);
    return false;
  }

  // Check both passengers have required fields
  const passengersValid = ['person1', 'person2'].every(person => {
    const p = state.passengers[person as keyof typeof state.passengers];
    const isValid = p?.firstName && p?.lastName;
    if (!isValid) {
      console.error(`Invalid passenger data for ${person}:`, p);
    }
    return isValid;
  });

  if (!passengersValid) {
    return false;
  }

  // Check seats
  if (!Array.isArray(state.selectedSeats) || state.selectedSeats.length !== 2) {
    console.error('Invalid seat selection:', state.selectedSeats);
    return false;
  }

  // All validations passed
  console.log('Validation successful');
  return true;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  maxWidth: '900px',
  margin: '0 auto',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
}));

// Add a utility function to get the correct logo path
const getAirlineLogo = (airline: string): string => {
  const logoMap: { [key: string]: string } = {
    'SpiceJet': '/Spicejet.png',
    'IndiGo': '/Indigo.jpeg',
    'Air India': '/Air India.jpeg',
    'Akasa Air': '/Akasa Air.png'
  };
  return logoMap[airline] || '';
};

export const BoardingPass = () => {
  const { state } = useFlightContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boardingPasses, setBoardingPasses] = useState<BoardingPass[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  const calculateBoardingTime = (departureTime: string): string => {
    const [hours, minutes] = departureTime.split(':').map(Number);
    let boardingHours = hours;
    let boardingMinutes = minutes - 30;
    
    if (boardingMinutes < 0) {
      boardingHours = (boardingHours - 1 + 24) % 24;
      boardingMinutes += 60;
    }
    
    return `${String(boardingHours).padStart(2, '0')}:${String(boardingMinutes).padStart(2, '0')}`;
  };

  const generateBoardingPass = async (passengerIndex: number): Promise<BoardingPass | null> => {
    if (!state) return null;

    const personKey = `person${passengerIndex + 1}` as keyof typeof state.passengers;
    const passenger = state.passengers[personKey];
    const seat = state.selectedSeats[passengerIndex];

    if (!passenger || !seat || !state.flightDetails) {
      setError(`Missing data for passenger ${passengerIndex + 1}`);
      return null;
    }

    // Calculate boarding time (30 minutes before departure)
    const boardingTime = calculateBoardingTime(state.flightDetails.departureTime);

    return {
      passenger: {
        firstName: passenger.firstName,
        lastName: passenger.lastName,
        seat: seat
      },
      flight: {
        number: state.flightDetails.flightNumber,
        airline: state.flightDetails.airline,
        from: state.flightDetails.from,
        to: state.flightDetails.to,
        date: state.flightDetails.date,
        departureTime: state.flightDetails.departureTime,
        arrivalTime: state.flightDetails.arrivalTime,
        gate: state.flightDetails.gate,
        terminal: state.flightDetails.terminal,
        boardingTime: boardingTime,
        duration: state.flightDetails.duration
      },
      seq: generateSequence(),
      pnr: generatePNR(),
      services: 'NIL'
    };
  };

  useEffect(() => {
    const generatePasses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!state || !validateFlightData(state)) {
          setError('Please complete all previous steps');
          setShowValidationError(true);
          setTimeout(() => navigate('/flight-search'), 3000);
          return;
        }

        const passes = await Promise.all([
          generateBoardingPass(0),
          generateBoardingPass(1)
        ]);

        const validPasses = passes.filter((pass): pass is BoardingPass => pass !== null);

        if (validPasses.length !== 2) {
          throw new Error('Failed to generate all boarding passes');
        }

        setBoardingPasses(validPasses);
        setShowSuccess(true);
      } catch (error) {
        console.error('Error generating boarding passes:', error);
        setError('Error generating boarding passes');
        setShowValidationError(true);
      } finally {
        setIsLoading(false);
      }
    };

    generatePasses();
  }, [state, navigate]);

  // Debug logging
  useEffect(() => {
    console.log('Current State:', {
      flightDetails: state?.flightDetails,
      passengers: state?.passengers,
      selectedSeats: state?.selectedSeats
    });
  }, [state]);

  // Show loading state
  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Generating your boarding passes...
        </Typography>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light' }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Typography variant="body1">
            Redirecting to flight search...
          </Typography>
        </Paper>
      </Container>
    );
  }

  const canDownload = state?.checkInStatus?.person1Verified && 
                     state?.checkInStatus?.person2Verified;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, bgcolor: 'white', position: 'relative' }}>
        <Typography 
          variant="h5" 
          align="center" 
          sx={{ 
            color: canDownload ? '#4CAF50' : '#FF1493', 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            position: 'relative'
          }}
        >
          {canDownload ? (
            <>
              Approved Boarding Pass
              <CheckCircleIcon sx={{ color: '#4CAF50', ml: 1 }} />
            </>
          ) : (
            'Boarding Pass'
          )}
        </Typography>

        {/* Updated Approval Stamp */}
        {canDownload && (
          <ApprovalStamp>
            <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
              APPROVED
            </Typography>
            <Typography sx={{ fontSize: '14px' }}>
              ✓ VERIFIED
            </Typography>
          </ApprovalStamp>
        )}

        {boardingPasses.map((pass, index) => (
          <StyledPaper key={index} elevation={3} sx={{ mb: 3, overflow: 'hidden' }}>
            <Grid container>
              {/* Left Section */}
              <Grid item xs={12} md={8} sx={{ borderRight: '1px solid #ddd' }}>
                <Box sx={{ p: 2 }}>
                  {/* Airline and Flight Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box
                      component="img"
                      src={getAirlineLogo(pass.flight.airline)}
                      alt={pass.flight.airline}
                      sx={{ 
                        height: 32, 
                        mr: 1.5,
                        objectFit: 'contain',
                        filter: 'brightness(1.1)',
                        mixBlendMode: 'multiply'
                      }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        console.error(`Failed to load logo for ${pass.flight.airline}`);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Typography variant="h6" color="primary" sx={{ fontSize: '1.1rem' }}>
                      {pass.flight.airline} - {pass.flight.number}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 1.5 }} />

                  {/* Passenger Details */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Passenger Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                        {pass.passenger.firstName} {pass.passenger.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Seat Number
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                        {pass.passenger.seat}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Flight Details */}
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        From
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                        {pass.flight.from}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        To
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                        {pass.flight.to}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                        {formatDate(pass.flight.date)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Flight Duration
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                        {pass.flight.duration}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Time and Gate Info */}
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Boarding Time
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ 
                        color: 'error.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}>
                        {pass.flight.boardingTime}
                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Departure Time
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                        {pass.flight.departureTime}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Gate
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                        {pass.flight.gate}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Terminal
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                        {pass.flight.terminal}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* QR Code Section */}
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <QRCodeCanvas
                      value={generateQRCode({
                        ...state!,
                        currentPassenger: pass.passenger,
                        boardingPass: pass
                      })}
                      size={80}
                    />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        PNR: {pass.pnr}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Sequence: {pass.seq}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Right Section - Stub */}
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box
                      component="img"
                      src={getAirlineLogo(pass.flight.airline)}
                      alt={pass.flight.airline}
                      sx={{ 
                        height: 24, 
                        mr: 1,
                        objectFit: 'contain',
                        filter: 'brightness(1.1)',
                        mixBlendMode: 'multiply'
                      }}
                    />
                    <Typography variant="subtitle1" sx={{ fontSize: '0.9rem' }}>
                      {pass.flight.airline} - {pass.flight.number}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    {pass.passenger.firstName} {pass.passenger.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    Seat: {pass.passenger.seat}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    Gate: {pass.flight.gate}
                  </Typography>
                  <QRCodeCanvas
                    value={generateQRCode({
                      ...state!,
                      currentPassenger: pass.passenger,
                      boardingPass: pass
                    })}
                    size={60}
                  />
                </Box>
              </Grid>
            </Grid>
          </StyledPaper>
        ))}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          {canDownload ? (
            <Button
              variant="contained"
              onClick={() => window.print()}
              sx={{ 
                minWidth: 120,
                bgcolor: '#4CAF50',
                '&:hover': {
                  bgcolor: '#45a049'
                }
              }}
            >
              DOWNLOAD BOARDING PASS
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => navigate('/self-check-in')}
              disabled={state?.checkInStatus?.person1Verified || state?.checkInStatus?.person2Verified}
              sx={{ 
                minWidth: 120,
                bgcolor: '#FF1493',
                '&:hover': {
                  bgcolor: '#FF1493dd'
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(255,20,147,0.3)',
                  color: 'white'
                }
              }}
            >
              COMPLETE CHECK-IN
            </Button>
          )}
        </Box>

        {/* Snackbars */}
        <Snackbar
          open={showValidationError}
          autoHideDuration={6000}
          onClose={() => setShowValidationError(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled">
            Boarding passes generated successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

const formatTime = (time: string, offsetMinutes: number = 0) => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes + offsetMinutes);
  return date.getHours().toString().padStart(2, '0') + 
         (date.getMinutes() === 0 ? '00' : date.getMinutes().toString());
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/ /g, '');
};

const generateSequence = () => {
  return Math.floor(Math.random() * 9000 + 1000).toString();
};

const generatePNR = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    if (i < 2) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    } else {
      pnr += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
  }
  return pnr;
}; 