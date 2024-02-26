import React, { useEffect, useRef, useState } from 'react';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';

import { StreamChatGenerics } from '../types';
import { TypingIndicator } from './TypingIndicator';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Avatar, Box, Typography } from '@mui/material';

type Props = {
  theme: string;
  toggleMobile: () => void;
};

const MessagingChannelHeader = (props: Props) => {
  const { theme, toggleMobile } = props;
  const { client } = useChatContext<StreamChatGenerics>();
  const { channel } = useChannelStateContext<StreamChatGenerics>();
  const [channelName, setChannelName] = useState(channel.data?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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
    <form
      style={{ flex: 1 }}
      onSubmit={(event) => {
        event.preventDefault();
        inputRef?.current?.blur();
      }}
    >
      <input
        autoFocus
        className="channel-header__edit-input"
        onBlur={updateChannel}
        onChange={(event) => setChannelName(event.target.value)}
        placeholder="Type a new name for the chat"
        ref={inputRef}
        value={channelName}
      />
    </form>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <Box
        onClick={() => toggleMobile()}
        sx={{ padding: '0.5rem', cursor: 'pointer' }}
      >
        <MenuRoundedIcon />
      </Box>
      <Avatar>{channelName.charAt(0).toUpperCase()}</Avatar>
      {/* <AvatarGroup members={members} /> */}
      {!isEditing ? (
        <Typography variant="body1">{channelName || title}</Typography>
      ) : (
        <EditHeader />
      )}
      <Box>
        <TypingIndicator />
        {/* {channelName !== 'Social Demo' &&
          (!isEditing ? (
            <ChannelInfoIcon {...{ isEditing, setIsEditing }} />
          ) : (
            <ChannelSaveIcon />
          ))} */}
      </Box>
    </Box>
  );
};

export default React.memo(MessagingChannelHeader);
