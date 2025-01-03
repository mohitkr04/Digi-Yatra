import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import { motion } from 'framer-motion';

interface Flight {
  id: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  status: string;
}

export const FlightList = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await fetch('/api/flights');
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Flight Number</TableCell>
            <TableCell>Departure</TableCell>
            <TableCell>Arrival</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flights.map((flight) => (
            <motion.tr
              key={flight.id}
              whileHover={{ scale: 1.02, backgroundColor: '#f5f5f5' }}
              transition={{ duration: 0.2 }}
            >
              <TableCell>{flight.flightNumber}</TableCell>
              <TableCell>{flight.departure}</TableCell>
              <TableCell>{flight.arrival}</TableCell>
              <TableCell>{flight.status}</TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 