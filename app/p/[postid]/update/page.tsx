import { getPostById } from "@/lib/actions/post.actions";
import NotFound from "@/app/not-found";
import { PostResponseInterface } from "@/types/types";
import { getCurrentUser } from "@/lib/current-user-data";
import { redirect } from "next/navigation";
import UpdatePost from "@/components/post/update-post";

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
        <UpdatePost
          username={post?.user?.username as string}
          image={post?.user?.image as string}
          postId={post?.id as string}
          postImage={post?.images?.[0].url as string}
          caption={post?.caption as string}
        />
      </div>
    </div>
  );
};
export default page;
