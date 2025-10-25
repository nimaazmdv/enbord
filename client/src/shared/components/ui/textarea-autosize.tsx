import ReactTextareaAutosize from "react-textarea-autosize";
import { cn } from "@/shared/lib/utils";

export function TextareaAutosize({
  className,
  ...props
}: React.ComponentProps<typeof ReactTextareaAutosize>) {
  return (
    <ReactTextareaAutosize
      data-slot="textarea-autosize"
      minRows={1}
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
