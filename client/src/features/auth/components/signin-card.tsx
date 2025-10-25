import { Link, useSearch } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { SigninForm } from "./signin-form";

export function SigninCard() {
  const search = useSearch({ from: "/auth/signin" });

  return (
    <Card className="m-4 w-full max-w-sm gap-4">
      <CardHeader className="gap-1 text-center">
        <CardTitle>
          <h1 className="text-lg">Welcome back</h1>
        </CardTitle>
        <CardDescription>Enter your credentials to sign in</CardDescription>
      </CardHeader>
      <CardContent>
        <SigninForm />
      </CardContent>
      <CardFooter className="text-muted-foreground mx-auto text-sm">
        <p>
          Doesn't have an account?{" "}
          <Link
            to="/auth/signup"
            search={search}
            className="text-primary underline"
          >
            Signup
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
