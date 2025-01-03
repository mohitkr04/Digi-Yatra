import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import Webcam from 'react-webcam';
import { useFlightContext } from '../context/FlightContext';
import { useNavigate } from 'react-router-dom';

export const SelfCheckIn = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useFlightContext();
  const [activeStep, setActiveStep] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    person1: false,
    person2: false
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const steps = ['Passenger 1 Verification', 'Passenger 2 Verification', 'Confirmation'];

  const handleCapture = async (person: 'person1' | 'person2') => {
    setIsCapturing(true);
    try {
      // Simulate face verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationStatus(prev => ({
        ...prev,
        [person]: true
      }));

      // Update context with verification status
      dispatch({
        type: 'UPDATE_CHECK_IN_STATUS',
        payload: {
          [`${person}Verified`]: true
        }
      });

      if (person === 'person1') {
        setActiveStep(1); // Move to passenger 2
      } else {
        setActiveStep(2); // Move to confirmation
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleComplete = () => {
    navigate('/boarding-pass');
  };

  const renderPassengerVerification = (person: 'person1' | 'person2') => {
    const passengerData = state?.passengers[person];
    
    return (
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Verifying {passengerData?.firstName} {passengerData?.lastName}
        </Typography>
        
        <Box sx={{ 
          position: 'relative',
          width: '320px',
          margin: '0 auto',
          mt: 2 
        }}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{
              width: '100%',
              borderRadius: '8px'
            }}
          />
          {isCapturing && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.5)',
              borderRadius: '8px'
            }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          onClick={() => handleCapture(person)}
          disabled={isCapturing || verificationStatus[person]}
          sx={{ 
            mt: 2,
            bgcolor: '#FF1493',
            '&:hover': {
              bgcolor: '#FF1493dd'
            }
          }}
        >
          {verificationStatus[person] ? 'Verified ✓' : 'Verify Face'}
        </Button>
      </Box>
    );
  };

  const renderConfirmation = () => (
    <Box sx={{ textAlign: 'center', mt: 3 }}>
      <Typography variant="h6" gutterBottom color="success.main">
        Both passengers verified successfully!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You can now proceed to download your boarding passes.
      </Typography>
      <Button
        variant="contained"
        onClick={handleComplete}
        sx={{
          bgcolor: '#FF1493',
          '&:hover': {
            bgcolor: '#FF1493dd'
          }
        }}
      >
        View Boarding Pass
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Self Check-in
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && renderPassengerVerification('person1')}
          {activeStep === 1 && renderPassengerVerification('person2')}
          {activeStep === 2 && renderConfirmation()}
        </Paper>
      </motion.div>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          variant="filled"
          onClose={() => setShowSuccess(false)}
        >
          Verification completed! You can now download your boarding passes.
        </Alert>
      </Snackbar>
    </Container>
  );
}; 