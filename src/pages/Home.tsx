import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { FlightList } from '../components/FlightList';

export function Home() {
  return (
    <Box component="main" className="content-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <section className="hero-section">
          <h1>Welcome to DigiYatra</h1>
          <p>Experience seamless air travel with facial recognition</p>
        </section>

        <section className="flights-section">
          <h2>Available Flights</h2>
          <FlightList />
        </section>
      </motion.div>
    </Box>
  );
} 