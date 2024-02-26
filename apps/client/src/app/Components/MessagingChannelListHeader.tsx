import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

// import streamLogo from '../../assets/stream.png';
import { StreamChatGenerics } from '../types';
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

type Props = {
  onCreateChannel?: () => void;
};

const MessagingChannelListHeader = React.memo((props: Props) => {
  const { onCreateChannel } = props;

  const { client } = useChatContext<StreamChatGenerics>();

  const { id, image, name } = client.user || {};

  return (
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
  );
});

export default React.memo(MessagingChannelListHeader);
