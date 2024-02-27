import { useEffect, useState } from 'react';
import { useLoggedInAuth } from '../Components/Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Chat, Channel, SendButton } from 'stream-chat-react';
import { Box, CircularProgress } from '@mui/material';
import MessagingSidebar from '../Components/MessagingSidebar';
import { ChannelOptions, ChannelSort } from 'stream-chat';
import MessagingThreadHeader from '../Components/MessagingThreadHeader';
import { GiphyContextProvider } from '../Components/Context/Giphy';
import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';
import 'stream-chat-react/dist/css/v2/index.css';
import CreateChannel from '../Components/CreateChannel';
import ChannelInner from '../Components/ChannelInner';
import { EmojiPicker } from 'stream-chat-react/emojis';

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

  if (!streamChat) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        height: '100%',
      }}
    >
      <Chat client={streamChat} theme={`messaging str-chat__theme-dark`}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
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
              EmojiPicker={EmojiPicker}
              emojiSearchIndex={SearchIndex}
            >
              {isCreating && (
                <CreateChannel onClose={() => setIsCreating(false)} />
              )}
              <GiphyContextProvider>
                <ChannelInner />
              </GiphyContextProvider>
            </Channel>
          </Box>
        </Box>
      </Chat>
    </Box>
  );
};

export default ChatPage;
