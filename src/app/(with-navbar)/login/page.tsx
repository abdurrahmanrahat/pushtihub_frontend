import GoogleAuthWrapper from "@/app/(with-navbar)/login/_components/GoogleAuthWrapper";
import Container from "@/components/shared/Ui/Container";
import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./_components/LoginForm";

export const metadata: Metadata = {
  title: "Login | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-background text-foreground">
      <Container className="max-w-md">
        <div className="flex flex-col justify-center space-y-6 shadow-cardLightShadow dark:shadow-cardDarkShadow rounded-md p-6 md:p-8 bg-white dark:bg-deep-dark">
          {/* Title & Subtitle */}
          <div className="space-y-2 text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Login
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Google Auth */}
          <GoogleAuthWrapper />

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary/90">
              Sign up
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
