import Navbar from "./Navbar";
import Footer from "./Footer";
import { useUser, useSession } from "@supabase/auth-helpers-react";
import { type NextRequest, NextResponse } from "next/server";

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
