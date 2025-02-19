"use client";

import React, { useState } from "react";

const TruncateBio = ({
  text,
  maxLength = 100,
}: {
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
    return <p>{formatText(text)}</p>;
  }

  return (
    <p className="w-full">
      <span className="text-sm">
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
        className="font-semibold cursor-pointer opacity-75"
      >
        {showFull ? "show less" : "more"}
      </span>
    </p>
  );
};

export default TruncateBio;
