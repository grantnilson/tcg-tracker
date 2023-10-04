import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  SessionContextProvider,
  useSession,
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import Link from "next/link";
import Account from "../components/Account";
import AuthForm from "@/components/Auth/AuthForm";

const Home = () => {
  const session = useSession();
  const sessionContext = useSessionContext();
  console.log("home page session : ", session);
  const supabase = useSupabaseClient();

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <div className="row">
          <div className="col-6">
            <h1 className="header">TCG-Tracker Application</h1>
          </div>
          <div className="col-6 auth-widget">
            <AuthForm />
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
