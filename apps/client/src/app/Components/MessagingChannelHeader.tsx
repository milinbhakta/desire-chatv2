import React, { useEffect, useRef, useState } from 'react';
import {
  TypingIndicator,
  useChannelStateContext,
  useChatContext,
} from 'stream-chat-react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import { StreamChatGenerics } from '../types';

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  useTheme,
} from '@mui/material';

const MessagingChannelHeader = () => {
  const { client } = useChatContext<StreamChatGenerics>();
  const { channel } = useChannelStateContext<StreamChatGenerics>();
  const [channelName, setChannelName] = useState(channel.data?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const members = Object.values(channel.state.members || {}).filter(
    (member) => member.user?.id !== client?.user?.id
  );

  const updateChannel = async () => {
    if (channelName && channelName !== channel.data?.name) {
      await channel.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` }
      );
    }

    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef?.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!channelName) {
      setTitle(
        members
          .map(
            (member) => member.user?.name || member.user?.id || 'Unnamed User'
          )
          .join(', ')
      );
    }
  }, [channelName, members]);

  const EditHeader = () => (
    <Box
      component="form"
      sx={{ flex: 1 }}
      onSubmit={(event) => {
        event.preventDefault();
        inputRef?.current?.blur();
      }}
    >
      <TextField
        autoFocus
        className="channel-header__edit-input"
        onBlur={updateChannel}
        onChange={(event) => setChannelName(event.target.value)}
        placeholder="Type a new name for the chat"
        inputRef={inputRef}
        value={channelName}
        fullWidth
        variant="outlined"
      />
    </Box>
  );

  return (
    <Box
      sx={{
        paddingLeft: 2,
        background: theme.palette.background.default,
      }}
    >
      <ListItem
        secondaryAction={
          <Box>
            {channelName !== 'Social Demo' &&
              (!isEditing ? (
                <IconButton
                  onClick={() => {
                    if (!isEditing) {
                      setIsEditing(true);
                    }
                  }}
                >
                  <EditRoundedIcon />
                </IconButton>
              ) : (
                <CheckCircleRoundedIcon />
              ))}
          </Box>
        }
      >
        <ListItemAvatar>
          <Avatar
            alt={`${
              members.length > 0 ? members[0].user?.name : channelName || title
            }`}
            src={`${
              members.length > 0 ? members[0].user?.image : channelName || title
            }`}
          />
        </ListItemAvatar>
        <ListItemText
          primary={channelName || title}
          primaryTypographyProps={{ variant: 'h6' }}
        />
      </ListItem>
      {!isEditing ? null : <EditHeader />}
      <Box>
        <TypingIndicator />
      </Box>
      <Divider variant="fullWidth" />
    </Box>
  );
};

export default React.memo(MessagingChannelHeader);
