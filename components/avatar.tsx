import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarProps {
  image: string;
  alt: string;
  width: string;
  height: string;
}

export function ProfileAvatar({ image, alt, width, height }: AvatarProps) {
  return (
    <Avatar className={`max-w-${width} max-h-${height} w-${width} h-${height}`}>
      <AvatarImage
        src={image}
        alt={alt}
        className="w-full h-auto object-cover"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
