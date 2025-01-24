"use server";

import { signIn } from "@/auth";
import {
  ChangeImageInterface,
  EditProfileInterface,
  RegisterInterface,
} from "@/types/types";
import { compare, hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient().$extends(withAccelerate());

export const createUser = async (formData: RegisterInterface) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: formData.email as string },
    });

    if (user) {
      return { error: "User already exists" };
    }

    const username = await prisma.user.findFirst({
      where: { username: formData.username as string },
    });

    if (username) {
      return { error: `The Username ${formData.username} is not avalable` };
    }

    const hashedPassword: string = await hash(formData.password as string, 10);

    await prisma.user.create({
      data: {
        name: formData.name as string,
        username: formData.username as string,
        email: formData.email as string,
        password: hashedPassword,
      },
    });
    return { success: "Registered successfully" };
  } catch (error) {
    console.log(error);
  }
};

export const login = async (email: string, password: string) => {
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
  editProfile: EditProfileInterface
) => {
  try {
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
        username: editProfile?.username as string,
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
      include: { posts: true },
      orderBy: { createdAt: "desc" },
    });
    return user;
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
      return { success: "Post removed successfully" };
    }
  } catch (error) {
    console.log(error);
  }
};
