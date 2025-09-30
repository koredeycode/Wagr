"use client";

import { useRouter } from "next/navigation";

const SignInButton = () => {
  const router = useRouter();
  return (
    <button
      className="btn-primary bg-primary h-12 px-6 text-base font-bold"
      onClick={() => {
        router.push("sign-in");
      }}
    >
      <span className="truncate">Sign In Now</span>
    </button>
  );
};

export default SignInButton;
