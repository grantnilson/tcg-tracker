import Navbar from "./Navbar";
import Footer from "./Footer";
import { useUser } from "@supabase/auth-helpers-react";

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
