"use client";

import { z } from "zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChangePasswordSchema, EditProfileSchema } from "@/types/schemas";

import { ChangeImageInterface, EditProfileInterface } from "@/types/types";
import { changePassword, updateUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import FormError from "../form-error";
import ChangePhoto from "./change-photo";
import FormSuccess from "../form-success";

const EditProfile = ({
  userId,
  changeImage,
  editProfile,
  hasPassword,
}: {
  userId: string;
  changeImage: ChangeImageInterface;
  editProfile: EditProfileInterface;
  hasPassword: boolean;
}) => {
  const [error, setError] = useState<string | undefined>();
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [passwordSuccess, setPasswordSuccess] = useState<string | undefined>();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: editProfile.name,
      username: editProfile.username,
      bio: editProfile.bio,
      gender: editProfile.gender,
      isPrivate: editProfile.isPrivate,
    },
  });
  const changePasswordForm = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleEditProfile = (values: z.infer<typeof EditProfileSchema>) => {
    const pattern = /^[a-zA-Z0-9_-]+$/;
    const res = pattern.test(values.username as string);
    if (!res)
      return setUsernameError(
        "Username can only contain letters, numbers, underscores and hyphens."
      );

    startTransition(() => {
      updateUser(
        userId,
        {
          ...values,
          bio: values.bio!,
          gender: values.gender!,
          isPrivate: values.isPrivate!,
        },
        editProfile.username
      )
        .then((data) => {
          if (data?.error) {
            setError(data?.error);
            setSuccess(undefined);
          } else {
            setError(undefined);
            setSuccess(data?.success);
            router.push(`/${data?.username}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  const handleChangePassword = (
    values: z.infer<typeof ChangePasswordSchema>
  ) => {
    startTransition(() => {
      changePassword(userId, values.currentPassword, values.newPassword)
        .then(async (data) => {
          if (data?.error) {
            setPasswordError(data?.error);
            setPasswordSuccess(undefined);
          } else {
            changePasswordForm.reset();
            setPasswordError(undefined);
            setPasswordSuccess(data?.success);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Account Information</AccordionTrigger>
          <AccordionContent>
            <div className="w-full px-1">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleEditProfile)}
                  className="space-y-5 md:space-y-8"
                >
                  <ChangePhoto userId={userId} changeImage={changeImage} />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="John"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="johndoe"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormError message={usernameError} />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={5}
                            placeholder="bio"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full capitalize">
                              <SelectValue placeholder="male" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="flex justify-between items-end">
                        <FormLabel>Private account</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormError message={error} />
                  <FormSuccess message={success} />

                  <Button type="submit" className="w-full flex gap-2">
                    {isPending ? (
                      <span
                        className={`justify-center items-center ${
                          isPending ? "flex" : "hidden"
                        }`}
                      >
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                      </span>
                    ) : (
                      <span>Save</span>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {hasPassword && (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Change Your Password</AccordionTrigger>
            <AccordionContent>
              <div className="w-full px-1 pt-5">
                <Form {...changePasswordForm}>
                  <form
                    onSubmit={changePasswordForm.handleSubmit(
                      handleChangePassword
                    )}
                    className="space-y-5 md:space-y-8"
                  >
                    <FormField
                      control={changePasswordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="٭٭٭٭٭٭٭٭"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={changePasswordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="٭٭٭٭٭٭٭٭"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={changePasswordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="٭٭٭٭٭٭٭٭"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormError message={passwordError} />
                    <FormSuccess message={passwordSuccess} />

                    <Button type="submit" className="w-full flex gap-2">
                      {isPending ? (
                        <span
                          className={`justify-center items-center ${
                            isPending ? "flex" : "hidden"
                          }`}
                        >
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                        </span>
                      ) : (
                        <span>Change Password</span>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};
export default EditProfile;
