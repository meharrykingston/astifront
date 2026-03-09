"use client";

import { useEffect, useState } from "react";

type Options = {
  speed?: number;
  active?: boolean;
};

export function useTypedText(text: string, { speed = 18, active = true }: Options = {}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!active) {
      setValue(text);
      return;
    }
    setValue("");
    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      setValue(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(id);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, active]);

  return value;
}
