"use client";

import { loginUser } from "@/app/actions/loginUser";
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

const userLoginSchema = z.object({
  email: z.string().email("Enter email"),
  password: z.string().min(1, "Enter password"),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleLogin = async (values: FieldValues) => {
    setIsLoading(true);
    try {
      const res = await loginUser(values);

      if (res.success) {
        const accessToken = res.data.accessToken;

        const user = decodedToken(accessToken);
        storeUserInfo({ accessToken });

        dispatch(setUser({ user }));

        toast.success(res.message);

        setIsLoading(false);
        router.push("/");
      } else {
        toast.error(res.message || "Something went wrong!");

        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error(
        error?.data?.errorSources[0].message || "Something went wrong!"
      );

      setIsLoading(false);
    }
  };

  return (
    <MYForm
      onSubmit={handleLogin}
      schema={userLoginSchema}
      defaultValues={{
        email: "admin@gmail.com",
        password: "admin123",
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-medium">
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
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <MYInput
              name="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-2 w-full">
          <Button className="h-11 cursor-pointer w-full" type="submit">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin [animation-duration:1.4s]" />
                <span>Signing...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </div>
    </MYForm>
  );
};

export default LoginForm;
