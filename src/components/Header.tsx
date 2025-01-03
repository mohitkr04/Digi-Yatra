import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  styled,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import FlightIcon from '@mui/icons-material/Flight';
import PersonIcon from '@mui/icons-material/Person';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import MenuIcon from '@mui/icons-material/Menu';

const DrawerItem = styled(motion.div)({
  width: '100%',
});

const menuItems = [
  { text: 'Search Flight', icon: <FlightIcon />, path: '/' },
  { text: 'Passenger Details', icon: <PersonIcon />, path: '/passenger-details' },
  { text: 'Select Seat', icon: <EventSeatIcon />, path: '/seat-selection' },
  { text: 'Boarding Pass', icon: <ConfirmationNumberIcon />, path: '/boarding-pass' },
  { text: 'Self Check-in', icon: <HowToRegIcon />, path: '/self-check-in' },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <IconButton
        sx={{
          position: 'fixed',
          left: 16,
          top: 16,
          zIndex: 1200,
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        }}
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: 'linear-gradient(180deg, #ff758c 0%, #ff7eb3 100%)',
            color: 'white',
            padding: '1rem',
          },
        }}
      >
        <Box sx={{ mt: 5 }}>
          <List>
            {menuItems.map((item, index) => (
              <DrawerItem
                key={item.text}
                whileHover={{ scale: 1.02, x: 5 }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListItem
                  component="div"
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </DrawerItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}; 