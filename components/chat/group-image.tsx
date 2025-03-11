"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ProfileAvatar } from "../avatar";
import { CldUploadButton, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { deleteImageCloudinary } from "@/lib/actions/delete.image.actions";
import { GroupImageInterface } from "@/types/types";
import { updateGroupImage } from "@/lib/actions/chat.actions";
import { useRouter } from "next/navigation";

const GroupImage = ({
  conversationId,
  changeImage,
}: {
  conversationId: string;
  changeImage: GroupImageInterface;
}) => {
  const [image, setImage] = useState<{ url: string; public_id: string }>({
    url: changeImage?.groupImage as string,
    public_id: changeImage?.imagePublicId as string,
  });

  const router = useRouter();

  const handleChangeImage = (url: string, public_id: string) => {
    updateGroupImage(conversationId, url, public_id)
      .then((data) => {
        if (data?.success) {
          toast.success(data?.success);
          router.push(`/inbox/${conversationId}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="flex flex-col gap-4 w-full items-center my-2">
      <ProfileAvatar image={image.url} alt="profile" width="24" height="24" />

      <CldUploadButton
        uploadPreset="flameit-groups"
        options={{ multiple: false, maxFiles: 1 }}
        onSuccess={(result) => {
          if (image.public_id) {
            deleteImageCloudinary(image.public_id);
          }
          handleChangeImage(
            (result.info as CloudinaryUploadWidgetInfo).secure_url,
            (result.info as CloudinaryUploadWidgetInfo).public_id
          );
          setImage({
            url: (result.info as CloudinaryUploadWidgetInfo).secure_url,
            public_id: (result.info as CloudinaryUploadWidgetInfo).public_id,
          });
        }}
      >
        <span className="bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
          Change group image
        </span>
      </CldUploadButton>
    </div>
  );
};
export default GroupImage;
