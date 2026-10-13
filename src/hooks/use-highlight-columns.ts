"use client";

import { useSyncExternalStore } from "react";

const tabletQuery = "(min-width: 768px)";
const desktopQuery = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  const tablet = window.matchMedia(tabletQuery);
  const desktop = window.matchMedia(desktopQuery);

  tablet.addEventListener("change", onChange);
  desktop.addEventListener("change", onChange);

  return () => {
    tablet.removeEventListener("change", onChange);
    desktop.removeEventListener("change", onChange);
  };
}

function getColumnCount() {
  if (window.matchMedia(desktopQuery).matches) return 3;
  if (window.matchMedia(tabletQuery).matches) return 2;
  return 1;
}

function getServerColumnCount() {
  return 1;
}

export function useHighlightColumns() {
  return useSyncExternalStore(subscribe, getColumnCount, getServerColumnCount);
}
