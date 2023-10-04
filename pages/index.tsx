import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import {
  SessionContextProvider,
  useSession,
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import Link from "next/link";
import Account from "../components/Account/AccountForm";
import AuthForm from "@/components/Auth/AuthForm";

const Home = () => {
  const session = useSession();
  const sessionContext = useSessionContext();
  console.log("home page session : ", session);
  const supabase = useSupabaseClient();

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <div className="row">
        <div className="col-6">
          <h1 className="header">TCG-Tracker Application</h1>
        </div>
        <div className="col-6 auth-widget">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Home;
