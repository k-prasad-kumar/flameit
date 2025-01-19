import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    userImage: { type: String, required: true },
    images: [
      {
        cdnUrl: { type: String, required: true },
        uuid: { type: String, required: true },
      },
    ],
    caption: { type: String, required: true },
    likes: [{ type: String }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export const Post = mongoose.models?.Post || mongoose.model("Post", postSchema);
