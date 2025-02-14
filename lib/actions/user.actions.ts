"use server";

import { signIn } from "@/auth";
import {
  ChangeImageInterface,
  EditProfileInterface,
  RegisterInterface,
} from "@/types/types";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { createNotification, deleteNotification } from "./notification.actions";
import {
  generateEmailVerificationPin,
  generateResetPasswordPin,
} from "../token";
import { sendVerificationEmail } from "../email";

export const createUser = async (formData: RegisterInterface) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: formData.email as string },
    });

    if (user) {
      return { error: "User already exists, Please login." };
    }

    const username = await prisma.user.findFirst({
      where: { username: formData.username.toLowerCase() as string },
    });

    if (username) {
      return {
        error: `The Username ${formData.username.toLowerCase()} is not avalable`,
      };
    }

    const hashedPassword: string = await hash(formData.password as string, 10);

    await prisma.user.create({
      data: {
        name: formData.name as string,
        username: formData.username.toLowerCase() as string,
        email: formData.email as string,
        password: hashedPassword,
      },
    });

    const pin = await generateEmailVerificationPin(formData.email as string);
    await sendVerificationEmail(pin.email, pin.pin);

    return { success: "Email sent successfully", email: pin?.email };
  } catch (error) {
    console.log(error);
  }
};

export const checkVerification = async (email: string, pin: string) => {
  try {
    if (!email || !pin) return { error: "Please provide both email & pin." };

    const verificationRecord = await prisma.emailVerification.findFirst({
      where: { email },
    });

    if (!verificationRecord) {
      return { error: "Verification record not found" };
    }

    if (verificationRecord.pin !== pin) {
      return { error: "Incorrect one-time code" };
    }

    const now = new Date();
    // Optionally check if the code has expired
    if (now > new Date(verificationRecord.expiresAt)) {
      return { error: "The verification code has expired." };
    }

    // Update user's emailVerified field with the current time
    await prisma.user.update({
      where: { email },
      data: { emailVerified: now },
    });

    // Optionally, delete or mark the verification record as used
    await prisma.emailVerification.delete({
      where: { id: verificationRecord.id },
    });

    return { success: "Email verified successfully" };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while verifying your email." };
  }
};

export const sendResetPasswordEmail = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) return { error: "User not found" };

    const pin = await generateResetPasswordPin(email);
    await sendVerificationEmail(pin.email, pin.pin);
    return { success: "Email sent successfully", email: pin?.email };
  } catch (error) {
    console.log(error);
  }
};

export const passwordResetVerification = async (email: string, pin: string) => {
  try {
    console.log(email, pin);
    if (!email || !pin) return { error: "Please provide both email & pin." };

    const verificationRecord = await prisma.passwordReset.findFirst({
      where: { email },
    });

    if (!verificationRecord) {
      return { error: "Verification record not found" };
    }

    if (verificationRecord.pin !== pin) {
      return { error: "Incorrect one-time code" };
    }

    const now = new Date();
    // Optionally check if the code has expired
    if (now > new Date(verificationRecord.expiresAt)) {
      return { error: "The verification code has expired." };
    }

    // Optionally, delete or mark the verification record as used
    await prisma.passwordReset.delete({
      where: { id: verificationRecord.id },
    });

    return { success: "Forgot password email verified successfully" };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while verifying your email." };
  }
};

export const resetPassword = async (email: string, password: string) => {
  try {
    const hashedPassword: string = await hash(password as string, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });
    return { success: "Password reset successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: { email: email as string },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const isPasswordCorrect = await compare(
    password as string,
    user.password as string
  );

  if (!isPasswordCorrect) {
    return { error: "Incorrect password" };
  }

  if (!user.emailVerified) {
    const pin = await generateEmailVerificationPin(email as string);
    await sendVerificationEmail(pin.email, pin.pin);
    return { error: "Email not verified" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });
  } catch (error) {
    const someError = error as CredentialsSignin;
    return {
      error: someError.message.slice(
        0,
        someError.message.indexOf(".") + 1
      ) as string,
    };
  }
  redirect("/");
};

export const updateProfileImage = async (
  id: string,
  image: ChangeImageInterface
) => {
  try {
    await prisma.user.update({
      where: { id: id as string },
      data: {
        image: image?.image as string,
        imagePublicId: image?.imagePublicId as string,
      },
    });
    revalidatePath("/");
    return { success: "Image updated successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};

export const updateUser = async (
  id: string,
  editProfile: EditProfileInterface,
  currentUsername: string
) => {
  try {
    if (editProfile?.username === currentUsername) {
      const user = await prisma.user.update({
        where: { id: id as string },
        data: {
          name: editProfile?.name as string,
          bio: editProfile?.bio as string,
          gender: editProfile?.gender as string,
        },
      });
      return { success: "user updated successfully", username: user?.username };
    }

    const existingUsername = await prisma.user.findFirst({
      where: { username: editProfile?.username as string },
    });

    if (existingUsername) {
      return { error: `The Username ${editProfile?.username} is not avalable` };
    }

    const user = await prisma.user.update({
      where: { id: id as string },
      data: {
        name: editProfile?.name as string,
        username: editProfile?.username.toLowerCase() as string,
        bio: editProfile?.bio as string,
        gender: editProfile?.gender as string,
      },
    });

    return { success: "user updated successfully", username: user?.username };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};

export const changePassword = async (
  id: string,
  password: string,
  newPassword: string
) => {
  try {
    const userPassword = await prisma.user.findFirst({
      where: { id: id as string },
      select: { password: true },
    });

    const isMatched = await compare(password, userPassword?.password as string);

    if (!isMatched) {
      return {
        error:
          "Your old password was entered incorrectly. Please enter it again.",
      };
    }

    const hashedPassword: string = await hash(newPassword as string, 10);

    await prisma.user.update({
      where: { id: id as string },
      data: {
        password: hashedPassword,
      },
    });
    return { success: "Password changed successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const updateSavedPost = async (
  userId: string,
  postId: string,
  type: string
) => {
  try {
    if (type === "add") {
      await prisma.savedPost.create({
        data: {
          userId: userId as string,
          postId: postId as string,
        },
      });
      return { success: "Post saved successfully" };
    }

    if (type === "remove") {
      await prisma.savedPost.deleteMany({
        where: {
          userId: userId as string,
          postId: postId as string,
        },
      });
      return { success: "Post removed from saved successfully" };
    }
  } catch (error) {
    console.log(error);
  }
};

export const addFollower = async (followerId: string, followingId: string) => {
  try {
    await prisma.follower.create({
      data: {
        followerId, // The user who is following
        followingId, // The user being followed
      },
    });

    const data = {
      userId: followerId as string,
      recipientId: followingId as string,
      text: "started following you.",
      isSeen: false,
      type: "FOLLOW",
    };
    await createNotification(data);

    await prisma.user.update({
      where: {
        id: followingId, // The user being followed
      },
      data: {
        followersCount: {
          increment: 1,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: followerId, // The user who is following
      },
      data: {
        followingCount: {
          increment: 1,
        },
      },
    });

    return { success: "Followed successfully" };
  } catch (error) {
    console.error("Error adding follower:", error);
  }
};

export const removeFollower = async (
  followerId: string,
  followingId: string
) => {
  try {
    await prisma.follower.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });

    await prisma.user.update({
      where: {
        id: followingId, // The user being followed
      },
      data: {
        followersCount: {
          decrement: 1,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: followerId, // The user who is following
      },
      data: {
        followingCount: {
          decrement: 1,
        },
      },
    });

    await deleteNotification(followerId, followingId, "FOLLOW");

    return { success: "Unfollowed successfully" };
  } catch (error) {
    console.error("Error removing follower:", error);
  }
};

export const isFollowing = async (followerId: string, followingId: string) => {
  try {
    const relationship = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return !!relationship; // Returns true if the relationship exists
  } catch (error) {
    console.error("Error checking following relationship:", error);
    return false;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: id as string } });
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { username: username },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getUserPosts = async (
  userId: string,
  skip: number,
  take: number
) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId: userId },

      select: {
        id: true,
        images: true,
        likesCount: true,
        commentsCount: true,
      },
      take: take,
      skip: skip,
      orderBy: { createdAt: "desc" },
    });
    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const getUserSavedPosts = async (
  userId: string,
  skip: number,
  take: number
) => {
  try {
    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId: userId as string,
      },
      include: {
        post: {
          select: {
            id: true,
            images: true,
          },
        },
      },
      take: take,
      skip: skip,
      orderBy: { createdAt: "desc" },
    });
    return savedPosts;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getUserTaggedPosts = async (
  userId: string,
  skip: number,
  take: number
) => {
  try {
    const user = await prisma.taggedPost.findMany({
      where: { userId: userId },
      include: {
        post: {
          select: {
            id: true,
            images: true,
          },
        },
      },
      take: take,
      skip: skip,
      orderBy: { createdAt: "desc" },
    });
    return user;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getFollowCount = async (username: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { username: username },
      select: {
        id: true,
        followersCount: true,
        followingCount: true,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getFollowers = async (userId: string) => {
  try {
    const followers = await prisma.follower.findMany({
      where: {
        followingId: userId as string, // The user being followed
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        }, // Include details about the follower
      },
    });
    return followers;
  } catch (error) {
    console.error("Error fetching followers:", error);
    return [];
  }
};

export const getFollowing = async (userId: string) => {
  try {
    const following = await prisma.follower.findMany({
      where: {
        followerId: userId as string, // The user who is following
      },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        }, // Include details about the follower
      },
    });
    return following;
  } catch (error) {
    console.error("Error fetching following:", error);
    return [];
  }
};

export const getFollowingUserId = async (userId: string) => {
  try {
    const following = await prisma.follower.findMany({
      where: {
        followerId: userId as string, // The user who is following
      },
      select: {
        followingId: true,
      },
    });
    return following;
  } catch (error) {
    console.error("Error fetching following:", error);
    return [];
  }
};

export const getloginUserId = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: email },
      select: {
        id: true,
        username: true,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const fetchUsers = async (q: string, skip: number, take: number) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
      skip: skip,
      take: take,
      orderBy: { createdAt: "desc" },
    });
    return users;
  } catch (error) {
    console.log("fetch users : ", error);
  }
};
