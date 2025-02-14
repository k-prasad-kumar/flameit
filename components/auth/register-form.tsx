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
import { RegisterSchema } from "@/types/schemas";
import { Input } from "@/components/ui/input";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { checkVerification, createUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import {
  Dialog,
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

const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [email, setEmail] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [open, setOpen] = useState<boolean | undefined>();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      createUser(values)
        .then((data) => {
          if (data?.error) {
            setError(data?.error);
            setSuccess(undefined);
          } else {
            setError(undefined);
            form.reset();
            setEmail(data?.email as string);
            setOpen(true);
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
            router.push("/login");
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
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
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
            Create an account
          </Button>
        </form>
      </Form>
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
    </div>
  );
};
export default RegisterForm;
