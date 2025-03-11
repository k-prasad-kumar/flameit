"use server";

import { prisma } from "@/lib/prisma";
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
          success: "Private conversation already exists",
          conversationId: existingConversation.id,
        };
      }
    }

    // Create conversation
    const conversation = await prisma.conversation.create({
      data: {
        name: isGroup ? name : null,
        isGroup,
        ownerId: userId,
      },
    });

    await prisma.participant.createMany({
      data: participantIds.map((id) => ({
        userId: id,
        conversationId: conversation.id,
      })),
    });

    return {
      success: "Conversation created successfully",
      conversationId: conversation.id,
    };
  } catch (error) {
    console.log(error);
  }
};

export const markMessagesAsSeen = async (
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
  } catch (error) {
    console.log(error);
  }
};

export const getAllConversations = async (userId: string) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },

      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
        },
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
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
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

    // delete all participants
    await prisma.participant.deleteMany({ where: { conversationId: id } });

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
    postUserId?: string | null;
    postId?: string | null;
    image?: string | null;
    imagePublicId?: string | null;
  } | null
) => {
  try {
    if (!conversationId || !senderId) {
      return { error: "Invalid message data" };
    }

    // const conversation = await prisma.conversation.findUnique({
    //   where: {
    //     id: conversationId,
    //     // participants: { some: { userId: senderId } }, //check senderId is in participants,
    //   },

    // });

    // //check if prticipant exists in conversation

    // if (!conversation) {
    //   return { error: "Conversation not found" };
    // }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        text,
        parentMessageId: parentMessageId ? parentMessageId : null,
        seenBy: [senderId], // Message is initially seen by sender
      },
    });

    if (post) {
      await prisma.messagePost.create({
        data: {
          postUserId: post.postUserId ? post.postUserId : null,
          postId: post.postId ? post.postId : null,
          messageId: message.id,
          image: post.image ? post.image : null,
          imagePublicId: post.imagePublicId ? post.imagePublicId : null,
        },
      });
    }

    const newMessage: MessageInterface | null =
      (await prisma.message.findUnique({
        where: { id: message.id },
        include: {
          sender: { select: { id: true, username: true, image: true } },
          post: {
            include: {
              postUser: {
                select: { id: true, username: true, image: true, name: true },
              },
            },
          },
          parentMessage: {
            include: {
              sender: { select: { id: true, username: true, image: true } },
              post: {
                include: {
                  postUser: {
                    select: {
                      id: true,
                      username: true,
                      image: true,
                      name: true,
                    },
                  },
                },
              },
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

export const deleteMessage = async (messageId: string) => {
  try {
    // Find replies for this message, selecting only their id and post.imagePublicId (if available)
    const replies = await prisma.message.findMany({
      where: { parentMessageId: messageId },
      select: { id: true, post: { select: { imagePublicId: true } } },
    });

    // Recursively delete each reply
    for (const reply of replies) {
      await deleteMessage(reply.id);
    }

    // Fetch the MessagePost associated with this message by its messageId field.
    const messagepost = await prisma.messagePost.findUnique({
      where: { messageId: messageId },
    });

    // If there's an associated image, delete it from Cloudinary.
    if (messagepost?.imagePublicId) {
      await deleteImageCloudinary(messagepost.imagePublicId);
    }

    // Finally, delete the message itself.
    await prisma.message.delete({
      where: { id: messageId },
    });

    return { success: "Message deleted successfully" };
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

export const updateReaction = async (
  id: string,
  userId: string,
  reaction: string
) => {
  try {
    // Fetch the current reactions for the message
    const reactions = await prisma.reaction.findMany({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
            name: true,
          },
        },
      },
    });

    if (!reactions) {
      return { error: "Message not found", updatedReactions: [] };
    }
    const currentReactions = reactions || [];

    // Find if the current user already reacted
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        messageId: id,
        userId: userId,
      },
    });

    if (existingReaction) {
      if (existingReaction?.reaction === reaction) {
        // If the same reaction is clicked, remove it
        await prisma.reaction.delete({
          where: {
            id: existingReaction.id,
          },
        });
        return {
          success: "Reaction removed successfully",
          updatedReactions: currentReactions.filter((r) => r.userId !== userId),
        };
      } else {
        // If a different reaction is clicked, update it
        await prisma.reaction.update({
          where: {
            id: existingReaction.id,
          },
          data: {
            reaction,
          },
        });
      }
    }

    // Add new reaction
    await prisma.reaction.create({
      data: {
        messageId: id,
        userId,
        reaction,
      },
    });

    const newReactionsArray = await prisma.reaction.findMany({
      where: {
        messageId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
            name: true,
          },
        },
      },
    });

    return {
      success: "Reaction added successfully",
      updatedReactions: newReactionsArray,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getConversation = async (id: string) => {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: { id: id },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, username: true, image: true, name: true },
            },
          },
        },
      },
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
      post: {
        include: {
          postUser: {
            select: { id: true, username: true, image: true, name: true },
          },
        },
      },
      reactions: {
        include: {
          user: {
            select: { id: true, username: true, image: true, name: true },
          },
        },
      },
      parentMessage: {
        include: {
          sender: { select: { id: true, username: true, image: true } },
          post: {
            include: {
              postUser: {
                select: { id: true, username: true, image: true, name: true },
              },
            },
          },
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

    // Update conversation
    await prisma.participant.createMany({
      data: participantIds.map((id) => ({
        conversationId,
        userId: id,
      })),
    });

    return { success: "Participants added successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const updateGroupImage = async (
  conversationId: string,
  groupImage: string,
  imagePublicId: string
) => {
  try {
    if (!conversationId || !groupImage) {
      return { error: "Invalid conversation data" };
    }
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { groupImage, imagePublicId },
    });
    return { success: "Group image updated successfully" };
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
    await prisma.participant.delete({
      where: {
        conversationId,
        userId,
      },
    });
    return { success: "Participant removed successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to remove participant" };
  }
};
