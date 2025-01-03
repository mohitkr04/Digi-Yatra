import { useState, useRef } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { Camera, Delete, Help, ChevronRight, ChevronLeft } from '@mui/icons-material';
import { useFlightContext } from '../context/FlightContext';
import { useNavigate } from 'react-router-dom';

const MAX_CAPTURES = 6;
const FACE_ANIMATION_VIDEO = '/Face Recognition.mp4';

const faceGuideAnimations = [
  { transform: 'rotate(0deg)', text: 'Look straight' },
  { transform: 'rotate(-15deg)', text: 'Turn slightly left' },
  { transform: 'rotate(15deg)', text: 'Turn slightly right' },
  { transform: 'rotate(0deg) translateY(-5px)', text: 'Tilt up slightly' },
  { transform: 'rotate(0deg) translateY(5px)', text: 'Tilt down slightly' }
];

interface FaceImage {
  id: string;
  dataUrl: string;
}

type PersonKey = 'person1' | 'person2';

interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  images: string[];
}

interface PassengerDetails {
  person1: Passenger;
  person2: Passenger;
}


export const PassengerDetails = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState<Record<PersonKey, FaceImage[]>>({
    person1: [],
    person2: [],
  });
  const [currentPerson, setCurrentPerson] = useState(1);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentAngle] = useState(0);

  const { dispatch } = useFlightContext();

  const [formData, setFormData] = useState({
    person1: {
      firstName: '',
      lastName: '',
      email: '',
      images: [] as FaceImage[],
    },
    person2: {
      firstName: '',
      lastName: '',
      email: '',
      images: [] as FaceImage[],
    },
  });


  const handleDeleteImage = (imageId: string) => {
    const person = `person${currentPerson}` as PersonKey;
    setCapturedImages(prev => ({
      ...prev,
      [person]: prev[person].filter(img => img.id !== imageId),
    }));
    setFormData(prev => ({
      ...prev,
      [person]: {
        ...prev[person as keyof typeof prev],
        images: prev[person].images.filter(img => img.id !== imageId),
      },
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const person = `person${currentPerson}` as PersonKey;
    setFormData(prev => ({
      ...prev,
      [person]: {
        ...prev[person as keyof typeof prev],
        [name]: value,
      },
    }));
  };

  const handleSubmit = () => {
    const person1 = formData.person1;
    const person2 = formData.person2;

    const validatePerson = (person: Passenger, personNum: number) => {
      const errors = [];
      if (!person.firstName.trim()) errors.push(`Person ${personNum}: First name is required`);
      if (!person.lastName.trim()) errors.push(`Person ${personNum}: Last name is required`);
      if (!person.email.trim()) errors.push(`Person ${personNum}: Email is required`);
      if (person.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) {
        errors.push(`Person ${personNum}: Invalid email format`);
      }
      if (!person.images.length) errors.push(`Person ${personNum}: At least one face capture is required`);
      return errors;
    };
    const errors = [
      ...validatePerson(person1 as unknown as Passenger, 1),
      ...validatePerson(person2 as unknown as Passenger, 2)
    ];

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    try {
      const passengerData: PassengerDetails = {
        person1: {
          firstName: formData.person1.firstName.trim(),
          lastName: formData.person1.lastName.trim(),
          email: formData.person1.email.trim(),
          images: formData.person1.images.map(img => img.dataUrl)
        },
        person2: {
          firstName: formData.person2.firstName.trim(),
          lastName: formData.person2.lastName.trim(),
          email: formData.person2.email.trim(),
          images: formData.person2.images.map(img => img.dataUrl)
        }
      };

      dispatch({
        type: 'SET_PASSENGER_DETAILS',
        payload: passengerData
      });

      navigate('/seat-selection');
    } catch (error) {
      console.error('Error saving passenger details:', error);
      alert('There was an error saving passenger details. Please try again.');
    }
  };

  const startCapture = async () => {
    const person = `person${currentPerson}` as PersonKey;
    const currentImageCount = capturedImages[person]?.length || 0;
    
    if (currentImageCount >= MAX_CAPTURES) {
      alert('Maximum number of captures reached. Delete an image to capture a new one.');
      return;
    }

    setIsCapturing(true);
    setCaptureProgress(0);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          const newImage: FaceImage = {
            id: Date.now().toString(),
            dataUrl: imageSrc,
          };
          
          setCapturedImages(prev => ({
            ...prev,
            [person]: [...(prev[person] || []), newImage],
          }));
          
          setFormData(prev => ({
            ...prev,
            [person]: {
              ...prev[person],
              images: [...prev[person].images, newImage],
            },
          }));
        }
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      alert('Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
      setCaptureProgress(100);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            Enter Details
          </Typography>

          {/* Person Selector */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2, 
            mb: 4 
          }}>
            {[1, 2].map((person) => (
              <Button
                key={person}
                variant={currentPerson === person ? "contained" : "outlined"}
                onClick={() => setCurrentPerson(person)}
                sx={{
                  minWidth: 120,
                  bgcolor: currentPerson === person ? '#FF1493' : 'transparent',
                  borderColor: '#FF1493',
                  color: currentPerson === person ? 'white' : '#FF1493',
                  '&:hover': {
                    bgcolor: currentPerson === person ? '#FF1493' : 'rgba(255,20,147,0.1)',
                  }
                }}
              >
                Person {person}
              </Button>
            ))}
          </Box>

          {/* Form Fields */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData[`person${currentPerson}` as PersonKey].firstName}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#FF1493',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF1493',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData[`person${currentPerson}` as PersonKey].lastName}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#FF1493',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF1493',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData[`person${currentPerson}` as PersonKey].email}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#FF1493',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF1493',
                    }
                  }
                }}
              />
            </Grid>

            {/* Face Capture Section */}
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                bgcolor: 'rgba(255,20,147,0.05)', 
                borderRadius: 2,
                border: '1px dashed #FF1493'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  justifyContent: 'space-between'
                }}>
                  <Typography variant="subtitle1" sx={{ 
                    color: '#FF1493',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 500
                  }}>
                    <Camera fontSize="small" />
                    Capture your face from different angles
                  </Typography>
                  <Tooltip title="Capture 5 different angles of your face for better recognition">
                    <Help sx={{ color: '#FF1493', fontSize: '18px' }} />
                  </Tooltip>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                  alignItems: { xs: 'center', md: 'flex-start' }
                }}>
                  <Box sx={{ 
                    flex: '0 0 auto',
                    width: { xs: '100%', md: '300px' }
                  }}>
                    {isCameraOpen ? (
                      <Box sx={{ 
                        position: 'relative',
                        width: '100%',
                        maxWidth: '300px',
                        margin: '0 auto'
                      }}>
                        <Webcam
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          style={{ 
                            width: '100%', 
                            height: '225px',
                            borderRadius: '8px',
                            transform: faceGuideAnimations[currentAngle]?.transform,
                            objectFit: 'cover'
                          }}
                        />
                        
                        {/* Face Guide Overlay */}
                        <Box sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '120px',
                          height: '120px',
                          border: '2px solid #FF1493',
                          borderRadius: '50%',
                          pointerEvents: 'none'
                        }} />

                        {/* Progress Indicator */}
                        {isCapturing && (
                          <Box sx={{
                            position: 'absolute',
                            bottom: 10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            textAlign: 'center',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <CircularProgress 
                              variant="determinate" 
                              value={captureProgress}
                              size={30}
                              sx={{ color: '#FF1493' }}
                            />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'white',
                                bgcolor: 'rgba(0,0,0,0.5)',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1
                              }}
                            >
                              {faceGuideAnimations[currentAngle]?.text}
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ 
                          mt: 2,
                          display: 'flex',
                          gap: 1,
                          justifyContent: 'center'
                        }}>
                          <Button
                            variant="contained"
                            onClick={startCapture}
                            disabled={isCapturing || capturedImages[`person${currentPerson}` as PersonKey]?.length >= MAX_CAPTURES}
                            size="small"
                            sx={{
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
                            {isCapturing ? 'Capturing...' : 'Capture Image'}
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => setIsCameraOpen(false)}
                            size="small"
                            sx={{
                              borderColor: '#FF1493',
                              color: '#FF1493',
                              '&:hover': {
                                borderColor: '#FF1493',
                                bgcolor: 'rgba(255,20,147,0.1)'
                              }
                            }}
                          >
                            Close Camera
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        height: '225px',
                        border: '2px dashed #FF1493',
                        borderRadius: '8px',
                        bgcolor: 'rgba(255,20,147,0.02)',
                        padding: 2,
                        justifyContent: 'center'
                      }}>
                        <Box sx={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          border: '2px solid #FF1493'
                        }}>
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          >
                            <source src={FACE_ANIMATION_VIDEO} type="video/mp4" />
                          </video>
                        </Box>

                        <Button
                          variant="outlined"
                          onClick={() => setIsCameraOpen(true)}
                          startIcon={<Camera />}
                          size="small"
                          sx={{
                            borderColor: '#FF1493',
                            color: '#FF1493',
                            '&:hover': {
                              borderColor: '#FF1493',
                              bgcolor: 'rgba(255,20,147,0.1)'
                            }
                          }}
                        >
                          Open Camera
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ 
                    flex: 1,
                    minWidth: 0,
                    alignSelf: 'stretch'
                  }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 2,
                      color: 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>Captured Images</span>
                      <span style={{ 
                        color: capturedImages[`person${currentPerson}` as PersonKey]?.length === MAX_CAPTURES ? '#FF1493' : 'inherit'
                      }}>
                        ({capturedImages[`person${currentPerson}` as PersonKey]?.length || 0}/{MAX_CAPTURES})
                      </span>
                    </Typography>

                    <Grid container spacing={1}>
                      {Array.from({ length: MAX_CAPTURES }).map((_, index) => {
                        const image = capturedImages[`person${currentPerson}` as PersonKey]?.[index];
                        
                        return (
                          <Grid item xs={4} sm={4} md={4} key={`capture-slot-${index}`}>
                            <Box sx={{ 
                              position: 'relative',
                              paddingTop: '100%',
                              width: '100%',
                              border: '1px dashed',
                              borderColor: image ? '#FF1493' : 'rgba(255,20,147,0.2)',
                              borderRadius: '4px',
                              bgcolor: image ? 'transparent' : 'rgba(255,20,147,0.02)',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                borderColor: '#FF1493',
                                bgcolor: 'rgba(255,20,147,0.05)'
                              }
                            }}>
                              {image ? (
                                <>
                                  <img 
                                    src={image.dataUrl} 
                                    alt={`Capture ${index + 1}`}
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      borderRadius: '3px'
                                    }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteImage(image.id)}
                                    sx={{
                                      position: 'absolute',
                                      top: -6,
                                      right: -6,
                                      bgcolor: 'white',
                                      padding: '2px',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                      '&:hover': {
                                        bgcolor: '#ffebf3'
                                      }
                                    }}
                                  >
                                    <Delete sx={{ fontSize: 12, color: '#FF1493' }} />
                                  </IconButton>
                                </>
                              ) : (
                                <Box sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: 'rgba(255,20,147,0.5)',
                                      fontSize: '0.7rem'
                                    }}
                                  >
                                    {index + 1}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </Box>

                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    mt: 2,
                    textAlign: 'center'
                  }}
                >
                  <Help fontSize="small" />
                  Follow the animation guide to capture your face
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              startIcon={<ChevronLeft />}
              sx={{
                borderColor: '#FF1493',
                color: '#FF1493',
                '&:hover': {
                  borderColor: '#FF1493',
                  bgcolor: 'rgba(255,20,147,0.1)'
                }
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              endIcon={<ChevronRight />}
              sx={{
                bgcolor: '#FF1493',
                '&:hover': {
                  bgcolor: '#FF1493dd'
                }
              }}
            >
              Continue
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}; 