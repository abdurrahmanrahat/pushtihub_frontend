import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "./GoogleLogin";

const clientID = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;

const GoogleAuthWrapper = () => {
  return (
    <GoogleOAuthProvider clientId={clientID as string}>
      <GoogleLogin />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthWrapper;
