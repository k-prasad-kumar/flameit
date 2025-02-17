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
    if (!userId || !recipientId || !type) return;

    // Build the where clause.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      userId,
      recipientId,
      type,
    };

    // If a postId is provided, add it to the filter.
    if (postId) {
      whereClause.postId = postId;
    }

    await prisma.notification.deleteMany({
      where: whereClause,
    });

    return { success: "Notification(s) deleted successfully" };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return { error: "Failed to delete notification" };
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

    return notifications;
  } catch (error) {
    console.log(error);
  }
};

export const updateNotification = async (userId: string) => {
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

    return { sucess: "Success" };
  } catch (error) {
    console.log(error);
  }
};
