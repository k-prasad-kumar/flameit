"use server";

import { PrismaClient } from "@prisma/client";
import { signIn } from "@/auth";
import { RegisterInterface } from "@/types/types";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const createUser = async (formData: RegisterInterface) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: formData.email as string },
    });

    if (user) {
      return { error: "User already exists" };
    }

    const username = await prisma.user.findUnique({
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

export const updateUsername = async (email: string, username: string) => {
  try {
    const existingUsername = await prisma.user.findUnique({
      where: { username: username as string },
    });

    if (existingUsername) {
      return { error: `The Username ${username} is not avalable` };
    }
    await prisma.user.update({
      where: { email: email as string },
      data: { username: username as string },
    });

    return { success: "Logged in successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: id as string } });
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};
