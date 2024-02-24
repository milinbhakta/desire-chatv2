import axios, { AxiosResponse } from 'axios';
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { StreamChat } from 'stream-chat';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { User } from '../../types';
import useStreamClient from '../../hooks/useStreamClient';

// Define all info needed for an authed state
type AuthContext = {
  // data in response, error, value to passed into actual function
  user?: User;
  streamChat?: StreamChat;
  login: (user: User) => any;
  logout: () => void;
};

const Context = createContext<AuthContext | null>(null);

// For other files to retrieve auth info
export function useAuth() {
  return useContext(Context) as AuthContext;
}

// For other files to retrieve auth info assuming users have logged in
export function useLoggedInAuth() {
  return useContext(Context) as AuthContext &
    Required<Pick<AuthContext, 'user'>>;
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const chat = useStreamClient();

  // Store logged in user and their token in local storage so they will
  // be logged in automatically upon refresh
  const [user, setUser] = useLocalStorage<User>('user');
  const [token, setToken] = useLocalStorage<string>('token');
  const [streamChat, setStreamChat] = useState<StreamChat>();

  // Log in user
  const login = async (user: User) => {
    // get token from server
    await axios
      .post(`${import.meta.env.VITE_SERVER_URL}/token`, { user_id: user.id })
      .then((res: AxiosResponse<{ token: string }>) => {
        // store user and token in local storage
        setUser(user);
        setToken(res.data.token);
      });

    return user;
  };

  // Log out user
  const logout = () => {
    // clear user and token from local storage
    setUser(undefined);
    setToken(undefined);
  };

  useEffect(() => {
    // do nothing if user invalid
    if (token == null || user == null) return;

    //  chat is already connected
    if (chat === undefined) return;

    // don't login the same user again
    if (chat.tokenManager.token === token && chat.userID === user.id) {
      return;
    }

    let isInterrupted = false;
    // try connect user
    const connectPromise = chat.connectUser(user, token).then(() => {
      if (isInterrupted) return;
      setStreamChat(chat);
    });

    return () => {
      // change interrupted state if we somehow call this again
      isInterrupted = true;
      // will clear chat and disconnect if login again
      setStreamChat(undefined);
      connectPromise.then(() => {
        chat.disconnectUser();
      });
    };
  }, [chat, token, user]);
  return (
    <Context.Provider
      value={{
        user,
        streamChat,
        login,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
}
