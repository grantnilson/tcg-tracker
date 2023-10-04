import React from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "../../components/Account/AccountForm";

type Props = {};

export default function Accounts() {
  const session = useSession();
  //console.log("accounts index.tsx session : ", session);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <Account session={session} />
    </div>
  );
}
