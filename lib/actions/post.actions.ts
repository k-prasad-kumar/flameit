"use server";

import { Like, PostFormInterface } from "@/types/types";
import { revalidatePath } from "next/cache";
import { deleteImageCloudinary } from "./delete.image.actions";
import { prisma } from "@/lib/prisma";
import { createNotification, deleteNotification } from "./notification.actions";

export const createPost = async (post: PostFormInterface) => {
  try {
    const postOwnerFollowers = await prisma.follower.findMany({
      where: {
        followingId: post?.userId as string,
      },
      include: {
        follower: {
          select: {
            id: true,
          },
        }, // Include details about the follower
      },
    });

    const newPost = await prisma.post.create({
      data: {
        userId: post.userId as string,
        caption: post.caption as string,
        images: post.images,
      },
    });

    if (postOwnerFollowers.length > 0) {
      postOwnerFollowers.forEach(async (follower) => {
        const data = {
          userId: post?.userId as string,
          recipientId: follower?.follower.id as string,
          postId: newPost?.id as string,
          postImage: newPost?.images[0].url as string,
          text: "shared a post.",
          isSeen: false,
          type: "POST",
        };
        await createNotification(data);
      });
    }

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

export const updatePost = async (id: string, caption: string) => {
  try {
    await prisma.post.update({
      where: {
        id: id as string,
      },
      data: {
        caption: caption as string,
      },
    });
    revalidatePath(`/p/${id}`);
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
    let likes: Like[] | null = [];

    if (type === "add") {
      await prisma.like.create({
        data: {
          userId: userId as string,
          postId: postId as string,
        },
      });

      likes = await prisma.like.findMany({
        where: {
          postId: postId as string,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      });

      const newPost = await prisma.post.findUnique({
        where: {
          id: postId as string,
        },
      });

      if (userId !== newPost?.userId) {
        const data = {
          userId: userId as string,
          recipientId: newPost?.userId as string,
          postId: newPost?.id as string,
          postImage: newPost?.images[0].url as string,
          text: "liked your post.",
          isSeen: false,
          type: "LIKE",
        };
        await createNotification(data);
      }

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

      likes = await prisma.like.findMany({
        where: {
          postId: postId as string,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      });

      const newPost = await prisma.post.findUnique({
        where: {
          id: postId as string,
        },
      });

      if (userId !== newPost?.userId) {
        await deleteNotification(
          userId as string,
          newPost?.userId as string,
          "LIKE",
          newPost?.id as string
        );
      }

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
    return likes;
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

    // create notification for post owner
    const post = await getPostById(postId as string);

    if (userId !== post?.userId) {
      const data = {
        userId: userId as string,
        recipientId: post?.userId as string,
        postId: post?.id as string,
        postImage: post?.images[0].url as string,
        text: "commented on your post.",
        isSeen: false,
        type: "COMMENT",
      };
      await createNotification(data);
    }

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

    // create notification for post owner
    const post = await getPostById(postId as string);
    const comment = await prisma.comment.findUnique({
      where: { id: parentCommentId },
    });
    console.log("parent comment text ---", comment?.text);
    if (userId !== comment?.userId) {
      const data = {
        userId: userId as string,
        recipientId: comment?.userId as string,
        postId: post?.id as string,
        postImage: post?.images[0].url as string,
        text: "replied on your comment.",
        isSeen: false,
        type: "COMMENT",
      };
      await createNotification(data);
    }

    return {
      success: "Replay added successfully",
      commentUserId: comment?.userId,
    };
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = async (id: string, postId: string) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: id as string,
      },
      include: {
        post: {
          select: {
            userId: true,
          },
        },
      },
    });

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

    if (comment?.userId !== comment?.post?.userId) {
      // delete notification aswell
      await deleteNotification(
        comment?.userId as string,
        comment?.post?.userId as string,
        "COMMENT",
        comment?.postId as string
      );
    }

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

export const deletePost = async (id: string, userId: string) => {
  try {
    // delete images from cloudinary before deleting post
    const post = await prisma.post.findUnique({
      where: {
        id: id as string,
      },
      select: {
        images: true,
      },
    });

    post?.images?.map(async (image) => {
      await deleteImageCloudinary(image.public_id);
    });

    const postOwnerFollowers = await prisma.follower.findMany({
      where: {
        followingId: userId as string,
      },
      include: {
        follower: {
          select: {
            id: true,
          },
        }, // Include details about the follower
      },
    });

    if (postOwnerFollowers.length > 0) {
      postOwnerFollowers.forEach(async (follower) => {
        await deleteNotification(
          userId as string,
          follower?.follower.id as string,
          "POST",
          id as string
        );
      });
    }

    await prisma.post.delete({
      where: {
        id: id as string,
      },
    });

    await prisma.user.update({
      where: {
        id: userId as string,
      },
      data: {
        postsCount: {
          decrement: 1,
        },
      },
    });

    return { success: "Post deleted successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const getPosts = async (skip?: number, take?: number) => {
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
      skip: skip, // Offset for pagination
      take: take, // Number of posts to fetch per page
    });

    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const getPostById = async (id: string) => {
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id as string,
      },
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

    return post;
  } catch (error) {
    console.log(error);
  }
};

export const getPostComments = async (id: string) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: id as string,
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
          // Include replies for each comment
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
    });
    return comments;
  } catch (error) {
    console.log(error);
  }
};
