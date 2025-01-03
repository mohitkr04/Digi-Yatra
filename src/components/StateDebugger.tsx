import { Box, Typography } from '@mui/material';
import { useFlightContext } from '../context/FlightContext';

export const StateDebugger = () => {
  const { state } = useFlightContext();

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: 0, 
      right: 0, 
      p: 2, 
      bgcolor: 'rgba(0,0,0,0.8)', 
      color: 'white',
      maxWidth: '300px',
      maxHeight: '200px',
      overflow: 'auto'
    }}>
      <Typography variant="caption" component="pre">
        {JSON.stringify(state, null, 2)}
      </Typography>
    </Box>
  );
}; 