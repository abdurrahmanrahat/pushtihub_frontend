import Container from "@/components/shared/Ui/Container";
import { Metadata } from "next";
import Link from "next/link";
import SignupForm from "./_components/SignupForm";

export const metadata: Metadata = {
  title: "Signup | Gadgetoria",
  description:
    "Discover genuine electronic parts and accessories for every device",
};

export default function SignUp() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Container className="max-w-md">
        <div className="flex flex-col justify-center space-y-6 shadow-cardLightShadow dark:shadow-cardDarkShadow rounded-md p-6 md:p-8 bg-white dark:bg-deep-dark">
          {/* Title & Subtitle */}
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Sign Up
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your details to sign up for an account
            </p>
          </div>

          {/* Form */}
          <SignupForm />

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/90">
              Sign in
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
