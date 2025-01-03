import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Flight,
  Person,
  EventSeat,
  ConfirmationNumber,
  Security,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';

const menuItems = [
  { path: '/', label: 'Search Flight', icon: <Flight /> },
  { path: '/passenger-details', label: 'Passenger Details', icon: <Person /> },
  { path: '/seat-selection', label: 'Seat Selection', icon: <EventSeat /> },
  { path: '/boarding-pass', label: 'Boarding Pass', icon: <ConfirmationNumber /> },
  { path: '/self-check-in', label: 'Self Check-in', icon: <Security /> },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const theme = useTheme();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Floating toggle button with improved styling
  const FloatingToggleButton = () => (
    <IconButton
      onClick={toggleDrawer}
      sx={{
        position: 'fixed',
        left: isOpen ? 240 : 65,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'linear-gradient(45deg, #FF69B4, #FF1493)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(255, 105, 180, 0.3)',
        width: 32,
        height: 70,
        borderRadius: '0 12px 12px 0',
        '&:hover': {
          background: 'linear-gradient(45deg, #FF1493, #FF69B4)',
          boxShadow: '0 6px 20px rgba(255, 105, 180, 0.4)',
        },
        '&:active': {
          transform: 'translateY(-50%) scale(0.95)',
        },
        transition: 'all 0.3s ease',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      {isOpen ? <ChevronLeft /> : <ChevronRight />}
    </IconButton>
  );

  return (
    <>
      <motion.div
        initial={{ width: 240 }}
        animate={{ width: isOpen ? 240 : 65 }}
        transition={{ duration: 0.3 }}
        className="sidebar"
      >
        <Box
          sx={{
            width: isOpen ? 240 : 65,
            height: '100vh',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            zIndex: theme.zIndex.drawer,
            transition: 'all 0.3s ease',
          }}
        >
          {/* Logo and Brand */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing(2),
              justifyContent: isOpen ? 'flex-start' : 'center',
              minHeight: 64,
              background: 'linear-gradient(45deg, #FF69B4, #FF1493)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(255, 105, 180, 0.2)',
            }}
          >
            {isOpen && (
              <Typography 
                variant="h6" 
                noWrap 
                component="div"
                sx={{ 
                  fontWeight: 600,
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                DigiYatra
              </Typography>
            )}
          </Box>

          <Divider sx={{ opacity: 0.2 }} />

          {/* Navigation Menu */}
          <List sx={{ p: 1 }}>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.path}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  my: 0.5,
                  justifyContent: isOpen ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    background: 'linear-gradient(45deg, rgba(255, 105, 180, 0.15), rgba(255, 20, 147, 0.15))',
                    color: '#FF1493',
                    '&:hover': {
                      background: 'linear-gradient(45deg, rgba(255, 105, 180, 0.2), rgba(255, 20, 147, 0.2))',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(255, 105, 180, 0.1)',
                    transform: 'translateX(5px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? '#FF1493' : 'inherit',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isOpen && (
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      style: {
                        fontWeight: location.pathname === item.path ? 600 : 400,
                      }
                    }}
                  />
                )}
              </ListItemButton>
            ))}
          </List>
        </Box>
      </motion.div>
      <FloatingToggleButton />
    </>
  );
} 