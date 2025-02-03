import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUser } from "@/lib/current-user-data";
import { redirect } from "next/navigation";
import InboxPage from "@/components/chat/inbox";
import { getAllConversations } from "@/lib/actions/realtime.actions";
import { ConversationInterface } from "@/types/types";
import { MessagesSquareIcon } from "lucide-react";

const Inbox = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const conversations: ConversationInterface[] | undefined =
    await getAllConversations(user?.id as string);

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
              <InboxPage conversations={conversations} userId={user?.id} />
            </div>
          </div>
        </Suspense>
      )}
    </>
  );
};
export default Inbox;
