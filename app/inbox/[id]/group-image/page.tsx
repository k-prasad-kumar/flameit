import NotFound from "@/app/not-found";
import GroupImage from "@/components/chat/group-image";
import { getConversation } from "@/lib/actions/chat.actions";
import { getCurrentUser } from "@/lib/current-user-data";
import { OneConversationInterface } from "@/types/types";
import { MoveLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const id = (await params).id;
  if (!id) return <NotFound />;

  const conversation: (OneConversationInterface | null) | undefined =
    await getConversation(id as string);

  if (!conversation) return <NotFound />;

  const image = {
    groupImage: conversation.groupImage as string,
    imagePublicId: conversation.imagePublicId as string,
  };
  return (
    <div className="w-full h-screen max-w-screen-sm mx-auto flex flex-col items-center justify-center">
      <GroupImage conversationId={conversation?.id} changeImage={image} />
      <Link
        href={`/inbox/${conversation?.id}`}
        className="my-4 flex gap-2 hover:bg-gray-200 dark:hover:bg-gray-800 px-4 py-2 rounded"
      >
        {" "}
        <MoveLeftIcon /> <span>Go back</span>
      </Link>
    </div>
  );
};
export default page;
