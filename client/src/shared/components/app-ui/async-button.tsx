import { Button } from "../ui/button";

interface AsyncButtonProps extends React.ComponentProps<typeof Button> {
  label: string;
  pendingLabel: string;
  isPending: boolean;
}

export function AsyncButton({
  label,
  pendingLabel,
  isPending,
  ...props
}: AsyncButtonProps) {
  return (
    <Button disabled={isPending} {...props}>
      {isPending ? pendingLabel : label}
    </Button>
  );
}
