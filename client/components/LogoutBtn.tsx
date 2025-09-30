"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const LogoutBtn = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("logout failed: ", error);
    }
  };

  return (
    <button
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      onClick={handleLogout}
    >
      <span className="material-symbols-outlined"> logout </span>
    </button>
  );
};

export default LogoutBtn;
