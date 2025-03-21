export interface RegisterInterface {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}

/// from here need to modify - top ones are correct

export interface UserInterface {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  password: string | null;
  image: string | null;
  emailVerified: Date | null;
  bio: string | null;
  gender: string | null;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileInterface {
  id: string;
  name: string | null;
  email: string | null;
  username: string | null;
  password: string | null;
  image: string | null;
  imagePublicId: string | null;
  emailVerified: Date | null;
  bio: string | null;
  gender: string | null;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPostsInterface {
  id: string;
  image: { url: string; public_id: string };
  likesCount: number;
  commentsCount: number;
}

export interface SavedInterface {
  id: string;
  post: {
    id: string;
    image: Image;
  };
  createdAt: Date;
}

export interface TaggedInterface {
  id: string;
  post: {
    id: string;
    image: Image;
  };
  createdAt: Date;
}

export interface PostFormInterface {
  userId: string;
  image: Image;
  caption: string;
}

export interface PostResponseInterface {
  id: string;
  userId: string;
  image: Image;
  caption: string | null;
  isLikesCountHide: boolean;
  isCommentsOff: boolean;
  likesCount: number;
  commentsCount: number;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  likes: Like[];
  comments: Comment[];
  savedBy: savedBy[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
  user: UserInfo;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserInfo;
  replies: Replay[];
}

export interface Replay {
  id: string;
  text: string;
  createdAt: Date;
  user: UserInfo;
}

export interface savedBy {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
}

export interface UserInfo {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
}

type Image = {
  url: string;
  public_id: string;
};

export interface ChangeImageInterface {
  image: string;
  imagePublicId: string;
}

export interface GroupImageInterface {
  groupImage: string | null;
  imagePublicId: string | null;
}

export interface EditProfileInterface {
  name: string;
  username: string;
  bio: string;
  gender: string;
  isPrivate: boolean;
}

export interface ChangePasswordInterface {
  currentPassword: string;
  newPassword: string;
}

export interface FollowerInterface {
  id: string;
  followerId: string;
  followingId: string;
  isAccepted: boolean;
  createdAt: Date;
  follower: UserInfo;
}

export interface FollowingInterface {
  id: string;
  followerId: string;
  followingId: string;
  isAccepted: boolean;
  createdAt: Date;
  following: UserInfo;
}

export interface ConversationInterface {
  id: string;
  name: string | null;
  isGroup: boolean;
  groupImage: string | null;
  imagePublicId: string | null;
  ownerId: string;
  participants: Participant[];
  lastMessage: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  messages: MessageInterface[];
}

export interface ConversationForInboxInterface {
  id: string;
  name: string | null;
  isGroup: boolean;
  groupImage: string | null;
  imagePublicId: string | null;
  ownerId: string;
  participants: Participant[];
  lastMessage: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  messages: MessageForInboxInterface[];
}

export interface OneConversationInterface {
  id: string;
  name: string | null;
  isGroup: boolean;
  groupImage: string | null;
  imagePublicId: string | null;
  ownerId: string;
  participants: Participant[];
  lastMessage: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type Participant = {
  id: string;
  userId: string;
  conversationId: string;
  user: UserInfo;
};

export interface MessageForInboxInterface {
  id: string;
  conversationId: string;
  senderId: string;
  text: string | null;
  seenBy: string[];
  createdAt: Date;
}

export interface MessageInterface {
  id: string;
  conversationId: string;
  senderId: string;
  text: string | null;
  post: MessagePost | null;
  seenBy: string[];
  createdAt: Date;
  reactions: Reactions[];
  sender: Sender;
  parentMessage: MessageInterface | null;
}

type MessagePost = {
  id: string;
  postUserId: string | null;
  messageId: string;
  postId: string | null;
  image: string;
  imagePublicId: string | null;
  postUser: UserInfo;
};

export interface Reactions {
  id: string;
  userId: string;
  reaction: string;
  user: UserInfo;
}

type Sender = {
  id: string;
  username: string | null;
  image: string | null;
};

export interface NotificationFormInterface {
  userId: string;
  recipientId: string;
  postImage?: string | null;
  postId?: string | null;
  text: string;
  isSeen: boolean;
  type: string;
}

export interface NotificationInterface {
  id: string;
  userId: string;
  recipientId: string;
  postImage?: string | null;
  postId?: string | null;
  text: string;
  isSeen: boolean;
  type: string;
  expiresAt: Date;
  createdAt: Date;
  user: UserInfo;
}
export interface NotificationsInterface {
  id: string;
  userId: string;
  recipientId: string;
  postImage?: string | null;
  postId?: string | null;
  text: string;
  isSeen: boolean;
  type: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface StroriesInterface {
  userId: string;
  image: Image | null;
  text: string | null;
}

export interface StoriesResponseInterface {
  id: string;
  userId: string;
  image: Image | null;
  text: string | null;
  expiresAt: Date;
  createdAt: Date;
  likes: StoryLike[];
  comments: StoryComment[];
  seenBy: StorySeenByInterface[];
  user: UserInfo;
}

export interface StorySeenByInterface {
  id: string;
  userId: string;
  storyId: string;
  createdAt: Date;
  user: UserInfo;
}

export interface StoryLike {
  id: string;
  userId: string;
  storyId: string;
  createdAt: Date;
  user: UserInfo;
}

export interface StoryComment {
  id: string;
  text: string;
  userId: string;
  storyId: string;
  createdAt: Date;
  user: UserInfo;
}

export interface StoryUserInfoInterface {
  user: UserInfo;
}
