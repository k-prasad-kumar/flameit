"use server";

import { signIn } from "@/auth";
import { User } from "@/models/user.model";
import { RegisterInterface, SocialLoginInterface } from "@/types/types";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";

export const createUser = async (formData: RegisterInterface) => {
  try {
    const user = await User.findOne({ email: formData.email as string });

    if (user) {
      return { error: "User already exists" };
    }

    const username = await User.findOne({
      username: formData.username as string,
    });

    if (username) {
      return { error: `The Username ${formData.username} is not avalable` };
    }

    const hashedPassword: string = await hash(formData.password as string, 10);

    await User.create({
      name: formData.name as string,
      username: formData.username as string,
      email: formData.email as string,
      password: hashedPassword,
      profilePicture: "",
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

export const socialLogin = async (formData: SocialLoginInterface) => {
  try {
    const user = await User.findOne({ email: formData.email as string });

    if (user) {
      return null;
    }

    const str = formData.email.slice(0, formData.email.indexOf("@") + 1);
    const lower = str.toLowerCase();
    const username = lower.replace(/[^A-Za-z0-9-_]/g, "");
    console.log(formData.email);
    console.log(username);

    await User.create({
      name: formData.name as string,
      username: username as string,
      email: formData.email as string,
      profilePicture: formData.profilePicture as string,
    });

    return { success: "Created successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};

export const updateUsername = async (email: string, username: string) => {
  try {
    const existingUsername = await User.findOne({
      username: username as string,
    });

    if (existingUsername) {
      return { error: `The Username ${username} is not avalable` };
    }

    await User.findOneAndUpdate(
      { email: email as string },
      { username: username as string }
    );

    return { success: "Logged in successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.log(error);
  }
};
