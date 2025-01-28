"use client";

import React, { useState } from "react";

const TruncateBio = ({
  text,
  maxLength = 100 as number,
}: {
  text: string;
  maxLength?: number;
}) => {
  const [showFull, setShowFull] = useState(false);

  const handleToggle = () => {
    setShowFull(!showFull);
  };

  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  return (
    <p className="w-full">
      <span className="text-sm">
        {" "}
        {showFull ? text : `${text.slice(0, maxLength)}... `}
      </span>

      <span
        onClick={handleToggle}
        className="font-semibold cursor-pointer opacity-75"
      >
        {showFull ? " ...showless" : "more"}
      </span>
    </p>
  );
};

export default TruncateBio;
