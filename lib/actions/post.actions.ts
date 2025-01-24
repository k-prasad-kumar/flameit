"use server";

import { PostInterface } from "@/types/types";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { deleteImageCloudinary } from "./delete.image.actions";

const prisma = new PrismaClient().$extends(withAccelerate());

export const createPost = async (post: PostInterface) => {
  try {
    await prisma.post.create({
      data: {
        userId: post.userId as string,
        caption: post.caption as string,
        images: post.images,
      },
    });
    await prisma.user.update({
      where: {
        id: post.userId as string,
      },
      data: {
        postsCount: {
          increment: 1,
        },
      },
    });
    revalidatePath("/");
    return { success: "Post added successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const updatePostCaption = async (id: string, caption: string) => {
  try {
    await prisma.post.update({
      where: {
        id: id as string,
      },
      data: {
        caption: caption as string,
      },
    });
    return { success: "Post updated successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const updatePostLikes = async (
  userId: string,
  postId: string,
  type: string
) => {
  try {
    if (type === "add") {
      await prisma.like.create({
        data: {
          userId: userId as string,
          postId: postId as string,
        },
      });

      await prisma.post.update({
        where: {
          id: postId as string,
        },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      });
    }

    if (type === "remove") {
      await prisma.like.deleteMany({
        where: {
          postId: postId as string,
          userId: userId as string,
        },
      });
      await prisma.post.update({
        where: {
          id: postId as string,
        },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      });
    }

    revalidatePath("/");
    return { success: "Post updated successfully" };
  } catch (error) {
    console.log("error", error);
  }
};

export const addPostComment = async (
  comment: string,
  userId: string,
  postId: string
) => {
  try {
    await prisma.comment.create({
      data: {
        text: comment as string,
        userId: userId as string,
        postId: postId as string,
        parentId: null,
      },
    });

    await prisma.post.update({
      where: {
        id: postId as string,
      },
      data: {
        commentsCount: {
          increment: 1,
        },
      },
    });
    return { success: "Comment added successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const replayComment = async (
  replay: string,
  userId: string,
  postId: string,
  parentCommentId: string
) => {
  try {
    await prisma.comment.create({
      data: {
        text: replay as string,
        user: { connect: { id: userId } },
        parent: { connect: { id: parentCommentId } },
        post: { connect: { id: postId } },
      },
    });
    return { success: "Replay added successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = async (id: string, postId: string) => {
  try {
    await prisma.comment.deleteMany({
      where: {
        parentId: id, // Find all replies linked to the parent comment
      },
    });

    // Step 2: Delete the parent comment
    await prisma.comment.delete({
      where: {
        id: id, // Delete the parent comment
      },
    });

    await prisma.post.update({
      where: {
        id: postId as string,
      },
      data: {
        commentsCount: {
          decrement: 1,
        },
      },
    });

    return { success: "Comment deleted successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (
  id: string,
  images: { url: string; public_id: string }[]
) => {
  try {
    images?.map((image) => deleteImageCloudinary(image.public_id));
    await prisma.post.delete({
      where: {
        id: id as string,
      },
    });
    return { success: "Post deleted successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true,
              },
            },
          },
        },
        comments: {
          where: {
            parentId: null, // Fetch only top-level comments
          },
          orderBy: {
            createdAt: "desc", // Order comments by createdAt in descending order
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true, // Include user details for replies
                  },
                },
              },
              orderBy: {
                createdAt: "asc", // Order replies by creation time
              },
            },
          },

          // take: 5, // Optionally limit the number of comments per post
        },
        // taggedUsers: {
        //   select: {
        //     userId: true,
        //   },
        // },
        savedBy: true,
      },
      orderBy: {
        createdAt: "desc", // Sort by newest posts first
      },
      skip: 0, // Offset for pagination
      take: 10, // Number of posts to fetch per page
    });

    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const getPostById = async (id: string) => {
  try {
    const posts = await prisma.post.findFirst({
      where: { id: id as string },
      include: { user: true, comments: true },
    });

    return posts;
  } catch (error) {
    console.log(error);
  }
};
