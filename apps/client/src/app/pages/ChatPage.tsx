import { useEffect, useState } from 'react';
import { useLoggedInAuth } from '../Components/Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react';
import { Box, CircularProgress } from '@mui/material';
import MessagingSidebar from '../Components/MessagingSidebar';
import { ChannelOptions, ChannelSort } from 'stream-chat';
import 'stream-chat-react/dist/css/v2/index.css';

const ChatPage = () => {
  const { user, streamChat } = useLoggedInAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const filters = { type: 'messaging', members: { $in: [user.id] } };
  const options: ChannelOptions = {
    state: true,
    watch: true,
    presence: true,
    limit: 8,
  };

  const sort: ChannelSort = {
    last_message_at: -1,
    updated_at: -1,
  };

  useEffect(() => {
    if (!user && !streamChat) {
      navigate('/');
    }
  }, []);

  const channelListOptions = { filters, options, sort };

  if (!streamChat) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh' }}>
      {streamChat && (
        <Chat client={streamChat}>
          <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
            <Box sx={{ flex: '1 0 auto' }}>
              <MessagingSidebar
                channelListOptions={channelListOptions}
                onClick={() => console.log('clicked mobile view')}
                onCreateChannel={() => setIsCreating(!isCreating)}
                onPreviewSelect={() => setIsCreating(false)}
              />
            </Box>
            <Box sx={{ flex: '8 1 auto', overflow: 'auto' }}>
              <Channel>
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            </Box>
          </Box>
        </Chat>
      )}
    </Box>
  );
};

export default ChatPage;
