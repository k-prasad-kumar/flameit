"use client";

import { useEffect } from "react";

function ContextMenu() {
  useEffect(() => {
    // Disable context menu on long press (mobile) and right-click (desktop)
    const disableContextMenu = (event: { preventDefault: () => void }) => {
      event.preventDefault();
    };

    // Disable double-click (desktop)
    const disableDoubleClick = (event: { preventDefault: () => void }) => {
      event.preventDefault();
    };

    // Add event listeners
    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("dblclick", disableDoubleClick);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("dblclick", disableDoubleClick);
    };
  }, []);

  return null;
}

export default ContextMenu;
