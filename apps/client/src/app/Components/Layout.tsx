// Layout.tsx
import React, { ReactNode } from 'react';
import ResponsiveAppBar from './ResponsiveAppBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div>
    <ResponsiveAppBar />
    <main>{children}</main>
  </div>
);

export default Layout;
