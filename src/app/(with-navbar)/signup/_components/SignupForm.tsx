"use client";

import { loginUser } from "@/app/actions/loginUser";
import { registerUser } from "@/app/actions/registerUser";
import MYForm from "@/components/shared/Forms/MYForm";
import MYInput from "@/components/shared/Forms/MYInput";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/reducers/authSlice";
import { storeUserInfo } from "@/services/auth.services";
import { decodedToken } from "@/utils/jwt";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const userSignUpSchema = z.object({
  name: z.string().min(1, "Enter your name"),
  email: z.string().email("Enter valid email"),
  password: z.string().min(1, "Enter your password"),
});

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleSignUp = async (values: FieldValues) => {
    setIsLoading(true);
    try {
      const res = await registerUser(values);

      if (res.success) {
        // auto login after user register
        const userRes = await loginUser({
          email: values.email,
          password: values.password,
        });

        if (userRes.success) {
          const accessToken = userRes.data.accessToken;

          const user = decodedToken(accessToken);

          dispatch(setUser({ user }));
          storeUserInfo({ accessToken });

          toast.success(userRes.message);

          setIsLoading(false);
          router.push("/");
        }
      } else {
        toast.error(res.message || "Something went wrong!");

        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.data?.errorSources[0].message || "Something went wrong!"
      );

      setIsLoading(false);
    }
  };

  return (
    <MYForm
      onSubmit={handleSignUp}
      schema={userSignUpSchema}
      defaultValues={{
        name: "",
        email: "",
        password: "",
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="grid gap-1">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <MYInput name="name" placeholder="Enter your full name" />
          </div>

          {/* Email */}
          <div className="grid gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <MYInput
              name="email"
              type="email"
              placeholder="example@gmail.com"
            />
          </div>

          {/* Password */}
          <div className="grid gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <MYInput
              name="password"
              type="password"
              placeholder="Enter password"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-2 w-full">
          <Button className="h-11 cursor-pointer w-full" type="submit">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin [animation-duration:1.4s]" />{" "}
                <span>Signing...</span>
              </span>
            ) : (
              "Sign Up"
            )}
          </Button>
        </div>
      </div>
    </MYForm>
  );
};

export default SignupForm;
