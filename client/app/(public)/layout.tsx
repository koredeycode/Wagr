// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";

import Header from "@/components/Header";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const result = await auth.api.getSession({
  //   headers: await headers(), // you need to pass the headers object.
  // });

  // if (result?.session?.userId) {
  //   redirect("/sign-in");
  // }

  return (
    <>
      <Header showSignin={false} />
      {children};
    </>
  );
}
