import { create } from "zustand";

type VerificationStep = "request" | "verify";
interface UserData {
  email: string;
  name?: string;
}

interface VerificationStore {
  step: VerificationStep;
  data: UserData | null;
  cooldown: number | null;
  setStep: (step: VerificationStep) => void;
  setData: (data: UserData) => void;
  setCooldown: (cooldown: number) => void;
  reset: () => void;
}

let interval: NodeJS.Timeout | null = null;

export const useVerificationStore = create<VerificationStore>((set) => ({
  step: "request",
  data: null,
  cooldown: null,
  setStep: (step) => set({ step }),
  setData: (data) => set({ data }),
  setCooldown: (cooldown) => {
    // Clear any running timers
    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    set({ cooldown });

    // Start a new timer if cooldown is not already zero
    if (cooldown > 0) {
      interval = setInterval(() => {
        set((state) => {
          if (state.cooldown && state.cooldown > 1) {
            // Timer is not finished yet, decrement one
            return { cooldown: state.cooldown - 1 };
          } else {
            // Timer is finished, clear it and set cooldown to zero
            if (interval) {
              clearInterval(interval);
              interval = null;
            }
            return { cooldown: 0 };
          }
        });
      }, 1000);
    }
  },
  reset: () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    set({ data: null, cooldown: null, step: "request" });
  },
}));
