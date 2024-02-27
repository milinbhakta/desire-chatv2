// Layout.tsx
import React, { ReactNode } from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';
import { Box } from '@mui/material';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
    }}
  >
    <Box sx={{ overflow: 'hidden' }}>
      <ResponsiveAppBar />
    </Box>
    <Box sx={{ flex: 1, overflow: 'hidden' }}>{children}</Box>
  </Box>
);

export default Layout;
