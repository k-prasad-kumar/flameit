"use server";

import { prisma } from "@/lib/prisma";
import { StoryUserInfoInterface, StroriesInterface } from "@/types/types";
import { revalidatePath } from "next/cache";

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
    }

    if (type === "remove") {
      await prisma.storyLike.deleteMany({
        where: {
          storyId: storyId as string,
          userId: userId as string,
        },
      });
    }

    return { success: "Story liked successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const addStoryComment = async (
  storyId: string,
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

    return { success: "Reply sent successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const deleteStory = async (id: string) => {
  try {
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

export const deleteExpiredStories = async () => {
  try {
    await prisma.stories.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
  } catch (error) {
    console.log(error);
  }
};
