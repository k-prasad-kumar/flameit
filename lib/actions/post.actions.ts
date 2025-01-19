// "use server";

// import { revalidatePath } from "next/cache";
// import { Post } from "../models/post.model";
// import { PhotoMeta, PostsInterface } from "@/types/types";

// export const createPost = async (images: PhotoMeta[], caption: string) => {
//   try {
//     const user = await currentUser();
//     const userId = user?.id as string;
//     const username = user?.username as string;
//     const userImage = user?.imageUrl as string;

//     await Post.create({
//       userId: userId,
//       username: username,
//       userImage: userImage,
//       images: images,
//       caption: caption,
//       likes: [],
//       comments: [],
//     });

//     revalidatePath("/");
//     return { success: username };
//   } catch (error) {
//     console.log(error);
//     return {
//       error: "Something went wrong!",
//     };
//   }
// };

// export const getPosts = async () => {
//   try {
//     const posts: PostsInterface[] = await Post.find({})
//       .sort({ createdAt: -1 })
//       .populate("userId");
//     return posts;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const updatePostLikes = async (postId: string, likes: string[]) => {
//   try {
//     await Post.findByIdAndUpdate(postId, { likes });
//     revalidatePath("/");
//   } catch (error) {
//     console.log(error);
//   }
// };
