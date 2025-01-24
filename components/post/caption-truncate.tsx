"use client";

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

  if (text.length <= maxLength) {
    return (
      <p>
        <span className="text-sm font-semibold pr-2">{username}</span>
        {text}
      </p>
    );
  }

  return (
    <p>
      <span className="text-sm font-semibold pr-2">{username}</span>
      <span> {showFull ? text : `${text.slice(0, maxLength)}... `}</span>

      <span onClick={handleToggle} className="opacity-60 cursor-pointer">
        {showFull ? " ...showless" : "more"}
      </span>
    </p>
  );
};

export default TruncateCaption;
