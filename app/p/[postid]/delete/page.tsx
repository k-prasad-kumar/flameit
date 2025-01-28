import { getPostById } from "@/lib/actions/post.actions";
import NotFound from "@/app/not-found";
import { PostResponseInterface } from "@/types/types";
import { getCurrentUser } from "@/lib/current-user-data";
import { redirect } from "next/navigation";
import DeletePost from "@/components/post/delete-post";

const page = async ({ params }: { params: Promise<{ postid: string }> }) => {
  const id = (await params).postid;
  if (!id) return <NotFound />;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const post: (PostResponseInterface | undefined) | null = await getPostById(
    id
  );

  if (!post) return <NotFound />;

  return (
    <div className="w-full h-screen max-w-screen-sm mx-auto mt-14 md:mt-10">
      <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6 flex items-center justify-center h-full">
        <DeletePost
          postId={post?.id as string}
          username={post?.user?.username as string}
          userId={user?.id as string}
        />
      </div>
    </div>
  );
};
export default page;
