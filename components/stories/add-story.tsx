"use client";

import { CldUploadButton, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { deleteImageCloudinary } from "@/lib/actions/delete.image.actions";
import {
  ImageIcon,
  MoveLeftIcon,
  SendIcon,
  SmileIcon,
  TrashIcon,
} from "lucide-react";
import { Input } from "../ui/input";
import { addStory } from "@/lib/actions/stories.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AddStory = ({ userId }: { userId: string }) => {
  const [text, setText] = useState<string | null>(null);
  const [image, setImage] = useState<{ url: string; public_id: string } | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const removeImage = () => {
    deleteImageCloudinary(image?.public_id as string);
    setImage(null);
  };

  const handleSubmit = () => {
    if (image === null && text === null)
      return toast.error("Upload an image or type something");

    if (text !== null && text?.length > 150)
      return toast.error("Maximum text length is 150 characters");
    startTransition(() => {
      addStory({ userId, text, image }).then((data) => {
        if (data?.success) {
          router.push(`/`);
          setText(null);
          setImage(null);
        }
      });
    });
  };
  return (
    <div className="w-full h-full flex items-center absolute top-0 left-0 z-50 bg-background">
      {image && (
        <div className="w-full h-full md:max-w-screen-sm md:px-24 mx-auto mt-2 md:mt-0 px-4 py-5 md:py-0 flex flex-col justify-between relative">
          <div className="gap-2 flex flex-wrap">
            <div className="relative w-full flex">
              <div className="absolute top-0 right-0 z-10">
                <Button
                  type="button"
                  onClick={() => removeImage()}
                  size="sm"
                  className="bg-red-500 p-2"
                  disabled={isPending}
                >
                  <TrashIcon />
                </Button>
              </div>
              <Image
                src={image?.url as string}
                width={100}
                height={100}
                sizes="100%"
                loading="lazy"
                className="w-auto h-full object-cover"
                alt="post"
              />
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 gap-2 absolute bottom-0 left-0 mb-4 w-full px-4 md:px-28">
            <div className="flex flex-col w-full relative">
              <Input
                placeholder="Add a caption..."
                className="text-sm pr-8 w-full bg-gray-100 text-black"
                onChange={(e) => setText(e.target.value)}
                value={text ? text : ""}
              />
              <div className="absolute top-0 right-0">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger>
                    <Button
                      asChild
                      variant={"link"}
                      className="px-2 py-0 rounded"
                      onClick={() => setDialogOpen(true)}
                    >
                      <span className="hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer rounded px-1">
                        <SmileIcon />
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle></DialogTitle>
                    </DialogHeader>
                    <div className="p-2 flex justify-between w-full">
                      <div
                        className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                        onClick={() => {
                          setText((prev) => prev + "❤️");
                          setDialogOpen(false);
                        }}
                      >
                        ❤️
                      </div>
                      <div
                        className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                        onClick={() => {
                          setText((prev) => prev + "❤️");
                          setDialogOpen(false);
                        }}
                      >
                        😂
                      </div>
                      <div
                        className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                        onClick={() => {
                          setText((prev) => prev + "❤️");
                          setDialogOpen(false);
                        }}
                      >
                        😮
                      </div>
                      <div
                        className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                        onClick={() => {
                          setText((prev) => prev + "❤️");
                          setDialogOpen(false);
                        }}
                      >
                        😢
                      </div>
                      <div
                        className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                        onClick={() => {
                          setText((prev) => prev + "❤️");
                          setDialogOpen(false);
                        }}
                      >
                        😡
                      </div>
                      <div
                        className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                        onClick={() => {
                          setText((prev) => prev + "❤️");
                          setDialogOpen(false);
                        }}
                      >
                        👍
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <Button type="submit" onClick={handleSubmit} className="w-fit">
              {isPending ? (
                <span
                  className={`justify-center items-center ${
                    isPending ? "flex" : "hidden"
                  }`}
                >
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                </span>
              ) : (
                <span>
                  <SendIcon />
                </span>
              )}
            </Button>
          </div>
          <Link
            href="/"
            className="absolute top-5 left-4 flex gap-2 px-4 py-2 rounded-full bg-background"
          >
            <Button onClick={() => removeImage()}>
              <MoveLeftIcon strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      )}
      {!image && (
        <div className="w-full h-full md:max-w-screen-sm mx-auto p-4 relative">
          <Card className="w-full h-full">
            <CardContent className="w-full h-full flex flex-col justify-between">
              <Link href="/" className="absolute top-5 left-6 flex">
                <Button>
                  <MoveLeftIcon strokeWidth={1.5} />
                </Button>
              </Link>
              <div className="w-full h-full flex items-center justify-center my-5">
                <CldUploadButton
                  uploadPreset="flameit-strories"
                  options={{ maxFiles: 1, multiple: false }}
                  onSuccess={(result) => {
                    setImage({
                      url: (result.info as CloudinaryUploadWidgetInfo)
                        .secure_url,
                      public_id: (result.info as CloudinaryUploadWidgetInfo)
                        .public_id,
                    });
                  }}
                  className="px-4 py-2 flex items-center space-x-2 text-[#777777] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
                >
                  <ImageIcon size={18} />
                  <p>Choose a photo</p>
                </CldUploadButton>
              </div>
              <div className="flex justify-between items-center mt-2 gap-1">
                <div className="flex flex-col w-full relative">
                  <Input
                    placeholder="Add a caption..."
                    className="text-sm pr-8"
                    onChange={(e) => setText(e.target.value)}
                    value={text ? text : ""}
                  />
                  <div className="absolute top-0 right-0">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger>
                        <Button
                          asChild
                          variant={"link"}
                          className="px-2 py-0 rounded"
                          onClick={() => setDialogOpen(true)}
                        >
                          <span className="hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer rounded px-1">
                            <SmileIcon />
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle></DialogTitle>
                        </DialogHeader>
                        <div className="p-2 flex justify-between w-full">
                          <div
                            className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                            onClick={() => {
                              setText((prev) => prev + "❤️");
                              setDialogOpen(false);
                            }}
                          >
                            ❤️
                          </div>
                          <div
                            className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                            onClick={() => {
                              setText((prev) => prev + "❤️");
                              setDialogOpen(false);
                            }}
                          >
                            😂
                          </div>
                          <div
                            className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                            onClick={() => {
                              setText((prev) => prev + "❤️");
                              setDialogOpen(false);
                            }}
                          >
                            😮
                          </div>
                          <div
                            className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                            onClick={() => {
                              setText((prev) => prev + "❤️");
                              setDialogOpen(false);
                            }}
                          >
                            😢
                          </div>
                          <div
                            className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                            onClick={() => {
                              setText((prev) => prev + "❤️");
                              setDialogOpen(false);
                            }}
                          >
                            😡
                          </div>
                          <div
                            className="cursor-pointer hover:scale-125 text-3xl transform duration-150 ease-in-out"
                            onClick={() => {
                              setText((prev) => prev + "❤️");
                              setDialogOpen(false);
                            }}
                          >
                            👍
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <Button type="submit" onClick={handleSubmit}>
                  {isPending ? (
                    <span
                      className={`justify-center items-center ${
                        isPending ? "flex" : "hidden"
                      }`}
                    >
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                    </span>
                  ) : (
                    <span>
                      <SendIcon />
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
export default AddStory;
