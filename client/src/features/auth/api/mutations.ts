import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { useAuthStore } from "@/shared/stores/auth.store";
import { connectSocket, disconnectSocket } from "@/shared/api/socket";
import { useVerificationStore } from "../stores/verification.store";

import type { AuthResponse } from "@/shared/types/api.types";
import type { OtpInput, SigninInput, SignupInput } from "../schema";

export function useSignupRequestMutation() {
  const setData = useVerificationStore((state) => state.setData);
  const setCooldown = useVerificationStore((state) => state.setCooldown);

  return useMutation({
    mutationFn: ({ input }: { input: SignupInput }) =>
      api
        .post<{ cooldown: number }>("/auth/signup/request", input)
        .then((res) => res.data),

    onSuccess: ({ cooldown }, { input }) => {
      setData({ email: input.email, name: input.name });
      setCooldown(cooldown);
    },
  });
}

export function useSignupResendOtpMutation() {
  const setCooldown = useVerificationStore((state) => state.setCooldown);

  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      api
        .post<{ cooldown: number }>("/auth/signup/resend-otp", { email })
        .then((res) => res.data),

    onSuccess: ({ cooldown }) => {
      setCooldown(cooldown);
    },
  });
}

export function useSignupVerifyMutation() {
  const { email } = useVerificationStore((state) => state.data)!;
  const reset = useVerificationStore((state) => state.reset);

  const signin = useAuthStore((state) => state.signin);

  return useMutation({
    mutationFn: ({ input }: { input: OtpInput }) =>
      api
        .post<AuthResponse>(
          "/auth/signup/verify",
          { email, otp: input.otp },
          { withCredentials: true },
        )
        .then((res) => res.data),

    onSuccess: ({ accessToken, user }) => {
      signin(accessToken, user);
      connectSocket(accessToken);
      reset();
    },
  });
}

export function useSigninMutation() {
  const signin = useAuthStore((state) => state.signin);

  return useMutation({
    mutationFn: ({ input }: { input: SigninInput }) =>
      api
        .post<AuthResponse>("/auth/signin", input, { withCredentials: true })
        .then((res) => res.data),

    onSuccess: ({ accessToken, user }) => {
      signin(accessToken, user);
      connectSocket(accessToken);
    },
  });
}

export function useRefreshMutation() {
  const signin = useAuthStore((state) => state.signin);

  return useMutation({
    mutationFn: () =>
      api
        .post<AuthResponse>("/auth/refresh", undefined, {
          withCredentials: true,
        })
        .then((res) => res.data),

    onSuccess: ({ accessToken, user }) => {
      signin(accessToken, user);
      connectSocket(accessToken);
    },
  });
}

export function useSignoutMutation() {
  const signout = useAuthStore((state) => state.signout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post("/auth/signout", undefined, { withCredentials: true }),

    onSuccess: () => {
      signout();
      disconnectSocket();
      queryClient.removeQueries();
    },
  });
}
