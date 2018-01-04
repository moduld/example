interface SilentPeriodsInterface {
  hour: number;
  minute: number;
}
interface UserSettingsInterface {
  notification_desktop: boolean;
  notification_preview: boolean;
  notification_sound: boolean;
  notification_volume: number;
  silent_period_state: boolean;
  silent_period_start: SilentPeriodsInterface;
  silent_period_stop: SilentPeriodsInterface;
}
interface CreateNewUserRequestBodyInterface {
  uuid?: string;
  id?: string;
  name: string;
  type: string;
  avatar?: string;
  business?: string;
  settings?: UserSettingsInterface;
}
interface CreateNewConversationRequestBodyInterface {
  name?: string;
  type: string;
  owner: string;
  participants?: UserInterface[];
}
interface ConversationInterface {
  uuid: string;
  name: string;
  type: string;
  participants: UserInterface[];
  last_message_time: string;
  new_messages_count: number;
}
interface UserStatusInterface {
  online: boolean;
  last_visit: number;
}
interface UserAvatarInterface {
  type: string;
  value: string;
}
interface UserInterface {
  uuid: string;
  name: string;
  type?: string;
  settings?: UserSettingsInterface;
  avatar?: UserAvatarInterface;
  status?: UserStatusInterface;
  ws_url?: string;
}
interface ConversationsListInterface {
  ws_url: string;
  user: UserInterface;
  settings?: UserSettingsInterface;
  status?: UserStatusInterface;
  collection: ConversationInterface[];
}
interface MessagesFilterInterface {
  timestamp: number;
  direction: string;
  limit: number;
}
interface MessagesInterface {
  uuid?: string;
  user?: UserInterface;
  body?: string;
  media?: null;
  reply_to?: null;
  forward_from?: null;
  edited?: true;
  deleted?: true;
  read?: boolean;
  mine?: boolean;
  sent_at?: number;
  created_at?: number;
  edited_index?: number;
  conversation?: string;
}
interface MessagesListInterface {
  conversation: string;
  collection: MessagesInterface[];
  filter: MessagesFilterInterface;
}
interface NewMessageRequestInterface {
  author: string;
  conversation: string;
  body?: string;
  reply_to?: string;
  media?: string[];
  message?: string;
}
interface ResolverInterface {
  messengerUser: UserInterface;
  monolithUser: BusinessInterface | ProfileInterface;
}
interface MediaFilesServiceOutput {
  file: File;
  type: string;
  name: string;
  progress?: number;
}
interface MediaServerUploadSuccessInterface {
  uuid?: string;
  id?: string;
  name?: string;
  description?: string;
  provider_name?: string;
  provider_status?: string;
  provider_reference?: string;
  provider_metadata?: MediaServerUploadSuccessProviderMetadataInterface;
  context?: string;
  updated_at?: Date;
  created_at?: Date;
  content_type?: string;
  sources?: MediaServerUploadSuccessSourcesInterface;
  tags?: string[];
}
interface MediaServerUploadSuccessProviderMetadataInterface {
  filename: string;
}
interface MediaServerUploadSuccessSourcesInterface {
  message_image_300?: MediaServerUploadSuccessReferenceInterface;
  message_image_500?: MediaServerUploadSuccessReferenceInterface;
  reference?: MediaServerUploadSuccessReferenceInterface;
}
interface MediaServerUploadSuccessReferenceInterface {
  format?: string;
  url?: string;
  alt?: string;
  title?: string;
  width?: string;
  height?: string;
}
interface SocketIncomeEventInterface {
  data: SocketIncomeEventDataInterface;
  action: string;
}
interface SocketIncomeEventDataInterface {
  uuid?: string;
  user?: UserInterface;
  body?: string;
  media?: null;
  reply_to?: null;
  forward_from?: null;
  edited?: true;
  deleted?: true;
  read?: boolean;
  mine?: boolean;
  sent_at?: number;
  created_at?: number;
  edited_index?: number;
  conversation?: string;
  conversation_uuid?: string;
  user_uuid?: string;
  online?: boolean;
  last_visit?: string;
  messages?: ReadStateObjectInterface[];
}
interface ReadStateObjectInterface {
  conversation: string;
  user_uuid: string;
  uuid: string;
}
interface MessageReadStateRequestInterface {
  user: string;
  messages: string[];
}
export {
  CreateNewUserRequestBodyInterface,
  CreateNewConversationRequestBodyInterface,
  ConversationInterface,
  UserInterface,
  ConversationsListInterface,
  MessagesFilterInterface,
  MessagesInterface,
  MessagesListInterface,
  NewMessageRequestInterface,
  ResolverInterface,
  MediaFilesServiceOutput,
  MediaServerUploadSuccessInterface,
  SocketIncomeEventInterface,
  MessageReadStateRequestInterface
};
