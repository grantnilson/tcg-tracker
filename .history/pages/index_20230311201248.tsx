import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import Account from "../components/Account";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    {!session ? <div>Error</div> :  <nav>
    <Link href="/">Home</Link>
    <Link href="/Accounts">/Accounts</Link>
  </nav>}
   
  );
};

export default Home;
