import React, { useEffect, useMemo } from 'react';

import type { Event } from 'stream-chat';
import { useDropzone } from 'react-dropzone';
import { nanoid } from 'nanoid';
import {
  DefaultStreamChatGenerics,
  QuotedMessagePreviewHeader,
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
  useComponentContext,
  useMessageInputContext,
  useTranslationContext,
  QuotedMessagePreview as DefaultQuotedMessagePreview,
  AttachmentPreviewList as DefaultAttachmentPreviewList,
  LinkPreviewList as DefaultLinkPreviewList,
  CooldownTimer as DefaultCooldownTimer,
} from 'stream-chat-react';

import SendButton from './SendButton';
import { Box, Button, TextField, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 0.5,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 0.5,
});

export const MessageInputCustom = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>() => {
  const { quotedMessage } =
    useChannelStateContext<StreamChatGenerics>('MessageInputFlat');
  const { setQuotedMessage } = useChannelActionContext('MessageInputFlat');
  const { channel } = useChatContext<StreamChatGenerics>('MessageInputFlat');

  useEffect(() => {
    const handleQuotedMessageUpdate = (e: Event<StreamChatGenerics>) => {
      if (e.message?.id !== quotedMessage?.id) return;
      if (e.type === 'message.deleted') {
        setQuotedMessage(undefined);
        return;
      }
      setQuotedMessage(e.message);
    };
    channel?.on('message.deleted', handleQuotedMessageUpdate);
    channel?.on('message.updated', handleQuotedMessageUpdate);

    return () => {
      channel?.off('message.deleted', handleQuotedMessageUpdate);
      channel?.off('message.updated', handleQuotedMessageUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, quotedMessage]);

  return <MessageInputV2<StreamChatGenerics> />;
};

const MessageInputV2 = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>() => {
  const {
    acceptedFiles = [],
    multipleUploads,
    quotedMessage,
  } = useChannelStateContext<StreamChatGenerics>('MessageInputV2');

  const { t } = useTranslationContext('MessageInputV2');

  const {
    cooldownRemaining,
    findAndEnqueueURLsToEnrich,
    handleSubmit,
    hideSendButton,
    isUploadEnabled,
    linkPreviews,
    maxFilesLeft,
    message,
    numberOfUploads,
    setCooldownRemaining,
    text,
    setText,
    uploadNewFiles,
  } = useMessageInputContext<StreamChatGenerics>('MessageInputV2');

  const {
    AttachmentPreviewList = DefaultAttachmentPreviewList,
    CooldownTimer = DefaultCooldownTimer,
    LinkPreviewList = DefaultLinkPreviewList,
    EmojiPicker,
    QuotedMessagePreview = DefaultQuotedMessagePreview,
  } = useComponentContext<StreamChatGenerics>('MessageInputV2');

  const id = useMemo(() => nanoid(), []);

  const accept = useMemo(
    () =>
      acceptedFiles.reduce<Record<string, Array<string>>>(
        (mediaTypeMap, mediaType) => {
          mediaTypeMap[mediaType] ??= [];
          return mediaTypeMap;
        },
        {}
      ),
    [acceptedFiles]
  );

  const { isDragActive, isDragReject } = useDropzone({
    accept,
    disabled: !isUploadEnabled || maxFilesLeft === 0,
    multiple: multipleUploads,
    noClick: true,
    onDrop: uploadNewFiles,
  });

  // TODO: "!message" condition is a temporary fix for shared
  // state when editing a message (fix shared state issue)
  const displayQuotedMessage =
    !message && quotedMessage && !quotedMessage.parent_id;

  return (
    <Box>
      {findAndEnqueueURLsToEnrich && (
        <LinkPreviewList linkPreviews={Array.from(linkPreviews.values())} />
      )}
      {isDragActive && (
        <Box>
          {!isDragReject && <p>{t<string>('Drag your files here')}</p>}
          {isDragReject && (
            <p>{t<string>('Some of the files will not be accepted')}</p>
          )}
        </Box>
      )}

      {displayQuotedMessage && <QuotedMessagePreviewHeader />}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Button
          component="button"
          role={undefined}
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          disabled={!isUploadEnabled || maxFilesLeft === 0}
        >
          <VisuallyHiddenInput
            type="file"
            accept={acceptedFiles?.join(',')}
            aria-label="aria/file upload"
            id={id}
            multiple={multipleUploads}
            onChange={(e) => e.target.files && uploadNewFiles(e.target.files)}
          />
        </Button>
        <Box sx={{ flexGrow: 7 }}>
          {displayQuotedMessage && (
            <QuotedMessagePreview quotedMessage={quotedMessage} />
          )}
          {isUploadEnabled && !!numberOfUploads && <AttachmentPreviewList />}

          <Box>
            <TextField
              aria-label="Type a message"
              focused
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                  setText('');
                }
              }}
              onChange={(e) => setText(e.target.value)}
              value={text}
              placeholder={t<string>('Type a message')}
              fullWidth
            />
            {EmojiPicker && <EmojiPicker />}
          </Box>
        </Box>
        {!hideSendButton && (
          <Box>
            {cooldownRemaining ? (
              <CooldownTimer
                cooldownInterval={cooldownRemaining}
                setCooldownRemaining={setCooldownRemaining}
              />
            ) : (
              <SendButton
                disabled={!numberOfUploads && !text.length}
                sendMessage={handleSubmit}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
