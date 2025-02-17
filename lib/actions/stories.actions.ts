"use server";

import { prisma } from "@/lib/prisma";
import { StoryUserInfoInterface, StroriesInterface } from "@/types/types";
import { revalidatePath } from "next/cache";
import { deleteImageCloudinary } from "./delete.image.actions";
import { createNotification, deleteNotification } from "./notification.actions";

export const addStory = async (data: StroriesInterface) => {
  try {
    const expiresAt: Date = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    await prisma.stories.create({
      data: {
        userId: data.userId,
        image: data.image ? data.image : null,
        text: data.text ? data.text : null,
        expiresAt,
      },
    });
    revalidatePath("/");
    return { success: "Story added successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const updateStoryLike = async (
  storyId: string,
  storyUserId: string,
  userId: string,
  type: string
) => {
  try {
    if (type === "add") {
      await prisma.storyLike.create({
        data: {
          storyId: storyId as string,
          userId: userId as string,
        },
      });

      if (userId !== storyUserId) {
        const data = {
          userId: userId as string,
          recipientId: storyUserId as string,
          text: "liked your story.",
          isSeen: false,
          type: "LIKE",
        };
        await createNotification(data);
      }
    }

    if (type === "remove") {
      await prisma.storyLike.deleteMany({
        where: {
          storyId: storyId as string,
          userId: userId as string,
        },
      });

      if (userId !== storyUserId) {
        await deleteNotification(
          userId as string,
          storyUserId as string,
          "LIKE"
        );
      }
    }

    return { success: "Story liked successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const addStoryComment = async (
  storyId: string,
  storyUserId: string,
  userId: string,
  text: string
) => {
  try {
    await prisma.storyComment.create({
      data: {
        storyId: storyId,
        userId: userId,
        text: text,
      },
    });

    if (userId !== storyUserId) {
      const data = {
        userId: userId as string,
        recipientId: storyUserId as string,
        text: "replied on your story.",
        isSeen: false,
        type: "COMMENT",
      };
      await createNotification(data);
    }

    return { success: "Reply sent successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const deleteStory = async (id: string, publicId: string) => {
  try {
    if (publicId) {
      await deleteImageCloudinary(publicId);
    }
    await prisma.stories.delete({ where: { id: id as string } });
    return { success: "Story deleted successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const getStories = async () => {
  try {
    deleteExpiredStories();
    const stories = await prisma.stories.findMany({
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return stories;
  } catch (error) {
    console.log(error);
  }
};

export const getFollowingStories = async (followingIds: string[]) => {
  try {
    deleteExpiredStories();
    const stories = await prisma.stories.findMany({
      where: {
        userId: {
          in: followingIds,
        },
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
        seenBy: {
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
      },

      orderBy: {
        createdAt: "desc",
      },
    });
    return stories;
  } catch (error) {
    console.log(error);
  }
};

export const getStoriesByUser = async (userId: string) => {
  try {
    deleteExpiredStories();
    const stories = await prisma.stories.findMany({
      where: {
        userId: userId,
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return stories;
  } catch (error) {
    console.log(error);
  }
};

export const getStoryById = async (id: string) => {
  try {
    const story = await prisma.stories.findUnique({
      where: { id: id as string },
    });
    return story;
  } catch (error) {
    console.log(error);
  }
};

export const getStoriesUserInfo = async () => {
  try {
    const stories: StoryUserInfoInterface[] = await prisma.stories.findMany({
      select: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return stories;
  } catch (error) {
    console.log(error);
  }
};

export const getFollowingStoriesUserInfo = async (followingIds: string[]) => {
  try {
    const stories: StoryUserInfoInterface[] = await prisma.stories.findMany({
      where: {
        userId: {
          in: followingIds,
        },
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return stories;
  } catch (error) {
    console.log(error);
  }
};

export const deleteExpiredStories = async () => {
  try {
    const expiredStories = await prisma.stories.findMany({
      where: { expiresAt: { lte: new Date() } },
    });

    expiredStories.forEach(async (story) => {
      if (story?.image?.public_id) {
        deleteImageCloudinary(story?.image?.public_id as string);
      }
    });

    await prisma.stories.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
  } catch (error) {
    console.log(error);
  }
};

export const addSennBy = async (userId: string, storyId: string) => {
  try {
    await prisma.storiesSeenBy.create({
      data: {
        userId: userId,
        storyId: storyId,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
