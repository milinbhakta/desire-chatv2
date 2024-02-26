import type { SendButtonProps } from 'stream-chat-react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { IconButton } from '@mui/material';

const SendButton = ({ sendMessage, disabled }: SendButtonProps) => {
  return (
    <IconButton disabled={disabled} onClick={sendMessage} color="primary">
      <SendRoundedIcon />
    </IconButton>
  );
};

export default SendButton;
