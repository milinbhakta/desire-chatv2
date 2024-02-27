import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Components/Layout';
import HomePage from './pages/Home';
import { AuthProvider } from './Components/Context/AuthProvider';
import Chat from './pages/ChatPage';

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Layout>
    </Router>
  </AuthProvider>
);

export default App;
