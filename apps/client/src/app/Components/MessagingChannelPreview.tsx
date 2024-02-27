import {
  ChannelPreviewUIComponentProps,
  ChatContextValue,
  useChatContext,
} from 'stream-chat-react';

import type { MouseEventHandler } from 'react';
import type { Channel, ChannelMemberResponse } from 'stream-chat';
import { StreamChatGenerics } from '../types';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { stringAvatar } from '../utils';

const getTimeStamp = (channel: Channel) => {
  let lastHours = channel.state.last_message_at?.getHours();
  let lastMinutes: string | number | undefined =
    channel.state.last_message_at?.getMinutes();
  let half = 'AM';

  if (lastHours === undefined || lastMinutes === undefined) {
    return '';
  }

  if (lastHours > 12) {
    lastHours = lastHours - 12;
    half = 'PM';
  }

  if (lastHours === 0) lastHours = 12;
  if (lastHours === 12) half = 'PM';

  if (lastMinutes.toString().length === 1) {
    lastMinutes = `0${lastMinutes}`;
  }

  return `${lastHours}:${lastMinutes} ${half}`;
};

const getChannelName = (members: ChannelMemberResponse[]) => {
  const defaultName = 'Johnny Blaze';

  if (!members.length || members.length === 1) {
    return members[0]?.user?.name || defaultName;
  }

  return `${members[0]?.user?.name || defaultName}, ${
    members[1]?.user?.name || defaultName
  }`;
};

type MessagingChannelPreviewProps = ChannelPreviewUIComponentProps & {
  channel: Channel;
  onClick: MouseEventHandler;
  setActiveChannel?: ChatContextValue['setActiveChannel'];
};

const MessagingChannelPreview = (props: MessagingChannelPreviewProps) => {
  const { channel, setActiveChannel, onClick } = props;
  const { channel: activeChannel, client } =
    useChatContext<StreamChatGenerics>();

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user?.id !== client.userID
  );

  const renderMessageText = () => {
    const lastMessageText =
      channel.state.messages[channel.state.messages.length - 1]?.text;

    const text = lastMessageText || 'message text';

    return text.length < 60 ? lastMessageText : `${text.slice(0, 70)}...`;
  };

  return (
    <Box>
      <ListItemButton
        selected={activeChannel?.id === channel.id}
        onClick={(e) => {
          onClick(e);
          setActiveChannel?.(channel);
        }}
        dense
      >
        <ListItemAvatar>
          <Avatar
            {...stringAvatar(
              channel.data && channel.data.name ? channel.data.name : 'No Name'
            )}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {channel.data?.name || getChannelName(members)}
              </Typography>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="caption"
                color="text.primary"
              >
                {getTimeStamp(channel)}
              </Typography>
            </Box>
          }
          secondary={renderMessageText() || 'No messages yet'}
        />
      </ListItemButton>
    </Box>
  );
};

export default MessagingChannelPreview;
