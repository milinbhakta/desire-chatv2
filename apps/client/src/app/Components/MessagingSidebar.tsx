import type { MouseEventHandler } from 'react';
import { ChannelList, ChannelListProps } from 'stream-chat-react';

import MessagingChannelListHeader from './MessagingChannelListHeader';
import MessagingChannelPreview from './MessagingChannelPreview';
import { Box } from '@mui/material';

type MessagingSidebarProps = {
  channelListOptions: {
    filters: ChannelListProps['filters'];
    sort: ChannelListProps['sort'];
    options: ChannelListProps['options'];
  };
  onClick: MouseEventHandler;
  onCreateChannel: () => void;
  onPreviewSelect: MouseEventHandler;
};

const MessagingSidebar = ({
  channelListOptions,
  onClick,
  onCreateChannel,
  onPreviewSelect,
}: MessagingSidebarProps) => {
  return (
    <Box>
      <MessagingChannelListHeader onCreateChannel={onCreateChannel} />
      <ChannelList
        {...channelListOptions}
        Preview={(props: any) => (
          <MessagingChannelPreview {...props} onClick={onPreviewSelect} />
        )}
      />
    </Box>
  );
};

export default MessagingSidebar;
