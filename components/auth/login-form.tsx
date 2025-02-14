"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema, ResetPasswordSchema } from "@/types/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  checkVerification,
  login,
  passwordResetVerification,
  resetPassword,
  sendResetPasswordEmail,
} from "@/lib/actions/user.actions";
import FormError from "@/components/form-error";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "../ui/label";
import FormSuccess from "../form-success";
import { toast } from "sonner";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [value, setValue] = useState<string>("");
  const [resetValue, setResetValue] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [open, setOpen] = useState<boolean | undefined>();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState<
    boolean | undefined
  >();
  const [verifyPasswordOpen, setVerifyPasswordOpen] = useState<
    boolean | undefined
  >();
  const [resetPasswordOpen, setResetPasswordOpen] = useState<
    boolean | undefined
  >();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const changePasswordForm = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values.email, values.password)
        .then((data) => {
          if (data?.error) {
            if (data?.error === "Email not verified") {
              setEmail(values.email);
              setPassword(values.password);
              setError(undefined);
              setOpen(true);
            } else {
              setError(data?.error);
              setSuccess(undefined);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const HandleVerification = () => {
    startTransition(() => {
      checkVerification(email, value)
        .then((data) => {
          if (data?.error) {
            setError(data?.error);
            setSuccess(undefined);
          } else {
            setError(undefined);
            setSuccess(data?.success);
            setOpen(false);
            login(email, password);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const HandleForgotPassword = () => {
    startTransition(() => {
      sendResetPasswordEmail(resetPasswordEmail)
        .then((data) => {
          if (data?.error) {
            setError(data?.error);
            setSuccess(undefined);
          } else {
            setError(undefined);
            setSuccess(data?.success);
            setResetPasswordEmail(data?.email as string);
            setForgotPasswordOpen(false);
            setVerifyPasswordOpen(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  // check forgotpassword email
  const HandleResetVerification = () => {
    startTransition(() => {
      passwordResetVerification(resetPasswordEmail, resetValue)
        .then((data) => {
          if (data?.error) {
            setError(data?.error);
            setSuccess(undefined);
          } else {
            setError(undefined);
            setSuccess(data?.success);
            setResetValue("");
            setVerifyPasswordOpen(false);
            setResetPasswordOpen(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const HandleResetPassword = (values: z.infer<typeof ResetPasswordSchema>) => {
    startTransition(() => {
      resetPassword(resetPasswordEmail, values.newPassword)
        .then((data) => {
          if (data?.success) {
            setError(undefined);
            setSuccess(data?.success);
            setResetPasswordEmail("");
            setResetValue("");
            toast.success(data?.success);
            setResetPasswordOpen(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="john.doe@example.com"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="********"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
          </div>
          <div className="flex justify-end items-center">
            <Dialog
              open={forgotPasswordOpen}
              onOpenChange={setForgotPasswordOpen}
            >
              <DialogTrigger className="text-sm">
                Forgot Password?
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Forgot Your Password ?
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Please enter the email you used to login.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="john.doe@example.com"
                    value={resetPasswordEmail}
                    onChange={(e) => setResetPasswordEmail(e.target.value)}
                  />
                  <FormError message={error} />

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="mt-4"
                    onClick={HandleForgotPassword}
                  >
                    <span
                      className={`justify-center items-center ${
                        isPending ? "flex" : "hidden"
                      }`}
                    >
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                    </span>
                    Continue
                  </Button>
                  <DialogClose>Back to login</DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Button
            type="submit"
            size={"lg"}
            className="w-full dark:outline"
            disabled={isPending}
          >
            <span
              className={`justify-center items-center ${
                isPending ? "flex" : "hidden"
              }`}
            >
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
            </span>
            Login
          </Button>
        </form>
      </Form>
      {/* this dialog for email verification */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>.</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Confirmation Code</DialogTitle>
            <DialogDescription>
              Enter the confirmation code we sent to your email.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center">
            <InputOTP
              maxLength={6}
              value={value}
              onChange={(value) => setValue(value)}
              type="password"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <div className="w-full flex justify-center mt-4">
              <FormError message={error} />
              <FormSuccess message={success} />
            </div>
            <Button className="w-full mt-4" onClick={HandleVerification}>
              <span
                className={`justify-center items-center ${
                  isPending ? "flex" : "hidden"
                }`}
              >
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
              </span>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* this dialog for Reset Password verification */}
      <Dialog open={verifyPasswordOpen} onOpenChange={setVerifyPasswordOpen}>
        <DialogTrigger asChild>.</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Confirmation Code</DialogTitle>
            <DialogDescription>
              Enter the confirmation code we sent to your email.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center">
            <InputOTP
              maxLength={6}
              value={resetValue}
              onChange={(resetValue) => setResetValue(resetValue)}
              type="password"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <div className="w-full flex justify-center mt-4">
              <FormError message={error} />
              <FormSuccess message={success} />
            </div>
            <Button className="w-full mt-4" onClick={HandleResetVerification}>
              <span
                className={`justify-center items-center ${
                  isPending ? "flex" : "hidden"
                }`}
              >
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
              </span>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* this dialog for reset password */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogTrigger asChild>.</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Your Password</DialogTitle>
            <DialogDescription>
              Enter the confirmation code we sent to your email.
            </DialogDescription>
          </DialogHeader>
          <Form {...changePasswordForm}>
            <form
              onSubmit={changePasswordForm.handleSubmit(HandleResetPassword)}
              className="space-y-5 md:space-y-8"
            >
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
                  <span>Reset Password</span>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default LoginForm;
