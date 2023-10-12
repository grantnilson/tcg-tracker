import Navbar from "./Navbar";
import Footer from "./Footer";
import { useUser, useSession } from "@supabase/auth-helpers-react";
import { type NextRequest, NextResponse } from "next/server";

export default function Layout({ children }: any) {
  const user = useUser();
  console.log("layout user : ", user);

  const session = useSession();

  if (!session || !session.user) {
    // If there is no session or no user in the session, you can return a message or a different component.
    return NextResponse.redirect(new URL("/Accounts"), {
      status: 302,
    });
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
