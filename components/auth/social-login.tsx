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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MissingSchema } from "@/types/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUsername } from "@/lib/actions/user.actions";
import { FlameIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import FormSuccess from "@/components/form-success";
import FormError from "@/components/form-error";

const MissingForm = ({ email }: { email: string }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const router = useRouter();

  const form = useForm<z.infer<typeof MissingSchema>>({
    resolver: zodResolver(MissingSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (values: z.infer<typeof MissingSchema>) => {
    startTransition(() => {
      updateUsername(email, values.username)
        .then((data) => {
          if (data?.error) {
            setError(data?.error);
          }
          if (data?.success) {
            setSuccess(data?.success);
            router.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  return (
    <Card className="w-full px-0 md:px-4">
      <CardHeader>
        <CardTitle className="text-center text-lg flex flex-col items-center justify-center py-2">
          <FlameIcon size={64} />
          Fill in missing fields
        </CardTitle>
        <CardDescription className="text-center">
          Please fill in the remaining details to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
              Continue
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default MissingForm;
