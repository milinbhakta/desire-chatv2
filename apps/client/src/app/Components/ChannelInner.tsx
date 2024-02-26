import { logChatPromiseExecution } from 'stream-chat';
import {
  MessageList,
  MessageInput,
  MessageToSend,
  Window,
  useChannelActionContext,
  Thread,
  useMessageContext,
} from 'stream-chat-react';
import { useGiphyContext } from './Context/Giphy';
import { StreamChatGenerics } from '../types';
import MessagingChannelHeader from './MessagingChannelHeader';
import { Avatar, Box, Typography } from '@mui/material';

export type ChannelInnerProps = {
  toggleMobile: () => void;
  theme: string;
};

const ChannelInner = (props: ChannelInnerProps) => {
  const { theme, toggleMobile } = props;
  const { giphyState, setGiphyState } = useGiphyContext();

  const { sendMessage } = useChannelActionContext<StreamChatGenerics>();

  const overrideSubmitHandler = (
    message: MessageToSend<StreamChatGenerics>
  ) => {
    let updatedMessage;

    if (message.attachments?.length && message.text?.startsWith('/giphy')) {
      const updatedText = message.text.replace('/giphy', '');
      updatedMessage = { ...message, text: updatedText };
    }

    if (giphyState) {
      const updatedText = `/giphy ${message.text}`;
      updatedMessage = { ...message, text: updatedText };
    }

    if (sendMessage) {
      const newMessage = updatedMessage || message;
      const parentMessage = newMessage.parent;

      const messageToSend = {
        ...newMessage,
        parent: parentMessage
          ? {
              ...parentMessage,
              created_at: parentMessage.created_at?.toString(),
              pinned_at: parentMessage.pinned_at?.toString(),
              updated_at: parentMessage.updated_at?.toString(),
            }
          : undefined,
      };

      const sendMessagePromise = sendMessage(messageToSend);
      logChatPromiseExecution(sendMessagePromise, 'send message');
    }

    setGiphyState(false);
  };

  const actions = ['delete', 'edit', 'flag', 'mute', 'react', 'reply'];

  const CustomMessage = () => {
    const { message } = useMessageContext();

    return (
      <Box display="flex" alignItems="flex-start" gap={2}>
        <Avatar src={message.user?.image} alt={message.user?.name} />
        <Box>
          <Typography variant="body1">{message.text}</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(message.created_at ?? '').toISOString()}
          </Typography>
          {message.attachments && (
            <Box>
              {message.attachments.map((attachment) => (
                <Box key={attachment.id}>
                  <img
                    src={attachment.image_url}
                    alt={attachment.title}
                    style={{ width: 250, height: 225 }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Window>
        <MessagingChannelHeader theme={theme} toggleMobile={toggleMobile} />
        <MessageList messageActions={actions} Message={CustomMessage} />
        <MessageInput focus overrideSubmitHandler={overrideSubmitHandler} />
      </Window>
      <Thread />
    </>
  );
};

export default ChannelInner;
