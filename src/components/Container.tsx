import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <Box
      sx={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: { xs: 2, sm: 3 },
        width: '100%'
      }}
    >
      {children}
    </Box>
  );
}; 