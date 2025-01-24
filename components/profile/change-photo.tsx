import { updateProfileImage } from "@/lib/actions/user.actions";
import { useState } from "react";
import { toast } from "sonner";
import { ProfileAvatar } from "../avatar";
import { CldUploadButton, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { deleteImageCloudinary } from "@/lib/actions/delete.image.actions";
import { ChangeImageInterface } from "@/types/types";

const ChangePhoto = ({
  userId,
  changeImage,
}: {
  userId: string;
  changeImage: ChangeImageInterface;
}) => {
  const [image, setImage] = useState<{ url: string; public_id: string }>({
    url: changeImage.image,
    public_id: changeImage.imagePublicId,
  });

  const handleChangeImage = (url: string, public_id: string) => {
    updateProfileImage(userId, {
      image: url,
      imagePublicId: public_id,
    })
      .then((data) => {
        if (data?.success) {
          toast.success(data?.success);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="flex flex-col items-center my-2">
      <ProfileAvatar image={image.url} alt="profile" width="24" height="24" />
      <CldUploadButton
        uploadPreset="flameit-profile"
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
        className="px-4 py-2 flex items-center space-x-2 text-[#777777]"
      >
        <span className="text-xs px-4 py-2 bg-[#0095f6] text-white shadow hover:bg-[#0095f6]/90 rounded">
          Change Photo{" "}
        </span>
      </CldUploadButton>
    </div>
  );
};
export default ChangePhoto;
