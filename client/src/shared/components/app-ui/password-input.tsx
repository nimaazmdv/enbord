import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/shared/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { useState } from "react";

export function PasswordInput(
  props: React.ComponentProps<typeof InputGroupInput>,
) {
  const [show, setShow] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput
        {...props}
        data-slot="input-group-control"
        type={show ? "text" : "password"}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          variant="ghost"
          size="icon-xs"
          onClick={() => setShow((show) => !show)}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
