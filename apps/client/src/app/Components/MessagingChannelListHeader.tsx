import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

// import streamLogo from '../../assets/stream.png';
import { StreamChatGenerics } from '../types';
import {
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
} from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

type Props = {
  onCreateChannel?: () => void;
};

const MessagingChannelListHeader = React.memo((props: Props) => {
  const { onCreateChannel } = props;

  const theme = useTheme();

  const { client } = useChatContext<StreamChatGenerics>();

  const { id, image, name } = client.user || {};

  return (
    <Box sx={{ background: theme.palette.background.default }}>
      <ListItem
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="createChannel"
            onClick={onCreateChannel}
          >
            <AddCircleRoundedIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar image={image} name={name} />
        </ListItemAvatar>
        <ListItemText
          primary={name || id}
          primaryTypographyProps={{ variant: 'h6' }}
        />
      </ListItem>
      <Divider variant="fullWidth" />
    </Box>
  );
});

export default React.memo(MessagingChannelListHeader);
