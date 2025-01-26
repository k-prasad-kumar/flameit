"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function CopyLinkButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text); // Write the custom URL to the clipboard
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard"); // Reset the copied state after 2 seconds
    } catch (error) {
      console.error("Failed to copy link: ", error);
    }
  };

  return (
    <div>
      <p onClick={handleCopy} className="px-0 no-underline">
        {copied ? "Link Copied!" : "Copy Link"}
      </p>
    </div>
  );
}
