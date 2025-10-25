import { Link, useSearch } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { SignupRequestForm } from "./signup-request-form";
import { SignupVerifyForm } from "./signup-verify-form";

import { useVerificationStore } from "../stores/verification.store";
import { useSignupResendOtpMutation } from "../api/mutations";

export function SignupCard() {
  const step = useVerificationStore((state) => state.step);
  const data = useVerificationStore((state) => state.data);
  const cooldown = useVerificationStore((state) => state.cooldown);

  const search = useSearch({ from: "/auth/signup" });

  const { mutateAsync: signupResendOtp } = useSignupResendOtpMutation();

  return (
    <Card className="m-4 w-full max-w-sm gap-4">
      <CardHeader className="text-center">
        <CardTitle>
          <h1 className="text-lg">
            {step === "request" ? "Create account" : "Verify email address"}
          </h1>
        </CardTitle>
        <CardDescription>
          {step === "request"
            ? "Fill the inputs to create a new account"
            : `Enter the code we have sent to ${data!.email}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "request" ? <SignupRequestForm /> : <SignupVerifyForm />}
      </CardContent>
      <CardFooter className="text-muted-foreground mx-auto flex-col text-sm">
        {step === "verify" && cooldown !== null && (
          <p>
            Didn't get the code?{" "}
            {cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : (
              <button
                type="button"
                onClick={() => signupResendOtp({ email: data!.email })}
                className="text-primary cursor-pointer underline"
              >
                Resend code
              </button>
            )}
          </p>
        )}
        <p>
          Already have an account?{" "}
          <Link
            to="/auth/signin"
            search={search}
            className="text-primary underline"
          >
            Signin
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
