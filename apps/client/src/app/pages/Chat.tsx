import { useEffect } from 'react';
import { useAuth } from '../Components/Context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, []);

  return (
    <div>
      <h1>Chat</h1>
    </div>
  );
};

export default Chat;
