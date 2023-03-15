import { signIn } from "next-auth/react";
import { PropsWithChildren } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { SiMicrosoft } from "react-icons/si";

export default function SignIn() {
  const handleGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/posts",
    });
  };

  const handleGithubSignIn = async () => {
    await signIn("github", {
      callbackUrl: "/posts",
    });
  };

  const handleAzureB2DSignIn = async () => {
    await signIn("azure-ad-b2c", {
      callbackUrl: "/posts",
    });
  };

  return (
    <div className="my-auto flex h-full flex-col items-center gap-4 py-40">
      <div className="mb-2 text-2xl text-white">Welcome!</div>
      <SocialIcon onClick={handleGoogleSignIn}>
        <FcGoogle size={25} /> <span>Log in with Google</span>
      </SocialIcon>

      <SocialIcon onClick={handleGithubSignIn}>
        <FaGithub size={25} /> <span>Log in with Github</span>
      </SocialIcon>

      <SocialIcon onClick={handleAzureB2DSignIn}>
        <SiMicrosoft size={25} /> <span>Log in with Microsoft</span>
      </SocialIcon>
    </div>
  );
}

type SocialIconProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const SocialIcon: React.FC<PropsWithChildren<SocialIconProps>> = ({
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className="flex min-w-[70%] flex-col items-center justify-center gap-3 rounded-lg bg-white p-4 px-10 py-2
  shadow-md transition-colors duration-200 hover:bg-neutral-300 sm:flex-row sm:px-20 lg:min-w-[400px]"
    >
      {children}
    </button>
  );
};
