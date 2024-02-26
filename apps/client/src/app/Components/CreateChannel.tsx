import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import type { UserResponse } from 'stream-chat';
import _debounce from 'lodash.debounce';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { StreamChatGenerics } from '../types';
import {
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
  styled,
} from '@mui/material';

type Props = {
  onClose: () => void;
};

const CreateChannel = (props: Props) => {
  const { onClose } = props;

  const { client, setActiveChannel } = useChatContext<StreamChatGenerics>();

  const [focusedUser, setFocusedUser] = useState<number>();
  const [inputText, setInputText] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const [searchEmpty, setSearchEmpty] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<
    UserResponse<StreamChatGenerics>[]
  >([]);
  const [users, setUsers] = useState<UserResponse<StreamChatGenerics>[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const clearState = () => {
    setInputText('');
    setResultsOpen(false);
    setSearchEmpty(false);
  };

  useEffect(() => {
    const clickListener = () => {
      if (resultsOpen) clearState();
    };

    document.addEventListener('click', clickListener);

    return () => document.removeEventListener('click', clickListener);
  }, [resultsOpen]);

  const findUsers = async () => {
    if (searching) return;
    setSearching(true);

    try {
      const response = await client.queryUsers(
        {
          id: { $ne: client.userID as string },
          $and: [{ name: { $autocomplete: inputText } }],
        },
        { id: 1 },
        { limit: 6 }
      );

      if (!response.users.length) {
        setSearchEmpty(true);
      } else {
        setSearchEmpty(false);
        setUsers(response.users);
      }

      setResultsOpen(true);
    } catch (error) {
      console.log({ error });
    }

    setSearching(false);
  };

  const findUsersDebounce = _debounce(findUsers, 100, {
    trailing: true,
  });

  useEffect(() => {
    if (inputText) {
      findUsersDebounce();
    }
  }, [inputText]); // eslint-disable-line react-hooks/exhaustive-deps

  const createChannel = async () => {
    const selectedUsersIds = selectedUsers.map((u) => u.id);

    if (!selectedUsersIds.length || !client.userID) return;

    const conversation = client.channel('messaging', {
      members: [...selectedUsersIds, client.userID],
    });

    await conversation.watch();

    setActiveChannel?.(conversation);
    setSelectedUsers([]);
    setUsers([]);
    onClose();
  };

  const addUser = (addedUser: UserResponse<StreamChatGenerics>) => {
    const isAlreadyAdded = selectedUsers.find(
      (user) => user.id === addedUser.id
    );
    if (isAlreadyAdded) return;

    setSelectedUsers([...selectedUsers, addedUser]);
    setResultsOpen(false);
    setInputText('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeUser = (user: UserResponse<StreamChatGenerics>) => {
    const newUsers = selectedUsers.filter((item) => item.id !== user.id);
    setSelectedUsers(newUsers);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // check for up(ArrowUp) or down(ArrowDown) key
      if (event.key === 'ArrowUp') {
        setFocusedUser((prevFocused) => {
          if (prevFocused === undefined) return 0;
          return prevFocused === 0 ? users.length - 1 : prevFocused - 1;
        });
      }
      if (event.key === 'ArrowDown') {
        setFocusedUser((prevFocused) => {
          if (prevFocused === undefined) return 0;
          return prevFocused === users.length - 1 ? 0 : prevFocused + 1;
        });
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        if (focusedUser !== undefined) {
          addUser(users[focusedUser]);
          return setFocusedUser(undefined);
        }
      }
    },
    [users, focusedUser] // eslint-disable-line
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">To:</Typography>
        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      {!!selectedUsers?.length && (
        <List>
          {selectedUsers.map((user) => (
            <ListItem
              key={user.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => removeUser(user)}>
                  <CloseRoundedIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar image={user.image} name={user.name} />
              </ListItemAvatar>
              <ListItemText primary={user.name} />
            </ListItem>
          ))}
        </List>
      )}
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
        <TextField
          fullWidth
          autoFocus
          inputRef={inputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            !selectedUsers.length ? 'Start typing for suggestions' : ''
          }
        />
      </Box>
      <Button
        sx={{ mt: 2 }}
        variant="outlined"
        startIcon={<AddBoxRoundedIcon />}
        onClick={createChannel}
      >
        Create
      </Button>
      {inputText && (
        <Box component="main" sx={{ mt: 2 }}>
          <List>
            {!!users?.length &&
              !searchEmpty &&
              users.map((user, i) => (
                <ListItemButton
                  key={user.id}
                  selected={focusedUser === i}
                  onClick={() => addUser(user)}
                >
                  <ListItemAvatar>
                    {user.online ? (
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        variant="dot"
                      >
                        <Avatar name={user.name} image={user.image} />
                      </StyledBadge>
                    ) : (
                      <Avatar name={user.name} image={user.image} />
                    )}
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                </ListItemButton>
              ))}
            {searchEmpty && (
              <ListItemButton
                onClick={() => {
                  inputRef.current?.focus();
                  clearState();
                }}
              >
                <ListItemText primary="No people found..." />
              </ListItemButton>
            )}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(CreateChannel);
