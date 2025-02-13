"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProfileAvatar } from "../avatar";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { UserInfo } from "@/types/types";

const Stories = ({
  userImage,
  stories,
}: {
  userImage: string;
  stories: UserInfo[];
}) => {
  return (
    <div className="h-20 mb-5">
      <Carousel>
        <CarouselContent className="w-full gap-2 px-3">
          <CarouselItem className="basis-1/1">
            <Link
              href={"/add-story"}
              className="flex flex-col items-center justify-center gap-1"
            >
              <div className="w-16 h-16 rounded-full relative">
                <ProfileAvatar
                  image={userImage as string}
                  alt="story"
                  width="16"
                  height="16"
                />
                <div className="absolute -bottom-1 right-0">
                  <PlusCircleIcon
                    color="white"
                    fill="#0095f6"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <p className="truncate w-16 text-xs">Your Story</p>
            </Link>
          </CarouselItem>
          {stories?.map((story, idx) => (
            <Link href={`/stories`} key={idx}>
              <CarouselItem className="basis-1/1">
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="w-16 h-16 rounded-full">
                    <ProfileAvatar
                      image={story.image as string}
                      alt="story"
                      width="16"
                      height="16"
                    />
                  </div>
                  <p className="truncate w-full text-center text-xs">
                    {story.username}
                  </p>
                </div>
              </CarouselItem>
            </Link>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
export default Stories;
