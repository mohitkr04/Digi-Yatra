import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Autocomplete,
  styled,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { motion } from 'framer-motion';
import { useFlightContext } from '../context/FlightContext';
import { generateFlightSchedules } from '../data/flightData';

const FLIGHT_SUGGESTIONS = [
  { 
    code: 'DEL',
    city: 'New Delhi',
    airport: 'Indira Gandhi International Airport',
  },
  {
    code: 'HYD',
    city: 'Hyderabad',
    airport: 'Rajiv Gandhi International Airport',
  },
  {
    code: 'BOM',
    city: 'Mumbai',
    airport: 'Chhatrapati Shivaji Maharaj International Airport',
  },
];


interface Flight {
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


const SearchContainer = styled(Container)(({ theme }) => ({
  maxWidth: '1200px !important',
  padding: theme.spacing(3),
  margin: '0 auto',
  width: '100%',
  transition: 'margin-left 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const SearchBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const SearchForm = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    '& > *': {
      width: '100%',
    },
  },
}));

const tooltips = {
  from: "Where are you flying from?",
  to: "Where would you like to go?",
  date: "When do you want to travel?",
  search: "Search flights"
};

interface SearchInputProps {
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value?: any;
  onChange?: (value: any) => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  activeTooltip: string | null;
}

const SearchInput = ({ 
  type, 
  placeholder, 
  icon, 
  value, 
  onChange,
  onHoverStart,
  onHoverEnd,
  activeTooltip
}: SearchInputProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      style={{ position: 'relative', flex: 1 }}
    >
      <Tooltip 
        open={activeTooltip === type}
        title={
          <Box sx={{ 
            p: 0.5, 
            fontSize: '0.85rem',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            {type === 'from' && <FlightTakeoffIcon fontSize="small" />}
            {type === 'to' && <FlightLandIcon fontSize="small" />}
            {type === 'date' && <CalendarTodayIcon fontSize="small" />}
            {tooltips[type as keyof typeof tooltips]}
          </Box>
        }
        placement="top"
        arrow
        PopperProps={{
          sx: {
            '& .MuiTooltip-tooltip': {
              bgcolor: 'white',
              color: 'text.primary',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              p: 1,
              '& .MuiTooltip-arrow': {
                color: 'white',
              },
            },
          },
        }}
      >
        <Autocomplete
          value={value}
          onChange={(_, newValue) => onChange?.(newValue)}
          options={FLIGHT_SUGGESTIONS}
          getOptionLabel={(option) => 
            typeof option === 'string' ? option : `${option.code} - ${option.city}`
          }
          sx={{ 
            '& .MuiOutlinedInput-root': {
              height: '45px',
              backgroundColor: 'white',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF1493',
                  borderWidth: '1px',
                }
              },
              '&.Mui-focused': {
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF1493',
                  borderWidth: '2px',
                }
              }
            }
          }}
          renderOption={(props, option) => (
            <motion.div
              whileHover={{ backgroundColor: '#f5f5f5' }}
              style={{ width: '100%' }}
            >
              <Box component="li" {...props} sx={{
                p: '12px !important',
                '&:hover': {
                  bgcolor: 'rgba(255,20,147,0.05)',
                }
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1.5 
                }}>
                  <Box sx={{
                    bgcolor: 'rgba(255,20,147,0.1)',
                    p: 0.8,
                    borderRadius: '50%',
                  }}>
                    <FlightTakeoffIcon sx={{ 
                      fontSize: 18,
                      color: '#FF1493'
                    }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {option.code} - {option.city}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                    >
                      {option.airport}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    ml: 1,
                    color: '#FF1493'
                  }}>
                    {icon}
                  </Box>
                )
              }}
            />
          )}
        />
      </Tooltip>
    </motion.div>
  );
};

interface FlightResultProps {
  flight: Flight;
  onSelect: () => void;
}

const FlightResult: React.FC<FlightResultProps> = ({ flight, onSelect }) => (
  <Paper 
    elevation={2} 
    sx={{ 
      p: 2, 
      mb: 2,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)'
      }
    }}
  >
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={flight.logo}
            alt={flight.airline}
            sx={{ height: 40, objectFit: 'contain' }}
          />
          <Box>
            <Typography variant="subtitle1">{flight.airline}</Typography>
            <Typography variant="caption" color="text.secondary">
              {flight.flightNumber}
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="h6">{flight.departureTime}</Typography>
            <Typography variant="caption" color="text.secondary">
              {flight.from}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {flight.duration}
            </Typography>
            <Box sx={{ position: 'relative', height: '2px', bgcolor: '#ddd', my: 0.5 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  position: 'absolute',
                  top: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: 'background.paper',
                  px: 1
                }}
              >
                {flight.type}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6">{flight.arrivalTime}</Typography>
            <Typography variant="caption" color="text.secondary">
              {flight.to}
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 2
        }}>
          <Box sx={{ textAlign: 'right' }}>
            {flight.specialOffer ? (
              <>
                <Box sx={{ 
                  bgcolor: 'error.main',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  mb: 0.5,
                  display: 'inline-block'
                }}>
                  {flight.specialOffer.tag}
                </Box>
                <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                  ₹ {flight.price.toLocaleString()}
                  <Typography 
                    component="span" 
                    sx={{ 
                      textDecoration: 'line-through', 
                      color: 'text.secondary',
                      fontSize: '0.8rem'
                    }}
                  >
                    ₹ {flight.specialOffer.originalPrice.toLocaleString()}
                  </Typography>
                </Typography>
              </>
            ) : (
              <Typography variant="h6" color="primary">
                ₹ {flight.price.toLocaleString()}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {flight.seatsAvailable} seats left
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={onSelect}
            disabled={flight.seatsAvailable === 0}
            sx={{
              bgcolor: '#9c27b0',
              '&:hover': {
                bgcolor: '#7b1fa2'
              }
            }}
          >
            SELECT
          </Button>
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

interface Airport {
  code: string;
  name: string;
  city?: string;
}

interface SearchData {
  from: Airport;
  to: Airport;
  date: string;
}

export const SearchFlight = () => {
  const navigate = useNavigate();
  const { dispatch } = useFlightContext();
  const [openWelcome, setOpenWelcome] = useState(true);
  const [openInstructions, setOpenInstructions] = useState(false);
  const [searchData, setSearchData] = useState<SearchData>({
    from: { code: '', name: '' },
    to: { code: '', name: '' },
    date: ''
  });
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [availableFlights, setAvailableFlights] = useState<ReturnType<typeof generateFlightSchedules>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSwap = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleSearch = async () => {
    if (!searchData.from || !searchData.to || !searchData.date) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setSearchError(null);

    try {
      const fromCode = typeof searchData.from === 'string' 
        ? searchData.from 
        : typeof searchData.from === 'object' && 'code' in searchData.from ? (searchData.from as { code: string }).code : '';

      const toCode = typeof searchData.to === 'string'
        ? searchData.to
        : typeof searchData.to === 'object' && 'code' in searchData.to ? (searchData.to as { code: string }).code : '';

      if (fromCode === toCode) {
        setSearchError('Source and destination cannot be the same');
        setIsLoading(false);
        return;
      }

      const flights = generateFlightSchedules(fromCode, toCode, searchData.date);

      if (flights.length === 0) {
        setSearchError('No flights available for this route');
      } else {
        setAvailableFlights(flights);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error searching flights:', error);
      setSearchError('Error searching flights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFlight = (flight: Flight) => {
    try {
      dispatch({
        type: 'SET_FLIGHT_DETAILS',
        payload: {
          from: flight.from,
          to: flight.to,
          date: flight.date,
          flightNumber: flight.flightNumber,
          airline: flight.airline,
          airlineCode: flight.airlineCode,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          terminal: flight.terminal,
          gate: flight.gate,
          duration: flight.duration
        }
      });
      setOpenInstructions(true);
    } catch (error) {
      console.error('Error saving flight details:', error);
      alert('Please select valid flight details');
    }
  };

  const backgroundStyle = {
    background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/flight-background.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    width: '100%',
    position: 'relative' as const,
  };

  const renderWelcomeDialog = () => (
    <Dialog 
      open={openWelcome} 
      onClose={() => setOpenWelcome(false)}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: '400px',
          background: 'rgba(255, 255, 255, 0.98)',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 2, pb: 1 }}>
        <Typography variant="h5" fontWeight={500}>
          Welcome to Digi Yatra!
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <DialogContentText sx={{ 
          textAlign: 'center', 
          mb: 2,
          color: '#666'
        }}>
          Get ready to embark on a virtual flight journey, experiencing seamless travel and witnessing the power of AI-driven face detection.
        </DialogContentText>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            onClick={() => setOpenWelcome(false)}
            variant="contained"
            size="small"
            sx={{
              minWidth: '60px',
              background: '#2196F3',
              borderRadius: '4px',
              px: 3,
              py: 0.5,
              textTransform: 'none',
              '&:hover': {
                background: '#1976D2',
              }
            }}
          >
            OK
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const renderInstructionDialog = () => (
    <Dialog 
      open={openInstructions} 
      onClose={() => setOpenInstructions(false)}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: '400px',
          background: 'rgba(255, 255, 255, 0.98)',
        }
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <DialogContentText sx={{ 
          textAlign: 'center',
          color: '#666'
        }}>
          Let's assume you and your friend are planning to book a flight to go on a vacation.
        </DialogContentText>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: 2 
        }}>
          <Button 
            onClick={() => setOpenInstructions(false)}
            sx={{ color: '#666' }}
          >
            Back
          </Button>
          <Button 
            onClick={() => {
              setOpenInstructions(false);
              navigate('/passenger-details');
            }}
            variant="contained"
            sx={{
              bgcolor: '#FF1493',
              '&:hover': {
                bgcolor: '#FF1493',
              }
            }}
          >
            Next
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

  return (
    <Box 
      sx={{
        ...backgroundStyle,
        transition: 'margin-left 0.3s ease',
        marginLeft: { xs: 0, md: '65px' },
        width: 'auto',
      }}
    >
      {renderWelcomeDialog()}
      {renderInstructionDialog()}
      
      <SearchContainer>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            align="center" 
            sx={{ 
              color: 'white', 
              mb: 4,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontWeight: 500,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Search Flight
          </Typography>
          
          <SearchBox elevation={3}>
            <SearchForm>
              <SearchInput 
                type="from"
                placeholder="From"
                icon={<FlightTakeoffIcon sx={{ ml: 1, mr: 1, color: 'primary.main' }} />}
                value={searchData.from}
                onChange={(newValue) => setSearchData(prev => ({ ...prev, from: newValue }))}
                onHoverStart={() => setActiveTooltip("from")}
                onHoverEnd={() => setActiveTooltip(null)}
                activeTooltip={activeTooltip}
              />
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton 
                  onClick={handleSwap}
                  sx={{ 
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'transparent',
                    color: '#FF1493',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 20, 147, 0.1)'
                    }
                  }}
                >
                  <CompareArrowsIcon sx={{ fontSize: '20px' }} />
                </IconButton>
              </motion.div>
              
              <SearchInput 
                type="to"
                placeholder="To"
                icon={<FlightLandIcon sx={{ ml: 1, mr: 1, color: 'primary.main' }} />}
                value={searchData.to}
                onChange={(newValue) => setSearchData(prev => ({ ...prev, to: newValue }))}
                onHoverStart={() => setActiveTooltip("to")}
                onHoverEnd={() => setActiveTooltip(null)}
                activeTooltip={activeTooltip}
              />
              
              <TextField
                type="date"
                value={searchData.date}
                onChange={(e) => setSearchData(prev => ({ ...prev, date: e.target.value }))}
                sx={{ 
                  width: '150px',
                  '& .MuiOutlinedInput-root': {
                    height: '45px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2196F3',
                      }
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <CalendarTodayIcon sx={{ 
                      ml: 1, 
                      mr: 1, 
                      color: 'primary.main',
                      fontSize: '20px'
                    }} />
                  )
                }}
              />
              
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSearch}
                sx={{ 
                  minWidth: '45px', 
                  height: '45px',
                  borderRadius: '8px',
                  backgroundColor: '#9c27b0',
                  padding: '8px',
                  '&:hover': {
                    backgroundColor: '#7b1fa2'
                  }
                }}
              >
                <SearchIcon sx={{ fontSize: '20px' }} />
              </Button>
            </SearchForm>
          </SearchBox>
        </motion.div>

        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: '2rem' }}
          >
            <Typography variant="h5" sx={{ mb: 3, color: 'white' }}>
              {searchError ? (
                <Box sx={{ color: 'error.main' }}>{searchError}</Box>
              ) : (
                `${availableFlights.length} Flights Available`
              )}
            </Typography>
            
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress sx={{ color: 'white' }} />
              </Box>
            ) : (
              availableFlights.map((flight) => (
                <FlightResult
                  key={flight.id}
                  flight={flight}
                  onSelect={() => handleSelectFlight(flight)}
                />
              ))
            )}
          </motion.div>
        )}
      </SearchContainer>
    </Box>
  );
}; 