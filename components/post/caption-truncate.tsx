"use client";

import Link from "next/link";
import React, { useState } from "react";

const TruncateCaption = ({
  username,
  text,
  maxLength = 100,
}: {
  username: string;
  text: string;
  maxLength?: number;
}) => {
  const [showFull, setShowFull] = useState(false);

  const handleToggle = () => {
    setShowFull(!showFull);
  };

  // Function to convert newlines to <br>
  const formatText = (text: string) => {
    return text.split("\\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  if (text.length <= maxLength) {
    return (
      <p className="capitalize-first">
        <Link href={`/${username}`} className="text-sm font-semibold pr-2">
          {username}
        </Link>
        {formatText(text)}
      </p>
    );
  }

  return (
    <p className="w-full break-words">
      <Link href={`/${username}`} className="text-sm font-semibold pr-1">
        {username}
      </Link>
      <span className="opacity-80 text-sm break-words capitalize-first">
        {showFull ? (
          formatText(text) // Show full text with formatted newlines
        ) : (
          <>
            {formatText(text.slice(0, maxLength))}
            ...{" "}
          </>
        )}
      </span>
      <span
        onClick={handleToggle}
        className="opacity-60 cursor-pointer font-semibold"
      >
        {showFull ? "show less" : "more"}
      </span>
    </p>
  );
};

export default TruncateCaption;
