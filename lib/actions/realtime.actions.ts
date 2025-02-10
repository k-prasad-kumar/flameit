"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUserById } from "./user.actions";
import { MessageInterface } from "@/types/types";
import { deleteImageCloudinary } from "./delete.image.actions";

export const addConversation = async (
  userId: string,
  participantIds: string[],
  isGroup: boolean,
  name?: string
) => {
  try {
    if (!userId || !participantIds) {
      return { error: "Invalid conversation data" };
    }

    const participantsInfo = participantIds.map(async (id) => {
      const user = await getUserById(id);
      return {
        userId: user?.id as string,
        username: user?.username as string,
        image: user?.image as string,
      };
    });

    const user = await getUserById(userId);

    const userInfo = {
      userId: user?.id as string,
      username: user?.username as string,
      image: user?.image as string,
    };

    // Check if a private conversation already exists
    if (!isGroup) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          isGroup: false,
          participants: {
            every: {
              userId: { in: [userId, ...participantIds] },
            },
          },
        },
      });

      if (existingConversation) {
        return {
          error: "Private conversation already exists",
          conversationId: existingConversation.id,
        };
      }
    }

    const temp = [{ ...userInfo }, ...(await Promise.all(participantsInfo))];
    // Create conversation
    const conversation = await prisma.conversation.create({
      data: {
        name: isGroup ? name : null,
        isGroup,
        ownerId: userId,
        participants: temp,
      },
    });

    return {
      success: "Conversation created successfully",
      conversationId: conversation.id,
    };
  } catch (error) {
    console.log(error);
  }
};

export const updateConversation = async (
  conversationId: string,
  userId: string
) => {
  try {
    if (!conversationId || !userId) {
      return { error: "Missing conversationId or userId" };
    }
    await prisma.message.updateMany({
      where: {
        conversationId: conversationId as string,
        // Ensure that seenBy array does not include the userId.
        NOT: { seenBy: { has: userId as string } },
      },
      data: {
        seenBy: { push: userId as string },
      },
    });

    revalidatePath(`/inbox`);
    revalidatePath(`/inbox/${conversationId}`);
  } catch (error) {
    console.log(error);
  }
};

export const getAllConversations = async (userId: string) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        messages: {
          where: {
            NOT: { seenBy: { has: userId } },
          },
        },
      },
    });

    return conversations;
  } catch (error) {
    console.log(error);
  }
};

export const getAllOnlyConversations = async (userId: string) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
    });

    return conversations;
  } catch (error) {
    console.log(error);
  }
};

export const deleteConversation = async (id: string) => {
  try {
    // Delete all messages in the conversation
    await prisma.message.deleteMany({ where: { conversationId: id } });

    // Delete conversation
    await prisma.conversation.delete({ where: { id } });

    return { success: "Conversation deleted successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  text?: string | null,
  parentMessageId?: string | null,
  post?: {
    postId?: string | null;
    image?: string | null;
    imagePublicId?: string | null;
    username?: string | null;
    userImage?: string | null;
  } | null
) => {
  try {
    if (!conversationId || !senderId) {
      return { error: "Invalid message data" };
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        participants: { some: { userId: senderId } }, //check senderId is in participants,
      },
    });

    if (!conversation) {
      return { error: "Conversation not found" };
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        text,
        post: post ? post : null,
        parentMessageId: parentMessageId ? parentMessageId : null,
        seenBy: [senderId], // Message is initially seen by sender
      },
    });
    const newMessage: MessageInterface | null =
      (await prisma.message.findUnique({
        where: { id: message.id },
        include: {
          sender: { select: { id: true, username: true, image: true } },
          parentMessage: {
            include: {
              sender: { select: { id: true, username: true, image: true } },
            },
          },
        },
      })) as MessageInterface | null;
    // Update conversation last message
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: text ? text : "You sent an attachment",
        lastMessageAt: new Date(),
      },
    });

    return { success: "Message sent successfully", newMessage: newMessage };
  } catch (error) {
    console.log(error);
  }
};

export const replyMessage = async (
  conversationId: string,
  senderId: string,
  text: string,
  parentMessageId?: string
) => {
  try {
    if (!conversationId || !senderId || !text || !parentMessageId) {
      return { error: "Invalid message data" };
    }
    await prisma.message.create({
      data: {
        conversationId,
        senderId,
        text,
        parentMessageId,
      },
    });

    return { success: "replied successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const markMessageAsSeen = async (messageId: string, userId: string) => {
  try {
    if (!userId) {
      return { error: "User ID is required" };
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { seenBy: { push: userId } },
    });

    revalidatePath(`/inbox/${messageId}`);
    return { success: "Message marked as seen successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const deleteMessage = async (messageId: string) => {
  try {
    const replies = await prisma.message.findMany({
      where: { parentMessageId: messageId },
      select: { id: true },
    });

    if (!replies) {
      throw new Error("Message not found");
    }

    // Recursively delete all replies
    for (const reply of replies) {
      await deleteMessage(reply.id);
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (message?.post?.imagePublicId) {
      deleteImageCloudinary(message?.post?.imagePublicId);
    }

    // Delete the parent message
    await prisma.message.delete({
      where: { id: messageId },
    });

    return { success: "Message deleted successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const updateReaction = async (
  id: string,
  userId: string,
  name: string,
  image: string,
  reaction: string
) => {
  try {
    // Fetch the current reactions for the message
    const messageData = await prisma.message.findUnique({
      where: { id },
      select: { reactions: true },
    });
    if (!messageData) {
      return { error: "Message not found", updatedReactions: [] };
    }
    const currentReactions = messageData.reactions || [];
    // Find if the current user already reacted
    const existingReaction = currentReactions.find((r) => r.userId === userId);
    let newReactionsArray;
    if (existingReaction) {
      if (existingReaction.reaction === reaction) {
        // If the same reaction is clicked, remove it
        newReactionsArray = currentReactions.filter((r) => r.userId !== userId);
        await prisma.message.update({
          where: { id },
          data: { reactions: newReactionsArray },
        });
        return {
          success: "Reaction removed successfully",
          updatedReactions: newReactionsArray,
        };
      } else {
        // If a different reaction exists, update it (replace the previous reaction)
        newReactionsArray = currentReactions.map((r) =>
          r.userId === userId ? { ...r, reaction, name, image } : r
        );
        await prisma.message.update({
          where: { id },
          data: { reactions: newReactionsArray },
        });
        return {
          success: "Reaction updated successfully",
          updatedReactions: newReactionsArray,
        };
      }
    } else {
      // If no reaction exists for this user, add the new reaction by building a new array
      newReactionsArray = [
        ...currentReactions,
        { userId, name, image, reaction },
      ];
      await prisma.message.update({
        where: { id },
        data: { reactions: newReactionsArray },
      });
      return {
        success: "Reaction added successfully",
        updatedReactions: newReactionsArray,
      };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getConversation = async (id: string) => {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: { id: id },
    });
    return conversation;
  } catch (error) {
    console.log(error);
  }
};

export const getMessages = async (
  conversationId: string,
  cursor: string,
  take: number
) => {
  const messages: MessageInterface[] = (await prisma.message.findMany({
    where: { conversationId },
    include: {
      sender: { select: { id: true, username: true, image: true } },
      parentMessage: {
        include: {
          sender: { select: { id: true, username: true, image: true } },
        },
      },
    },
    take: take, // Fetch latest 40 messages
    skip: cursor ? 1 : 0, // Skip the first message if cursor exists
    cursor: cursor ? { id: cursor } : undefined, // Start fetching from the last message in previous batch
    orderBy: { createdAt: "desc" }, // Get newest messages first
  })) as MessageInterface[];

  return {
    messages,
    nextCursor: messages.length > 0 ? messages[messages.length - 1].id : null, // Get the last message ID
  };
};

export const getUnseenCount = async (userId: string) => {
  try {
    if (!userId) {
      return { error: "User ID is required" };
    }
    const unseenCount = await prisma.message.count({
      where: {
        conversation: {
          participants: {
            some: { userId: userId as string },
          },
        },
        NOT: { seenBy: { has: userId as string } },
      },
    });
    return { success: "Counted", count: unseenCount };
  } catch (error) {
    console.log(error);
  }
};

export const addParticipants = async (
  conversationId: string,
  participantIds: string[]
) => {
  try {
    if (!conversationId || !participantIds) {
      return { error: "Invalid conversation data" };
    }

    const participantsInfo = participantIds.map(async (id) => {
      const user = await getUserById(id);
      return {
        userId: user?.id as string,
        username: user?.username as string,
        image: user?.image as string,
      };
    });

    const temp = [...(await Promise.all(participantsInfo))];
    // Update conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        participants: {
          push: temp.map((user) => ({
            userId: user.userId,
            username: user.username,
            image: user.image,
          })),
        },
      },
    });
    return { success: "Participants added successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const updateGroupName = async (conversationId: string, name: string) => {
  try {
    if (!conversationId || !name) {
      return { error: "Invalid conversation data" };
    }
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { name },
    });
    return { success: "Group name updated successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const removeParticipant = async (
  conversationId: string,
  userId: string
) => {
  try {
    if (!conversationId || !userId) {
      return { error: "Invalid conversation data" };
    }
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        participants: {
          deleteMany: {
            // Use deleteMany to remove the participant record matching userId
            where: { userId: userId },
          },
        },
      },
    });
    return { success: "Participant removed successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to remove participant" };
  }
};
