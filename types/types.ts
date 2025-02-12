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
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPostsInterface {
  id: string;
  images: { url: string; public_id: string }[];
  likesCount: number;
  commentsCount: number;
}

export interface SavedInterface {
  id: string;
  post: {
    id: string;
    images: Image[];
  };
  createdAt: Date;
}

export interface TaggedInterface {
  id: string;
  post: {
    id: string;
    images: Image[];
  };
  createdAt: Date;
}

export interface PostFormInterface {
  userId: string;
  images: Image[];
  caption: string;
}

export interface PostResponseInterface {
  id: string;
  userId: string;
  images: Image[];
  caption: string | null;
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

export interface EditProfileInterface {
  name: string;
  username: string;
  bio: string;
  gender: string;
}

export interface ChangePasswordInterface {
  currentPassword: string;
  newPassword: string;
}

export interface FollowerInterface {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  follower: UserInfo;
}

export interface FollowingInterface {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  following: UserInfo;
}

export interface ConversationInterface {
  id: string;
  name: string | null;
  isGroup: boolean;
  groupImage: string | null;
  ownerId: string;
  participants: Participant[];
  lastMessage: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  messages: MessageInterface[];
}

export interface OneConversationInterface {
  id: string;
  name: string | null;
  isGroup: boolean;
  groupImage: string | null;
  ownerId: string;
  participants: Participant[];
  lastMessage: string | null;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type Participant = {
  userId: string;
  username: string;
  image: string | null;
};

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
  postId: string | null;
  image: string | null;
  imagePublicId: string | null;
  userImage: string | null;
  username: string | null;
};

export interface Reactions {
  userId: string;
  name: string;
  image: string | null;
  reaction: string;
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

export interface StroriesResponseInterface {
  id: string;
  userId: string;
  image: Image | null;
  text: string | null;
  expiresAt: Date;
  createdAt: Date;
  likes: StoryLike[];
  comments: StoryComment[];
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
