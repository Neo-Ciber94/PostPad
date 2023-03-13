import { signIn } from "next-auth/react";
import { PropsWithChildren } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignIn() {
  const handleGoogleLogin = async () => {
    await signIn("google", {
      callbackUrl: "/posts",
    });
  };

  const handleGithubLogin = async () => {
    await signIn("github", {
      callbackUrl: "/posts",
    });
  };

  return (
    <div className="my-auto flex h-full flex-col items-center gap-4 py-40">
      <SocialIcon onClick={handleGoogleLogin}>
        <FcGoogle size={25} /> <span>Log in with Google</span>
      </SocialIcon>

      <SocialIcon onClick={handleGithubLogin}>
        <FaGithub size={25} /> <span>Log in with Github</span>
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
      className="flex flex-col items-center gap-3 rounded-lg bg-white p-4 px-10 
  py-2 shadow-md transition-colors duration-200 hover:bg-neutral-300 sm:flex-row sm:px-20"
    >
      {children}
    </button>
  );
};
