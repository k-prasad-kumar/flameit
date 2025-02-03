import NotFound from "@/app/not-found";
import PostPage from "@/components/post/post-page";
import { getPostById } from "@/lib/actions/post.actions";
import { getCurrentUser } from "@/lib/current-user-data";
import { PostResponseInterface } from "@/types/types";
import { redirect } from "next/navigation";

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
    <div className="w-full max-w-screen-sm mx-auto mt-14 md:mt-10">
      <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6">
        <PostPage
          post={post!}
          userId={user?.id as string}
          username={user?.username as string}
        />
      </div>
    </div>
  );
};
export default page;
