import { Suspense } from "react";
import Loading from "./loading";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user-data";
import ChatPage from "@/components/chat/chat";
import { getConversation } from "@/lib/actions/realtime.actions";
import NotFound from "@/app/not-found";
import { OneConversationInterface } from "@/types/types";

const Chat = async ({ params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const id = (await params).id;
  if (!id) return <NotFound />;

  const conversation: (OneConversationInterface | null) | undefined =
    await getConversation(id as string);

  if (!conversation) return <NotFound />;

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full h-screen max-w-screen-sm mx-auto">
        <ChatPage conversation={conversation} userId={user?.id} />
      </div>
    </Suspense>
  );
};
export default Chat;
