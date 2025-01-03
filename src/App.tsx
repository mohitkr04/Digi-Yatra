import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { Sidebar } from './components/Sidebar';
import { SearchFlight } from './pages/SearchFlight';
import { PassengerDetails } from './pages/PassengerDetails';
import { SeatSelection } from './pages/SeatSelection';
import { BoardingPass } from './pages/BoardingPass';
import { SelfCheckIn } from './pages/SelfCheckIn';
import './styles/global.css';
import './App.css';
import { Box } from '@mui/material';
import { FlightProvider } from './context/FlightContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <Theme appearance="light" accentColor="blue" radius="medium">
      <FlightProvider>
        <Router>
          <Box 
            className="app" 
            sx={{ 
              backgroundImage: {
                xs: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/Aeroplan.jpg")',
              },
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              minHeight: '100vh',
              width: '100%',
              display: 'flex',
            }}
          >
            <Sidebar />
            <Box 
              className="content-wrapper"
              sx={{
                flex: 1,
                minHeight: '100vh',
                marginLeft: '65px',
                transition: 'margin-left 0.3s ease',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box 
                component="main"
                className="main-content"
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  width: '100%',
                  overflow: 'auto',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <Routes>
                  <Route path="/" element={<SearchFlight />} />
                  <Route path="/passenger-details" element={<PassengerDetails />} />
                  <Route path="/seat-selection" element={<SeatSelection />} />
                  <Route path="/boarding-pass" element={
                    <ErrorBoundary>
                      <BoardingPass />
                    </ErrorBoundary>
                  } />
                  <Route path="/self-check-in" element={<SelfCheckIn />} />
                </Routes>
              </Box>
            </Box>
          </Box>
        </Router>
      </FlightProvider>
    </Theme>
  );
}

export default App; 