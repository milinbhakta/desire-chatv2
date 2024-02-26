import type { ThreadHeaderProps } from 'stream-chat-react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton, ListItem, ListItemText } from '@mui/material';

const MessagingThreadHeader = ({ closeThread, thread }: ThreadHeaderProps) => {
  const getReplyCount = () => {
    if (!thread?.reply_count) return '';
    if (thread.reply_count === 1) return '1 reply';
    return `${thread.reply_count} Replies`;
  };

  return (
    <ListItem
      secondaryAction={
        <IconButton onClick={closeThread}>
          <CloseRoundedIcon />
        </IconButton>
      }
    >
      <ListItemText
        primary={'Thread'}
        primaryTypographyProps={{ variant: 'h6' }}
        secondary={getReplyCount()}
      />
    </ListItem>
  );
};

export default MessagingThreadHeader;
