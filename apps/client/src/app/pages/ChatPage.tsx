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
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

const ChatPage = () => {
  const { user, streamChat } = useLoggedInAuth();
  const navigate = useNavigate();
  const filters = { type: 'messaging', members: { $in: [user?.id] } };
  const options = { state: true, presence: true, limit: 10 };
  const sort = { last_message_at: -1 };

  useEffect(() => {
    if (!user && !streamChat) {
      navigate('/');
    }
  }, []);

  return (
    <div>
      {streamChat && (
        <Chat client={streamChat}>
          <ChannelList filters={filters} sort={sort} options={options} />
          <Channel>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      )}
    </div>
  );
};

export default ChatPage;
