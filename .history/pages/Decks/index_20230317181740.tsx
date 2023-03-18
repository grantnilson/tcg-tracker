import React from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Deck from "../../components/Deck";

type Props = {};

export default function Decks() {
  const session = useSession();

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <div>Error no logged in session</div>
      ) : (
        <Deck session={session} />
      )}
    </div>
  );
}
