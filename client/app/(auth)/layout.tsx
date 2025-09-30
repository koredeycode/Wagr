import NavBar from "@/components/NavBar";
import { auth } from "@/lib/auth";
import { NotificationProvider } from "@/lib/NotificationContext";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!result?.session?.userId) {
    redirect("/sign-in");
  }

  return (
    <>
      <NotificationProvider>
        <NavBar />
        {children}
      </NotificationProvider>
    </>
  );
}
