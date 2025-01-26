"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function CopyProfileLink({ text }: { text: string }) {
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
    <Button onClick={handleCopy} className="w-full mr-4 md:mr-0">
      {copied ? "Link Copied!" : "Share profile"}
    </Button>
  );
}
