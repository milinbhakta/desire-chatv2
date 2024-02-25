import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { useAuth } from '../Components/Context/AuthProvider';
import { convertNameToId } from '../utils';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [name, setName] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const handleLogin = async () => {
    await login({ id: convertNameToId(name), name, image: `https://robohash.org/${name}` });
    navigate('/chat');
  };

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [navigate, user]);

  return (
    <Container>
      <Card sx={{ marginTop: 40, padding: 2 }}>
        <CardHeader title="Login" />
        <CardContent>
          <TextField
            required
            id="standard-required"
            label="Full Name"
            placeholder="Enter your full name"
            variant="standard"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" size="medium" onClick={handleLogin}>
            Login
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default HomePage;
