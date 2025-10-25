import { createContext } from "react";
import { createContextualCan } from "@casl/react";

export const AbilityContext = createContext<any>(null);
export const Can = createContextualCan(AbilityContext.Consumer);

// Re-export for cleaner imports
export { subject } from "@casl/ability";
export { Action } from "../types/enums";
