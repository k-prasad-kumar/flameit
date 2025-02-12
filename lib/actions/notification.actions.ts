"use server";

import { prisma } from "@/lib/prisma";
import { NotificationFormInterface } from "@/types/types";

export const createNotification = async (data: NotificationFormInterface) => {
  try {
    const expiresAt: Date = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60);

    await prisma.notification.create({
      data: {
        ...data,
        expiresAt,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteNotification = async (
  userId: string,
  recipientId: string,
  type: string,
  postId?: string
) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: {
        userId,
        recipientId,
        postId: postId ? postId : null,
        type,
      },
    });

    if (notification) {
      await prisma.notification.delete({
        where: {
          id: notification?.id as string,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteExpiredNotifications = async () => {
  try {
    await prisma.notification.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getNotifications = async (userId: string) => {
  try {
    const notSeenNotifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
        isSeen: false,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    notSeenNotifications?.forEach(async (notification) => {
      await prisma.notification.update({
        where: {
          id: notification.id,
        },
        data: {
          isSeen: true,
        },
      });
    });

    return notifications;
  } catch (error) {
    console.log(error);
  }
};

export const getNotSeenNotification = async (userId: string) => {
  try {
    deleteExpiredNotifications();
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
        isSeen: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    notifications?.forEach(async (notification) => {
      await prisma.notification.update({
        where: {
          id: notification.id,
        },
        data: {
          isSeen: true,
        },
      });
    });

    return notifications;
  } catch (error) {
    console.log(error);
  }
};
