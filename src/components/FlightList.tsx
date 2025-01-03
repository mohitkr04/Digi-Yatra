import { Box, Typography } from '@mui/material';
import { generateFlightSchedules } from '../data/flightData';

export const FlightList = () => {
  const today = new Date().toISOString().split('T')[0];
  const defaultFlights = generateFlightSchedules('DEL', 'BOM', today);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Popular Routes
      </Typography>
      {defaultFlights.slice(0, 3).map((flight) => (
        <Box
          key={flight.id}
          sx={{
            p: 2,
            mb: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1
          }}
        >
          <Typography variant="subtitle1">
            {flight.airline} - {flight.flightNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {flight.from} → {flight.to}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}; 