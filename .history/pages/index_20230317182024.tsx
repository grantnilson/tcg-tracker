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
        <div className="row">
          <div className="col-6">
            <h1 className="header">TCG-Tracker Application</h1>
          </div>
          <div className="col-6 auth-widget">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="dark"
            />
          </div>
        </div>
      ) : (
        <nav>
          <ul>
            <li>
              {" "}
              <Link href="/Accounts">Accounts</Link>
            </li>
            <li>
              <Link href="/Decks">Decks</Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Home;
