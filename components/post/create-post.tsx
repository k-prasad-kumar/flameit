"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageIcon, PlusIcon, VideoIcon } from "lucide-react";
import { ProfileAvatar } from "../avatar";
import { Button } from "../ui/button";
import { useState } from "react";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

const CreatePost = () => {
  const [caption, setCaption] = useState<string>("");
  //   const [fileEntry, setFileEntry] = useState<FileEntry>({ files: [] });
  //   const [isPending, startTransition] = useTransition();
  //   const router = useRouter();
  const [open, setOpen] = useState(false);
  const isPending = false;
  const handleSubmit = () => {
    // const photoMeta: PhotoMeta[] = fileEntry.files.map((file) => {
    //   return { cdnUrl: file.cdnUrl!, uuid: file.uuid! };
    // });
    // if (photoMeta.length === 0) return toast.error("Please upload a photo");
    // startTransition(() => {
    //   createPost(photoMeta, caption).then((data) => {
    //     if (data?.success) {
    //       setFileEntry({ files: [] });
    //       setCaption("");
    //       setOpen(false);
    //       toast.success("Post created successfully");
    //       router.push(`/`);
    //     } else if (data?.error) {
    //       toast.error(data?.error);
    //     }
    //   });
    // });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-2 px-3">
        <PlusIcon size={28} />
      </DialogTrigger>
      <DialogContent className="max-h-screen max-w-screen-sm !mb-20">
        <DialogHeader className="w-full justify-center">
          <DialogTitle className="text-center">Create new post</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="flex space-x-4">
            <ProfileAvatar
              image="https://github.com/shadcn.png"
              alt="profile"
              width="10"
              height="10"
            />
            <div className="flex flex-col w-full">
              <h2>its_me_prasad</h2>
              <textarea
                rows={7}
                placeholder="What's on your mind?"
                className="border-none outline-none text-sm bg-transparent scroll"
                onChange={(e) => setCaption(e.target.value)}
                value={caption}
              />
            </div>
          </div>
          {/* <FileUploader
            fileEntry={fileEntry}
            onChange={setFileEntry}
            preview={true}
          /> */}
        </ScrollArea>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 text-sm mt-4">
            <div className="flex items-center space-x-2 text-[#777777]">
              <ImageIcon size={18} />
              <p>Photo</p>
            </div>
            <div className="flex items-center space-x-2 text-[#777777]">
              <VideoIcon size={18} />
              <p>Video</p>
            </div>
          </div>
          <Button type="submit" onClick={handleSubmit}>
            <span
              className={`justify-center items-center ${
                isPending ? "flex" : "hidden"
              }`}
            >
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
            </span>
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CreatePost;
