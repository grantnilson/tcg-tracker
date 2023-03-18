import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import Account from "../components/Account";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <div>Error</div>
      ) : (
        <nav>
          <Link href="/">Home</Link>
          <Link href="/Accounts">/Accounts</Link>
        </nav>
      )}
    </div>
  );
};

export default Home;
