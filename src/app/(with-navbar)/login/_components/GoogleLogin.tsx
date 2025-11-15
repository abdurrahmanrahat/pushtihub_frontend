"use client";

import { IMAGES } from "@/image-data";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/reducers/authSlice";
import { storeUserInfo } from "@/services/auth.services";
import { decodedToken } from "@/utils/jwt";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const BACKED_URL = process.env.NEXT_PUBLIC_BACKED_URL;

const GoogleLogin = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleGoogleSuccess = async (authResult: CodeResponse) => {
    try {
      if (authResult?.code) {
        const res = await axios.get(
          `${BACKED_URL}/auth/google?code=${authResult.code}`
        );

        const { accessToken } = res.data.data;

        if (accessToken) {
          const user = decodedToken(accessToken);
          dispatch(setUser({ user }));
          storeUserInfo({ accessToken }); // local storage

          toast.success(res.data.message);

          router.push("/");
        } else {
          toast.error(res.data.message || "Something went wrong!");
        }
      }
    } catch (error: any) {
      console.error("Error requesting Google auth:", error);
      toast.error(
        error?.data?.errorSources[0].message || "Google Login Failed!"
      );
    }
  };

  const handleGoogleError = (
    error: Pick<CodeResponse, "error" | "error_description" | "error_uri">
  ) => {
    console.error("Google login error:", error);

    toast.error("Google Login Failed!");
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: "auth-code",
  });

  return (
    <div
      className="flex justify-center items-center gap-2 border p-2 border-gray-200 dark:border-gray-700 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      onClick={handleGoogleLogin}
    >
      {/* <FaGoogle size={20} /> */}
      <Image
        src={IMAGES.shared.GoogleLogo}
        alt="google"
        width={20}
        height={20}
      />
      <p className="text-gray-700 dark:text-gray-300">Continue with Google</p>
    </div>
  );
};

export default GoogleLogin;
