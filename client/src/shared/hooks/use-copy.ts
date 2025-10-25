import { useState } from "react";
import { toast as sonnerToast } from "sonner";

interface CopyOptions {
  toast?: string;
  timeout?: number;
}

export function useCopy() {
  const [copied, setCopied] = useState(false);

  async function copy(
    text: string,
    { toast, timeout = 2000 }: CopyOptions = {},
  ) {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
      toast && sonnerToast.success(toast, { duration: timeout });

      return true;
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopied(false);

      return false;
    }
  }

  return { copy, copied };
}
