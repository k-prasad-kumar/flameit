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
  followers: string[];
  following: string[];
  posts: PostResponseInterface[];
  saved: string[];
  tagged: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostInterface {
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
