import type { SendButtonProps } from 'stream-chat-react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

const SendButton = ({ sendMessage, ...rest }: SendButtonProps) => (
  <button
    className="str-chat__send-button"
    onClick={sendMessage}
    type="button"
    {...rest}
  >
    <SendRoundedIcon />
  </button>
);

export default SendButton;
