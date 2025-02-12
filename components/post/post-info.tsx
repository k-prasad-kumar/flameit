"use client";

import Saved from "@/components/post/saved";
import { Comment, Like, savedBy } from "@/types/types";
import SharePost from "./share";
import dynamic from "next/dynamic";

const DynamicPostLike = dynamic(() => import("./post-like"));
const DynamicPostComment = dynamic(() => import("./post-comment"));

const PostInfo = ({
  likes,
  likesCount,
  comments,
  commentsCount,
  postId,
  image,
  postUserId,
  savedBy,
  userId,
  username,
  postUsername,
  postUserImage,
}: {
  likes: Like[];
  likesCount: number;
  comments: Comment[];
  commentsCount: number;
  postId: string;
  image: string;
  postUserId: string;
  savedBy: savedBy[];
  userId: string;
  username: string;
  postUsername: string;
  postUserImage: string;
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between my-2 px-3 md:px-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <DynamicPostLike
              postLikes={likes}
              likesCount={likesCount}
              postId={postId}
              postUserId={postUserId}
              username={username}
              userId={userId}
            />
          </div>
          <div className="flex items-center">
            <DynamicPostComment
              postCommentsCount={commentsCount}
              postComments={comments}
              postId={postId}
              postUserId={postUserId}
              username={username}
              userId={userId}
            />
          </div>
          <div className="flex items-center">
            <SharePost
              postId={postId}
              postUsername={postUsername}
              userId={userId}
              image={image}
              postUserImage={postUserImage}
            />
          </div>
        </div>
        <div className="cursor-pointer">
          <Saved userId={userId as string} postId={postId} savedBy={savedBy} />
        </div>
      </div>
      {likesCount === 0 && (
        <p className="text-sm opacity-80 px-3 md:px-0">
          Be the first one to like this
        </p>
      )}
    </div>
  );
};
export default PostInfo;
