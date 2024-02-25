/* eslint-disable @typescript-eslint/ban-types */
import type { LiteralStringForUnion } from 'stream-chat';

export type User = {
  id: string;
  name: string;
  image: string;
};

export type AttachmentType = {};
export type ChannelType = { demo?: string };
export type CommandType = LiteralStringForUnion;
export type EventType = {};
export type MessageType = {};
export type ReactionType = {};
export type UserType = { image?: string };

export type StreamChatGenerics = {
  attachmentType: AttachmentType;
  channelType: ChannelType;
  commandType: CommandType;
  eventType: EventType;
  messageType: MessageType;
  reactionType: ReactionType;
  userType: UserType;
};
