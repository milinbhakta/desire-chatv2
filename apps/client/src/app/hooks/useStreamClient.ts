// hook to create a stream client
import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';

function useStreamClient() {
  const [client, setClient] = useState<StreamChat>();

  useEffect(() => {
    const apiKey = import.meta.env.VITE_STREAM_API_KEY;
    const client = new StreamChat(apiKey);
    setClient(client);
  }, []);

  return client;
}

export default useStreamClient;
