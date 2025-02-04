"use client";

import Link from "next/link";
import React, { useState } from "react";

const TruncateCaption = ({
  username,
  text,
  maxLength = 100 as number,
}: {
  username: string;
  text: string;
  maxLength?: number;
}) => {
  const [showFull, setShowFull] = useState(false);

  const handleToggle = () => {
    setShowFull(!showFull);
  };

  if (text.length <= maxLength) {
    return (
      <p className="break-words capitalize-first">
        <Link
          href={`/${username}`}
          className="text-sm font-semibold pr-2 opacity-80"
        >
          {username}
        </Link>
        {text}
      </p>
    );
  }

  return (
    <p className="w-full break-words">
      <Link
        href={`/${username}`}
        className="text-sm font-semibold pr-1 opacity-80"
      >
        {username}
      </Link>
      <span className="opacity-80 text-sm break-words capitalize-first">
        {" "}
        {showFull ? text : `${text.slice(0, maxLength)}... `}
      </span>

      <span onClick={handleToggle} className="opacity-60 cursor-pointer">
        {showFull ? " ...showless" : "more"}
      </span>
    </p>
  );
};

export default TruncateCaption;
