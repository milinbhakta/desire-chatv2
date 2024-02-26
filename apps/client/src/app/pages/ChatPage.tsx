import { useEffect, useState } from 'react';
import { useLoggedInAuth } from '../Components/Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Chat, Channel } from 'stream-chat-react';
import { Box, CircularProgress } from '@mui/material';
import MessagingSidebar from '../Components/MessagingSidebar';
import { ChannelOptions, ChannelSort } from 'stream-chat';
import SendButton from '../Components/SendButton';
import MessagingThreadHeader from '../Components/MessagingThreadHeader';
import { EmojiPicker } from 'stream-chat-react/emojis';
import { GiphyContextProvider } from '../Components/Context/Giphy';
import CreateChannel from '../Components/CreateChannel';
import ChannelInner from '../Components/ChannelInner';
// import 'stream-chat-react/dist/css/v2/index.css';

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

  const WrappedEmojiPicker = () => {
    // const { theme } = useThemeContext();

    return <EmojiPicker />;
  };

  if (!streamChat) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      {streamChat && (
        <Chat client={streamChat}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ flex: '1 0 auto' }}>
              <MessagingSidebar
                channelListOptions={channelListOptions}
                onClick={() => console.log('clicked mobile view')}
                onCreateChannel={() => setIsCreating(!isCreating)}
                onPreviewSelect={() => setIsCreating(false)}
              />
            </Box>
            <Box sx={{ flex: '8 1 auto', overflow: 'auto' }}>
              <Channel
                maxNumberOfFiles={10}
                multipleUploads={true}
                SendButton={SendButton}
                ThreadHeader={MessagingThreadHeader}
                TypingIndicator={() => null}
              >
                {isCreating && (
                  <CreateChannel
                    toggleMobile={() => console.log('toggled mobile')}
                    onClose={() => setIsCreating(false)}
                  />
                )}
                <GiphyContextProvider>
                  <ChannelInner
                    theme={'light'}
                    toggleMobile={() => console.log('toggled mobile')}
                  />
                </GiphyContextProvider>
              </Channel>
            </Box>
          </Box>
        </Chat>
      )}
    </Box>
  );
};

export default ChatPage;
