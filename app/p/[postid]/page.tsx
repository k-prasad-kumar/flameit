import PostPage from "@/components/post/post-page";
import { getPostById } from "@/lib/actions/post.actions";
import { getCurrentUser } from "@/lib/current-user-data";
import { PostResponseInterface } from "@/types/types";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { postid: string } }) => {
  const id = params.postid;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userInfo = {
    userId: user?.id as string,
    username: user?.username as string,
    image: user?.image as string,
  };
  const post: (PostResponseInterface | undefined) | null = await getPostById(
    id
  );
  return (
    <div className="w-full max-w-screen-sm mx-auto mt-14 md:mt-10">
      <div className="px-0 md:px-4 lg:px-14 pt-0 md:pt-6">
        <PostPage post={post!} user={userInfo} saved={user?.saved} />
      </div>
    </div>
  );
};
export default page;
