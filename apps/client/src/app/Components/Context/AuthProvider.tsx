import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Channel, StreamChat } from 'stream-chat';
import { useLocalStorage } from '../../hooks/useLocalStorage';

type AuthContext = {
  login: (user: User) => Promise<void>;
  user?: User;
  streamChat?: StreamChat;
  logout: () => Promise<void>;
  allUserChannels?: Channel[];
};

const context = React.createContext<AuthContext | null>(null);

export function useAuth() {
  return useContext(context) as AuthContext;
}

export function useLoggedInAuth() {
  return useContext(context) as AuthContext &
    Required<Pick<AuthContext, 'user'>>;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

type User = {
  id: string;
  name: string;
  image?: string;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage<User>('user');
  const [token, setToken] = useLocalStorage<string>('token');
  const [streamChat, setStreamChat] = useState<StreamChat>();

  const login = async (user: User) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/token`,
        { user_id: user.id }
      );
      setUser(user);
      setToken(response.data.token);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      streamChat?.disconnectUser();
      setUser(undefined);
      setToken(undefined);
      setStreamChat(undefined);
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  useEffect(() => {
    if (!token || !user) return;
    const chat = new StreamChat(import.meta.env.VITE_STREAM_API_KEY);

    if (chat.tokenManager.token === token && chat?.userID === user.id) return;
    let isInterrupted = false;
    const connectPromise = chat.connectUser(user, token).then(() => {
      if (isInterrupted) return;
      setStreamChat(chat);
    });

    return () => {
      isInterrupted = true;
      setStreamChat(undefined);
      connectPromise.then(() => chat.disconnectUser());
    };
  }, [user, token]);

  const authContextValue: AuthContext = {
    login,
    user,
    streamChat,
    logout,
  };

  return (
    <context.Provider value={authContextValue}>{children}</context.Provider>
  );
}
