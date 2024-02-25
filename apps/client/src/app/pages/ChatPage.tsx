import { useEffect } from 'react';
import { useLoggedInAuth } from '../Components/Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
  ChannelPreviewProps,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import {
  Avatar,
  Box,
  CircularProgress,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';

const ChatPage = () => {
  const { user, streamChat } = useLoggedInAuth();
  const navigate = useNavigate();
  const filters = { type: 'messaging', members: { $in: [user.id] } };
  const options = { state: true, presence: true, limit: 10 };
  const sort = { last_message_at: -1 };

  useEffect(() => {
    if (!user && !streamChat) {
      navigate('/');
    }
  }, []);

  const CustomChannelPreview = (props: ChannelPreviewProps) => {
    const { channel, setActiveChannel } = props;
    const { messages } = channel.state;
    const messagePreview = messages[messages.length - 1]?.text?.slice(0, 30);
    return (
      <ListItemButton onClick={() => setActiveChannel?.(channel)}>
        <ListItemAvatar>
          <Avatar
            alt={channel.data?.name}
            src={`https://robohash.org/${channel.data?.name}`}
          />
        </ListItemAvatar>
        <ListItemText
          primary={channel.data?.name || 'Unnamed Channel'}
          secondary={messagePreview ?? 'No messages yet'}
        />
      </ListItemButton>
    );
  };

  if (!streamChat) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      {streamChat && (
        <Chat client={streamChat}>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ flexGrow: 1 }}>
              <ChannelList
                filters={filters}
                sort={sort}
                options={options}
                Preview={CustomChannelPreview}
                showChannelSearch
              />
            </Box>
            <Box sx={{ flexGrow: 8 }}>
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
    </div>
  );
};

export default ChatPage;
