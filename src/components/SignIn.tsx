import { signIn } from "next-auth/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { SiMicrosoft } from "react-icons/si";
import Wave from "react-wavify";

export default function SignIn() {
  return (
    <>
      <SocialLoginButtons />
      <WavyBackground />
    </>
  );
}

function WavyBackground() {
  const [showWave, setShowWave] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowWave(true), 500);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 flex h-screen w-full flex-row">
      <div className="w-2/3"></div>
      <div className="w-1/3 self-stretch overflow-hidden bg-base-400">
        <div
          className={`transition-transform duration-1000 ease-in-out ${
            showWave ? "translate-x-0" : "translate-x-[-60px]"
          }`}
        >
          <Wave
            className="ml-[150px] !w-[100vh] origin-top-left rotate-90 bg-base-400"
            fill="rgb(56, 58, 89)"
            options={{
              height: 100,
              amplitude: 10,
              speed: 0.3,
              points: 7,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function SocialLoginButtons() {
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
      className="flex w-8/12 min-w-[200px] max-w-[500px] flex-col items-center justify-center gap-3 rounded-lg bg-white p-4 px-10 py-2
  shadow-md transition-colors duration-200 hover:bg-neutral-300 sm:flex-row sm:px-20 lg:min-w-[400px]"
    >
      {children}
    </button>
  );
};
