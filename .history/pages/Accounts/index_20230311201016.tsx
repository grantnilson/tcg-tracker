import React from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "../../components/Account";

type Props = {};

export default function Accounts() {
  const session = useSession();

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? <div>Error</div> : <Account session={session} />}
    </div>
  );
}
