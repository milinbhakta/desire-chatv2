import { useEffect, useState } from 'react';
import { useLoggedInAuth } from '../Components/Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Chat, Channel, SendButton } from 'stream-chat-react';
import { Box, CircularProgress } from '@mui/material';
import MessagingSidebar from '../Components/MessagingSidebar';
import { ChannelOptions, ChannelSort } from 'stream-chat';
import MessagingThreadHeader from '../Components/MessagingThreadHeader';
import { GiphyContextProvider } from '../Components/Context/Giphy';
// import CreateChannel from '../Components/CreateChannel';
// import ChannelInner from '../Components/ChannelInner';
import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';
import EmojiPicker from '@emoji-mart/react';
import 'stream-chat-react/dist/css/v2/index.css';
import CreateChannel from '../Components/CreateChannel';
import ChannelInner from '../Components/ChannelInner';

init({ data });

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
    return <EmojiPicker pickerProps={{ dark: 'str-chat__theme-dark' }} />;
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
      <Chat client={streamChat} theme={`messaging str-chat__theme-dark`}>
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
              EmojiPicker={WrappedEmojiPicker}
              emojiSearchIndex={SearchIndex}
            >
              {isCreating && (
                <CreateChannel
                  // toggleMobile={() => console.log('toggled mobile')}
                  onClose={() => setIsCreating(false)}
                />
              )}
              <GiphyContextProvider>
                <ChannelInner
                  theme={'str-chat__theme-dark'}
                  toggleMobile={() => console.log('Mobile view toggled')}
                />
              </GiphyContextProvider>
            </Channel>
          </Box>
        </Box>
      </Chat>
    </Box>
  );
};

export default ChatPage;
