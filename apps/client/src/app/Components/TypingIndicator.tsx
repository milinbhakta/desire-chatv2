import { useChatContext, useTypingContext } from 'stream-chat-react';
import { StreamChatGenerics } from '../types';
import { Box } from '@mui/material';

export const TypingIndicator = () => {
  const { client } = useChatContext<StreamChatGenerics>();

  const { typing } = useTypingContext<StreamChatGenerics>();
  if (!client || !typing || !Object.values(typing).length) return null;

  const users = Object.values(typing)
    .filter(({ user }) => user?.id !== client.user?.id)
    .map(({ user }) => user?.name || user?.id);

  let text = '';

  if (users.length === 1) {
    text = `${users[0]} is typing`;
  } else if (users.length === 2) {
    text = `${users[0]} and ${users[1]} are typing`;
  } else if (users.length > 2) {
    text = `${users[0]} and ${users.length - 1} more are typing`;
  }

  return (
    <Box display="flex" alignItems="center">
      <Box
        width="10px"
        height="10px"
        borderRadius="50%"
        bgcolor="primary.main"
        mr={1}
      />
      {text && (
        <Box className="dots">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </Box>
      )}
      <div>{text}</div>
    </Box>
  );
};
