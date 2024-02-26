import type { ThreadHeaderProps } from 'stream-chat-react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const MessagingThreadHeader = ({ closeThread, thread }: ThreadHeaderProps) => {
  const getReplyCount = () => {
    if (!thread?.reply_count) return '';
    if (thread.reply_count === 1) return '1 reply';
    return `${thread.reply_count} Replies`;
  };

  return (
    <div>
      <div>
        <p>Thread</p>
        <p>{getReplyCount()}</p>
      </div>
      <CloseRoundedIcon onClick={closeThread} />
    </div>
  );
};

export default MessagingThreadHeader;
