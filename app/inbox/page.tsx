import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUser } from "@/lib/current-user-data";
import { redirect } from "next/navigation";
import InboxPage from "@/components/chat/inbox";
import { getAllConversations } from "@/lib/actions/realtime.actions";
import {
  ConversationForInboxInterface,
  FollowerInterface,
  FollowingInterface,
  UserInfo,
} from "@/types/types";
import { MessagesSquareIcon } from "lucide-react";
import { getFollowers, getFollowing } from "@/lib/actions/user.actions";

const Inbox = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // const conversations: ConversationInterface[] | undefined =
  //   await getAllConversations(user?.id as string);

  const conversations: ConversationForInboxInterface[] | undefined = (
    await getAllConversations(user?.id as string)
  )?.map((conversation) => ({
    ...conversation,
    messages: conversation.messages.map((message) => ({
      ...message,
      sender: {
        id: message.senderId,
        username: "", // fill in the username from the user data
        image: "", // fill in the image from the user data
      },
      // post: message?.post ? message?.post : null,
      // reactions: message.reactions,
      // parentMessage: message.parentMessage, // add this line
    })),
  }));

  const followers: FollowerInterface[] = await getFollowers(user?.id as string);
  const following: FollowingInterface[] = await getFollowing(
    user?.id as string
  );

  // Map the followers array to an array of UserInfo using the 'follower' field.
  const followerUsers: UserInfo[] = followers.map((f) => f.follower);

  // Map the following array to an array of UserInfo using the 'following' field.
  // If your getFollowing returns the same FollowerInterface as getFollowers, adjust the property name accordingly.
  const followingUsers: UserInfo[] = following.map((f) => f.following);

  // Combine the two arrays.
  const combinedUsers: UserInfo[] = [...followerUsers, ...followingUsers];

  // Remove duplicate users by using a Map keyed by user.id.
  const uniqueUsers: UserInfo[] = Array.from(
    new Map(combinedUsers.map((user) => [user.id, user])).values()
  );

  return (
    <>
      {conversations?.length === 0 && (
        <Suspense fallback={<Loading />}>
          <div className="w-full h-screen max-w-screen-sm mx-auto mt-14 md:mt-10">
            <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6 w-full h-full flex items-center justify-center">
              <div className="flex flex-col justify-center items-center">
                <div className="p-5 border-2 rounded-full mb-4">
                  <MessagesSquareIcon size={60} strokeWidth={1} />
                </div>
                <h1 className="text-2xl">No messages yet</h1>
                <p>Send a message to start a chat.</p>
              </div>
            </div>
          </div>
        </Suspense>
      )}

      {conversations && (
        <Suspense fallback={<Loading />}>
          <div className="w-full max-w-screen-sm mx-auto mt-14 md:mt-10">
            <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6">
              <InboxPage
                conversations={conversations}
                userId={user?.id}
                users={uniqueUsers}
              />
            </div>
          </div>
        </Suspense>
      )}
    </>
  );
};
export default Inbox;
