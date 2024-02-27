import type { ThreadHeaderProps } from 'stream-chat-react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';

const MessagingThreadHeader = ({ closeThread, thread }: ThreadHeaderProps) => {
  const theme = useTheme();

  const getReplyCount = () => {
    if (!thread?.reply_count) return '';
    if (thread.reply_count === 1) return '1 reply';
    return `${thread.reply_count} Replies`;
  };

  return (
    <Box sx={{ background: theme.palette.background.default }}>
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
      <Divider variant="fullWidth" />
    </Box>
  );
};

export default MessagingThreadHeader;
